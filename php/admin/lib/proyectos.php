<?php
/**
 * Alta, baja, modificación y orden de proyectos.
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/imagenes.php';

/** Campos de texto que se pueden editar desde el formulario. */
const CAMPOS_TEXTO = [
    'nombre', 'tipo', 'url', 'categoria', 'problema',
    'solucion', 'descripcion', 'servicios', 'tamano', 'etiqueta',
];

function listar_proyectos(): array
{
    return filas('SELECT * FROM proyectos ORDER BY posicion ASC, nombre ASC');
}

function traer_proyecto(string $id): ?array
{
    return fila('SELECT * FROM proyectos WHERE id = ?', [$id]);
}

/**
 * Normaliza un id para que sirva como URL: /proyecto/lo-que-sea
 *
 * Se acota a letras, números y guiones. Cualquier otra cosa —espacios,
 * acentos, barras, puntos— se convierte o se descarta. Los puntos y las barras
 * importan especialmente: un id como "../algo" convertiría la ficha en una
 * ruta hacia otro lado.
 */
function id_valido(string $texto): string
{
    $t = strtolower(trim($texto));
    $t = strtr($t, [
        'á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n',
        'à'=>'a','è'=>'e','ì'=>'i','ò'=>'o','ù'=>'u','ç'=>'c',
    ]);
    $t = preg_replace('/[^a-z0-9]+/', '-', $t) ?? '';
    $t = trim($t, '-');
    return $t !== '' ? substr($t, 0, 64) : 'proyecto-' . bin2hex(random_bytes(3));
}

/** Un id que todavía no exista, agregando -2, -3... si hace falta. */
function id_libre(string $base): string
{
    $id = id_valido($base);
    $intento = $id;
    $n = 2;
    while (traer_proyecto($intento) !== null) {
        $intento = substr($id, 0, 58) . '-' . $n;
        $n++;
    }
    return $intento;
}

function crear_proyecto(string $nombre): string
{
    $id = id_libre($nombre);
    $ultima = fila('SELECT COALESCE(MAX(posicion), -1) AS p FROM proyectos');

    ejecutar(
        'INSERT INTO proyectos (id, nombre, tipo, posicion, en_home) VALUES (?, ?, ?, ?, 1)',
        [$id, $nombre, 'LANDING PAGE', ((int) $ultima['p']) + 1]
    );

    return $id;
}

/**
 * Guarda los campos de texto y las casillas.
 *
 * Solo se escriben las columnas de CAMPOS_TEXTO: aunque alguien agregue un
 * campo al formulario desde el navegador, no puede tocar una columna que no
 * esté en esa lista.
 */
function guardar_proyecto(string $id, array $datos): void
{
    if (traer_proyecto($id) === null) {
        throw new RuntimeException('Ese proyecto no existe.');
    }

    $sets = [];
    $valores = [];

    foreach (CAMPOS_TEXTO as $campo) {
        if (array_key_exists($campo, $datos)) {
            $sets[] = "$campo = ?";
            $valores[] = trim((string) $datos[$campo]);
        }
    }

    foreach (['en_home', 'difuminada'] as $campo) {
        $sets[] = "$campo = ?";
        $valores[] = !empty($datos[$campo]) ? 1 : 0;
    }

    $valores[] = $id;
    ejecutar('UPDATE proyectos SET ' . implode(', ', $sets) . ' WHERE id = ?', $valores);
}

/** Borra el proyecto y las imágenes que había subido, para no dejar huérfanas. */
function borrar_proyecto(string $id): void
{
    $p = traer_proyecto($id);
    if ($p === null) {
        return;
    }

    borrar_imagen($p['imagen_archivo'] ?: null);
    borrar_imagen($p['imagen_antes_archivo'] ?: null);

    foreach (json_decode((string) ($p['galeria'] ?? '[]'), true) ?: [] as $url) {
        if (is_string($url) && str_starts_with($url, url_subidas() . '/')) {
            borrar_imagen(basename($url));
        }
    }

    ejecutar('DELETE FROM proyectos WHERE id = ?', [$id]);
}

/**
 * Sube o baja un proyecto intercambiando su posición con el vecino.
 *
 * Va en una transacción: si se escribe una de las dos posiciones y falla la
 * otra, quedan dos proyectos con el mismo número y el orden se rompe.
 */
function mover_proyecto(string $id, int $direccion): void
{
    $lista = listar_proyectos();
    $i = null;
    foreach ($lista as $k => $p) {
        if ($p['id'] === $id) {
            $i = $k;
            break;
        }
    }
    if ($i === null) {
        return;
    }

    $j = $i + ($direccion < 0 ? -1 : 1);
    if ($j < 0 || $j >= count($lista)) {
        return;
    }

    $pdo = db();
    $pdo->beginTransaction();
    try {
        // Las posiciones guardadas pueden tener huecos; se reescribe el índice
        // del arreglo, que siempre es 0,1,2...
        $st = $pdo->prepare('UPDATE proyectos SET posicion = ? WHERE id = ?');
        $st->execute([$j, $lista[$i]['id']]);
        $st->execute([$i, $lista[$j]['id']]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}

/** Renumera 0,1,2... por si quedaron huecos o repetidos. */
function reordenar_todo(): void
{
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $st = $pdo->prepare('UPDATE proyectos SET posicion = ? WHERE id = ?');
        foreach (listar_proyectos() as $i => $p) {
            $st->execute([$i, $p['id']]);
        }
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}

// ---------------------------------------------------------------------------
// Imágenes de un proyecto
// ---------------------------------------------------------------------------

/** Portada. Reemplaza y borra la anterior. */
function poner_portada(string $id, array $archivo): void
{
    $p = traer_proyecto($id);
    if ($p === null) {
        throw new RuntimeException('Ese proyecto no existe.');
    }

    $nueva = guardar_imagen($archivo);
    ejecutar('UPDATE proyectos SET imagen = ?, imagen_archivo = ? WHERE id = ?', [$nueva['url'], $nueva['archivo'], $id]);
    borrar_imagen($p['imagen_archivo'] ?: null);
}

/** El "antes" de la comparación. */
function poner_antes(string $id, array $archivo): void
{
    $p = traer_proyecto($id);
    if ($p === null) {
        throw new RuntimeException('Ese proyecto no existe.');
    }

    $nueva = guardar_imagen($archivo);
    ejecutar('UPDATE proyectos SET imagen_antes = ?, imagen_antes_archivo = ? WHERE id = ?', [$nueva['url'], $nueva['archivo'], $id]);
    borrar_imagen($p['imagen_antes_archivo'] ?: null);
}

function quitar_antes(string $id): void
{
    $p = traer_proyecto($id);
    if ($p === null) {
        return;
    }
    borrar_imagen($p['imagen_antes_archivo'] ?: null);
    ejecutar("UPDATE proyectos SET imagen_antes = '', imagen_antes_archivo = '' WHERE id = ?", [$id]);
}

function galeria_de(string $id): array
{
    $p = traer_proyecto($id);
    $g = json_decode((string) ($p['galeria'] ?? '[]'), true);
    return is_array($g) ? array_values(array_filter($g, 'is_string')) : [];
}

function agregar_a_galeria(string $id, array $archivo): void
{
    $g = galeria_de($id);
    $nueva = guardar_imagen($archivo);
    $g[] = $nueva['url'];
    ejecutar('UPDATE proyectos SET galeria = ? WHERE id = ?', [json_encode($g, JSON_UNESCAPED_SLASHES), $id]);
}

function quitar_de_galeria(string $id, int $indice): void
{
    $g = galeria_de($id);
    if (!isset($g[$indice])) {
        return;
    }

    $url = $g[$indice];
    array_splice($g, $indice, 1);
    ejecutar('UPDATE proyectos SET galeria = ? WHERE id = ?', [json_encode($g, JSON_UNESCAPED_SLASHES), $id]);

    // Solo se borra del disco si es una imagen que subimos nosotros. Las que
    // apuntan afuera no son nuestras.
    if (str_starts_with($url, url_subidas() . '/')) {
        borrar_imagen(basename($url));
    }
}
