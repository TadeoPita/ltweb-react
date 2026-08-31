<?php
/**
 * Importar y exportar en JSON.
 *
 * Es la misma funcion que tenia el panel anterior, y ademas es el camino para
 * la mudanza: se exporta desde el admin viejo (el boton "Exportar") y se pega
 * el resultado aca. Los nombres de campo que se leen son los del sitio
 * (name, type, image...), que son los que escribe aquel export.
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/proyectos.php';

function exportar_json(): string
{
    $datos = [
        'exportado' => date('c'),
        'ajustes'   => fila('SELECT variante, variante_pagina, variante_hero FROM ajustes WHERE id = 1'),
        'proyectos' => array_map(function (array $r): array {
            $g = json_decode((string) ($r['galeria'] ?? '[]'), true);
            return [
                'id' => $r['id'], 'name' => $r['nombre'], 'type' => $r['tipo'],
                'image' => $r['imagen'], 'url' => $r['url'], 'size' => $r['tamano'],
                'home' => (bool) $r['en_home'], 'label' => $r['etiqueta'],
                'blurred' => (bool) $r['difuminada'], 'category' => $r['categoria'],
                'problem' => $r['problema'], 'solution' => $r['solucion'],
                'description' => $r['descripcion'], 'services' => $r['servicios'],
                'gallery' => is_array($g) ? $g : [], 'beforeImage' => $r['imagen_antes'],
            ];
        }, listar_proyectos()),
    ];

    return json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/**
 * Reemplaza TODO el contenido por el del JSON.
 *
 * Va en una transaccion entera: si falla el proyecto quince, no puede quedar
 * la base con catorce proyectos nuevos y el resto de los viejos borrados.
 *
 * No se borran las imagenes subidas: el JSON las referencia por ruta, asi que
 * si se importa un export del mismo sitio las fotos siguen estando donde
 * estaban.
 */
function importar_json(string $texto): int
{
    $datos = json_decode($texto, true);
    if (!is_array($datos)) {
        throw new RuntimeException('Eso no es un JSON valido.');
    }

    // Se aceptan las dos formas: {proyectos:[...]}, {items:[...]} o un array pelado.
    // Sin array_is_list, que es de PHP 8.1: un array con claves 0,1,2... es la lista.
    $esLista = $datos !== [] && array_keys($datos) === range(0, count($datos) - 1);
    $lista = $datos['proyectos'] ?? $datos['items'] ?? ($esLista ? $datos : null);
    if (!is_array($lista)) {
        throw new RuntimeException('No se encontro la lista de proyectos en el JSON.');
    }

    $pdo = db();
    $pdo->beginTransaction();
    try {
        $pdo->exec('DELETE FROM proyectos');

        $st = $pdo->prepare(
            'INSERT INTO proyectos
             (id, nombre, tipo, url, imagen, imagen_antes, galeria, categoria, problema,
              solucion, descripcion, servicios, tamano, etiqueta, difuminada, en_home, posicion)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        );

        $n = 0;
        foreach ($lista as $i => $p) {
            if (!is_array($p)) {
                continue;
            }
            $galeria = $p['gallery'] ?? [];
            $st->execute([
                id_valido((string) ($p['id'] ?? $p['name'] ?? "proyecto-$i")),
                (string) ($p['name'] ?? ''),
                (string) ($p['type'] ?? ''),
                (string) ($p['url'] ?? ''),
                (string) ($p['image'] ?? ''),
                (string) ($p['beforeImage'] ?? ''),
                json_encode(is_array($galeria) ? array_values($galeria) : [], JSON_UNESCAPED_SLASHES),
                (string) ($p['category'] ?? ''),
                (string) ($p['problem'] ?? ''),
                (string) ($p['solution'] ?? ''),
                (string) ($p['description'] ?? ''),
                (string) ($p['services'] ?? ''),
                (string) ($p['size'] ?? 'normal'),
                (string) ($p['label'] ?? ''),
                !empty($p['blurred']) ? 1 : 0,
                // Si el campo no viene, entra en la home. Es lo que hacia el sitio antes.
                array_key_exists('home', $p) ? (!empty($p['home']) ? 1 : 0) : 1,
                $n,
            ]);
            $n++;
        }

        if (!empty($datos['ajustes']) && is_array($datos['ajustes'])) {
            $a = $datos['ajustes'];
            $pdo->prepare('UPDATE ajustes SET variante = ?, variante_pagina = ?, variante_hero = ? WHERE id = 1')
                ->execute([
                    (string) ($a['variante'] ?? $a['variant'] ?? 'gallery'),
                    (string) ($a['variante_pagina'] ?? $a['pageVariant'] ?? 'classic'),
                    (string) ($a['variante_hero'] ?? $a['heroVariant'] ?? 'centered'),
                ]);
        }

        $pdo->commit();
        return $n;
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}
