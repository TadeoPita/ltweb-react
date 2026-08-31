<?php
/**
 * Publicar: vuelca la base a data/projects.js.
 *
 * Esta es la pieza que hace que el sitio público siga siendo archivos
 * estáticos. MySQL es donde se trabaja; projects.js es la foto de ese trabajo
 * en el momento en que se apretó Publicar. El visitante nunca toca la base:
 * baja un archivo y listo. Si mañana la base se cae, el sitio sigue en pie.
 *
 * El archivo se escribe como JS y no como JSON a propósito. Un .js entra con
 * una etiqueta <script> normal en el <head>, así que los proyectos ya están en
 * memoria cuando React arranca: no hay pantalla de carga ni salto de maqueta.
 * Con JSON habría que ir a buscarlo por red después de que la página cargó,
 * que es justo lo que hacía la versión con Supabase.
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

/**
 * Los nombres de las columnas están en castellano y los del sitio en inglés,
 * porque el front ya venía escrito así. La traducción vive acá y en un solo
 * lugar: cambiarle el nombre a una columna no obliga a tocar React.
 */
function proyecto_para_el_sitio(array $r): array
{
    $galeria = [];
    if (!empty($r['galeria'])) {
        $decodificado = json_decode((string) $r['galeria'], true);
        if (is_array($decodificado)) {
            $galeria = array_values(array_filter($decodificado, 'is_string'));
        }
    }

    return [
        'id'          => $r['id'],
        'name'        => $r['nombre'],
        'type'        => $r['tipo'],
        'image'       => $r['imagen'],
        'url'         => $r['url'],
        'size'        => $r['tamano'],
        'home'        => (bool) $r['en_home'],
        'label'       => $r['etiqueta'] !== '' ? $r['etiqueta'] : null,
        'blurred'     => (bool) $r['difuminada'],
        'category'    => $r['categoria'] ?? '',
        'problem'     => $r['problema'] ?? '',
        'solution'    => $r['solucion'] ?? '',
        'description' => $r['descripcion'] ?? '',
        'services'    => $r['servicios'] ?? '',
        'gallery'     => $galeria,
        'beforeImage' => $r['imagen_antes'] ?? '',
    ];
}

/**
 * Escribe el archivo y devuelve cuántos proyectos salieron.
 *
 * Se escribe primero en un archivo temporal y recién al final se renombra.
 * rename() dentro del mismo disco es atómico: o está el archivo viejo entero o
 * está el nuevo entero, nunca la mitad de cada uno. Sin esto, alguien que
 * entre justo en ese instante se baja un JS cortado y ve el sitio sin
 * proyectos.
 */
function publicar(): int
{
    $rows = filas('SELECT * FROM proyectos ORDER BY posicion ASC, nombre ASC');
    $ajustes = fila('SELECT * FROM ajustes WHERE id = 1') ?? [];

    $datos = [
        'generado'  => date('c'),
        'ajustes'   => [
            'variant'     => $ajustes['variante'] ?? 'gallery',
            'pageVariant' => $ajustes['variante_pagina'] ?? 'classic',
            'heroVariant' => $ajustes['variante_hero'] ?? 'centered',
        ],
        'proyectos' => array_map('proyecto_para_el_sitio', $rows),
    ];

    // JSON_UNESCAPED_UNICODE deja los acentos y emojis como están en vez de
    // convertirlos a \uXXXX: el archivo pesa menos y se puede leer.
    // JSON_HEX_TAG escapa < y >, así un texto que contenga "</script>" no
    // puede cerrar la etiqueta y colar HTML en la página.
    $json = json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
    );

    if ($json === false) {
        throw new RuntimeException('No se pudieron convertir los datos: ' . json_last_error_msg());
    }

    $fecha = date('d/m/Y H:i');
    $contenido = <<<JS
/* Generado por el panel de LTWEB el {$fecha}.
   No editar a mano: se pisa entero en la próxima publicación. */
window.__LTWEB_DATOS__ = {$json};

JS;

    $destino = ruta_publicado();
    $carpeta = dirname($destino);
    if (!is_dir($carpeta) && !mkdir($carpeta, 0755, true) && !is_dir($carpeta)) {
        throw new RuntimeException('No se pudo crear la carpeta ' . $carpeta);
    }

    $temporal = $destino . '.tmp';
    if (file_put_contents($temporal, $contenido, LOCK_EX) === false) {
        throw new RuntimeException('No se pudo escribir en ' . $carpeta . '. Revisá los permisos.');
    }
    if (!rename($temporal, $destino)) {
        @unlink($temporal);
        throw new RuntimeException('No se pudo reemplazar ' . $destino);
    }
    chmod($destino, 0644);

    ejecutar('UPDATE ajustes SET publicado = NOW() WHERE id = 1');

    return count($rows);
}
