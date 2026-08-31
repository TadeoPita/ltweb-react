<?php
/**
 * Subida de imágenes.
 *
 * Una carpeta de subidas es el agujero clásico de cualquier panel casero: si
 * se puede dejar ahí un .php y después abrirlo, el atacante ya está corriendo
 * código en el servidor. Acá se corta por cuatro lados a la vez, porque
 * ninguno solo alcanza:
 *
 * 1. El tipo se decide leyendo los bytes del archivo con finfo, no por lo que
 *    dice el navegador ni por la extensión. Las dos cosas las escribe quien
 *    sube y se falsifican en un segundo.
 * 2. El nombre lo pone el servidor, al azar. Nunca se usa el del usuario: ahí
 *    es donde viajan los "../../" y los dobles puntos.
 * 3. La imagen se vuelve a codificar con GD. Al reconstruirla desde los
 *    píxeles, cualquier cosa escondida en los metadatos se pierde. Es lo que
 *    desarma el truco del archivo que es imagen válida y script a la vez.
 * 4. La carpeta lleva su propio .htaccess que apaga la ejecución de PHP. Si
 *    los tres pasos anteriores fallaran, el archivo igual se sirve como
 *    descarga y no se ejecuta.
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

const TIPOS_ACEPTADOS = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];

/** Ancho máximo al que se guarda. Más que esto no aporta nada en pantalla. */
const ANCHO_MAXIMO = 1600;

function asegurar_carpeta_subidas(): string
{
    $dir = ruta_subidas();
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    // El .htaccess se escribe solo, así no depende de que alguien se acuerde
    // de subirlo a mano.
    $htaccess = $dir . '/.htaccess';
    if (!is_file($htaccess)) {
        file_put_contents($htaccess, <<<'HT'
# Esta carpeta guarda lo que se sube desde el panel. Acá no se ejecuta nada.
php_flag engine off
<FilesMatch "\.(php|phtml|php3|php4|php5|php7|phps|cgi|pl|py|sh|htaccess)$">
  Require all denied
</FilesMatch>
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
</IfModule>
HT
        );
    }

    return $dir;
}

/**
 * Procesa un archivo de $_FILES.
 *
 * Devuelve ['url' => '/uploads/xxx.webp', 'archivo' => 'xxx.webp'] o lanza
 * RuntimeException con un mensaje que se le puede mostrar a la arquitecta.
 */
function guardar_imagen(array $archivo): array
{
    if (($archivo['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException(mensaje_error_subida((int) ($archivo['error'] ?? 4)));
    }

    // is_uploaded_file confirma que el archivo llegó por HTTP y no es una ruta
    // del servidor que alguien metió en el formulario.
    if (!is_uploaded_file($archivo['tmp_name'])) {
        throw new RuntimeException('El archivo no llegó bien. Probá de nuevo.');
    }

    $mbMaximos = (int) config()['mb_maximos'];
    if ($archivo['size'] > $mbMaximos * 1024 * 1024) {
        throw new RuntimeException("La imagen pesa más de {$mbMaximos} MB.");
    }

    // El tipo, leído de los bytes.
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $tipo = $finfo->file($archivo['tmp_name']);
    if (!isset(TIPOS_ACEPTADOS[$tipo])) {
        throw new RuntimeException('Solo se aceptan imágenes JPG, PNG o WebP.');
    }

    // getimagesize falla en cualquier cosa que no sea una imagen de verdad.
    $medidas = @getimagesize($archivo['tmp_name']);
    if ($medidas === false || $medidas[0] < 1 || $medidas[1] < 1) {
        throw new RuntimeException('El archivo no es una imagen válida.');
    }

    $dir = asegurar_carpeta_subidas();

    // Nombre al azar, puesto por el servidor.
    $nombre = bin2hex(random_bytes(16));

    if (function_exists('imagecreatefromstring') && function_exists('imagewebp')) {
        $archivoFinal = $nombre . '.webp';
        recodificar_a_webp($archivo['tmp_name'], $dir . '/' . $archivoFinal, $medidas[0], $medidas[1]);
    } else {
        // Sin GD no se puede recodificar. Se guarda igual, con la extensión que
        // corresponde al tipo real y no a la que traía el nombre original.
        $archivoFinal = $nombre . '.' . TIPOS_ACEPTADOS[$tipo];
        if (!move_uploaded_file($archivo['tmp_name'], $dir . '/' . $archivoFinal)) {
            throw new RuntimeException('No se pudo guardar la imagen en el servidor.');
        }
    }

    chmod($dir . '/' . $archivoFinal, 0644);

    return ['url' => url_subidas() . '/' . $archivoFinal, 'archivo' => $archivoFinal];
}

/**
 * Redibuja la imagen y la guarda como WebP.
 *
 * Además de limpiar el archivo, achica: las capturas de pantalla llegan a
 * 2500 px de ancho y en el sitio nunca se ven a más de 1600. Guardar el
 * original es peso muerto en cada visita.
 */
function recodificar_a_webp(string $origen, string $destino, int $ancho, int $alto): void
{
    $datos = file_get_contents($origen);
    $img = @imagecreatefromstring($datos);
    if ($img === false) {
        throw new RuntimeException('No se pudo procesar la imagen.');
    }

    if ($ancho > ANCHO_MAXIMO) {
        $nuevoAlto = (int) round($alto * (ANCHO_MAXIMO / $ancho));
        $chica = imagecreatetruecolor(ANCHO_MAXIMO, $nuevoAlto);
        // Sin esto los PNG con transparencia salen con fondo negro.
        imagealphablending($chica, false);
        imagesavealpha($chica, true);
        imagecopyresampled($chica, $img, 0, 0, 0, 0, ANCHO_MAXIMO, $nuevoAlto, $ancho, $alto);
        imagedestroy($img);
        $img = $chica;
    }

    $ok = imagewebp($img, $destino, 82);
    imagedestroy($img);

    if (!$ok) {
        throw new RuntimeException('No se pudo guardar la imagen convertida.');
    }
}

/**
 * Borra una imagen subida.
 *
 * basename() corta cualquier intento de salir de la carpeta: si llega
 * "../../index.php", queda "index.php" y el is_file de adentro de /uploads
 * falla. Solo se borran archivos de esa carpeta, nunca de otra.
 */
function borrar_imagen(?string $archivo): void
{
    if (!$archivo) {
        return;
    }
    $ruta = ruta_subidas() . '/' . basename($archivo);
    if (is_file($ruta)) {
        @unlink($ruta);
    }
}

function mensaje_error_subida(int $codigo): string
{
    return match ($codigo) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'La imagen es más pesada de lo que acepta el servidor.',
        UPLOAD_ERR_PARTIAL   => 'La subida se cortó por la mitad. Probá de nuevo.',
        UPLOAD_ERR_NO_FILE   => 'No elegiste ningún archivo.',
        UPLOAD_ERR_NO_TMP_DIR, UPLOAD_ERR_CANT_WRITE => 'El servidor no pudo escribir el archivo.',
        default              => 'No se pudo subir la imagen.',
    };
}
