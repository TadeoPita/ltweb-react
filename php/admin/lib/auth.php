<?php
/**
 * Acceso al panel: sesión, contraseña, CSRF y freno a la fuerza bruta.
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

/**
 * Arranca la sesión con la cookie bien configurada.
 *
 * Las tres banderas importan y ninguna viene por defecto:
 *
 * - httponly: JavaScript no puede leer la cookie. Si algún día se cuela un
 *   XSS en el sitio, no alcanza para robarse la sesión del panel.
 * - samesite Strict: la cookie no viaja en pedidos que vengan de otro sitio.
 *   Es la primera defensa contra CSRF, antes que el token.
 * - secure: solo por HTTPS, así no se puede leer en una red abierta.
 *
 * El nombre de la sesión se cambia porque "PHPSESSID" le avisa a cualquiera
 * que esto es PHP; no es una defensa real, pero no regala información.
 */
function iniciar_sesion(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name('ltweb_panel');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Strict',
        'secure'   => (bool) config()['solo_https'],
    ]);
    session_start();

    // Sesión que estuvo dos horas sin actividad se cierra sola.
    if (isset($_SESSION['visto']) && time() - $_SESSION['visto'] > 7200) {
        cerrar_sesion();
        return;
    }
    $_SESSION['visto'] = time();
}

function hay_sesion(): bool
{
    return !empty($_SESSION['usuario_id']);
}

function exigir_sesion(): void
{
    if (!hay_sesion()) {
        header('Location: admin.php');
        exit;
    }
}

function cerrar_sesion(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

// ---------------------------------------------------------------------------
// Freno a la fuerza bruta
// ---------------------------------------------------------------------------

/** La IP en binario: 4 bytes para IPv4, 16 para IPv6. */
function ip_actual(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $bin = @inet_pton($ip);
    return $bin === false ? inet_pton('0.0.0.0') : $bin;
}

function esta_bloqueado(): bool
{
    $c = config();
    $r = fila(
        'SELECT COUNT(*) AS n FROM intentos WHERE ip = ? AND cuando > (NOW() - INTERVAL ? MINUTE)',
        [ip_actual(), (int) $c['minutos_bloqueo']]
    );
    return ((int) ($r['n'] ?? 0)) >= (int) $c['intentos_maximos'];
}

function anotar_intento_fallido(): void
{
    ejecutar('INSERT INTO intentos (ip) VALUES (?)', [ip_actual()]);
    // Limpieza oportunista: sin esto la tabla crece para siempre.
    ejecutar('DELETE FROM intentos WHERE cuando < (NOW() - INTERVAL 1 DAY)');
}

function limpiar_intentos(): void
{
    ejecutar('DELETE FROM intentos WHERE ip = ?', [ip_actual()]);
}

/**
 * Verifica usuario y contraseña.
 *
 * Cuando el usuario no existe igual se corre password_verify contra un hash
 * de descarte. Si no, responder "no existe" al instante y "clave incorrecta"
 * unos milisegundos después deja adivinar qué usuarios son válidos midiendo el
 * tiempo de respuesta.
 */
function intentar_entrar(string $usuario, string $clave): bool
{
    if (esta_bloqueado()) {
        return false;
    }

    $u = fila('SELECT id, usuario, hash_clave FROM usuarios WHERE usuario = ?', [$usuario]);

    $hash = $u['hash_clave'] ?? '$2y$12$.....................................................';
    $ok = password_verify($clave, $hash) && $u !== null;

    if (!$ok) {
        anotar_intento_fallido();
        return false;
    }

    // Si el costo de bcrypt subió desde que se creó la cuenta, se rehashea.
    if (password_needs_rehash($hash, PASSWORD_DEFAULT, ['cost' => 12])) {
        ejecutar('UPDATE usuarios SET hash_clave = ? WHERE id = ?', [
            password_hash($clave, PASSWORD_DEFAULT, ['cost' => 12]),
            $u['id'],
        ]);
    }

    // Id nuevo al entrar: si alguien logró fijar un id de sesión antes del
    // login, ese id deja de servir en el momento exacto en que valdría algo.
    session_regenerate_id(true);

    $_SESSION['usuario_id'] = (int) $u['id'];
    $_SESSION['usuario']    = $u['usuario'];
    $_SESSION['visto']      = time();

    limpiar_intentos();
    ejecutar('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [$u['id']]);

    return true;
}

// ---------------------------------------------------------------------------
// CSRF
// ---------------------------------------------------------------------------

/**
 * Sin esto, otra página abierta en el mismo navegador podría mandar un
 * formulario a admin.php y borrar un proyecto usando la sesión ya iniciada,
 * sin que se vea nada. El token vive en la sesión y viaja en cada formulario:
 * una página ajena no lo puede leer, así que no lo puede mandar.
 */
function token_csrf(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function campo_csrf(): string
{
    return '<input type="hidden" name="csrf" value="' . htmlspecialchars(token_csrf(), ENT_QUOTES) . '">';
}

/**
 * hash_equals y no ==: compara en tiempo constante. Con == se puede deducir el
 * token carácter por carácter midiendo cuánto tarda en fallar.
 */
function exigir_csrf(): void
{
    $enviado = $_POST['csrf'] ?? '';
    if (!is_string($enviado) || !hash_equals($_SESSION['csrf'] ?? '', $enviado)) {
        http_response_code(403);
        exit('Token inválido. Recargá la página y probá de nuevo.');
    }
}
