<?php
/**
 * Conexión a MySQL y helpers de consulta.
 *
 * Todo pasa por PDO con consultas preparadas. Nunca se arma una consulta
 * pegando variables: eso es lo que abre la puerta a la inyección SQL, y no hay
 * forma de "escapar bien" a mano que sea confiable. Con placeholders el valor
 * viaja aparte de la consulta y el motor no puede confundirlo con código.
 */

declare(strict_types=1);

function config(): array
{
    static $config = null;
    if ($config === null) {
        $ruta = __DIR__ . '/../config.php';
        if (!is_file($ruta)) {
            http_response_code(500);
            exit('Falta admin/config.php. Copiá config.example.php y completá los datos.');
        }
        $config = require $ruta;
    }
    return $config;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $c = config();
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $c['db_host'], $c['db_nombre']);

    try {
        $pdo = new PDO($dsn, $c['db_usuario'], $c['db_clave'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Preparadas de verdad, del lado del motor. Con emulación activada
            // PDO arma la consulta como texto antes de mandarla, que es
            // justamente lo que se quiere evitar.
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        // El mensaje de PDO trae usuario y nombre de base: no se muestra.
        error_log('LTWEB db: ' . $e->getMessage());
        http_response_code(500);
        exit('No se pudo conectar a la base de datos.');
    }

    return $pdo;
}

/** Consulta que devuelve varias filas. */
function filas(string $sql, array $params = []): array
{
    $st = db()->prepare($sql);
    $st->execute($params);
    return $st->fetchAll();
}

/** Consulta que devuelve una fila o null. */
function fila(string $sql, array $params = []): ?array
{
    $st = db()->prepare($sql);
    $st->execute($params);
    $r = $st->fetch();
    return $r === false ? null : $r;
}

/** INSERT / UPDATE / DELETE. Devuelve las filas afectadas. */
function ejecutar(string $sql, array $params = []): int
{
    $st = db()->prepare($sql);
    $st->execute($params);
    return $st->rowCount();
}

/** Rutas absolutas armadas desde la config, para no repetir concatenaciones. */
function ruta_subidas(): string
{
    $c = config();
    return rtrim($c['raiz_sitio'], '/') . '/' . trim($c['carpeta_subidas'], '/');
}

function ruta_publicado(): string
{
    $c = config();
    return rtrim($c['raiz_sitio'], '/') . '/' . ltrim($c['archivo_publicado'], '/');
}

/** La misma ruta pero como la ve el navegador: /uploads/foto.webp */
function url_subidas(): string
{
    return '/' . trim(config()['carpeta_subidas'], '/');
}
