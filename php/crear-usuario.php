<?php
/**
 * Crea el usuario del panel. Se usa UNA vez y después se borra del servidor.
 *
 * Va como archivo aparte y no dentro de admin.php porque no puede pedir
 * sesión: es lo que se corre cuando todavía no existe ninguna cuenta. Y por
 * eso mismo tiene que dejar de existir apenas cumple su función — mientras
 * esté subido, cualquiera que dé con la URL puede crear un usuario.
 *
 * El propio script se niega a funcionar si ya hay usuarios, así que aunque te
 * olvides de borrarlo no se puede usar para agregar una cuenta.
 *
 * Uso: subilo, abrí https://ltweb.com.ar/crear-usuario.php, completá, borralo.
 */

declare(strict_types=1);

require_once __DIR__ . '/admin/lib/db.php';

header('X-Robots-Tag: noindex, nofollow');

$hay = fila('SELECT COUNT(*) AS n FROM usuarios');
$yaExiste = ((int) ($hay['n'] ?? 0)) > 0;

$error = null;
$listo = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$yaExiste) {
    $usuario = trim((string) ($_POST['usuario'] ?? ''));
    $clave   = (string) ($_POST['clave'] ?? '');
    $repetir = (string) ($_POST['repetir'] ?? '');

    if (!preg_match('/^[a-zA-Z0-9._-]{3,64}$/', $usuario)) {
        $error = 'El usuario admite letras, números, punto, guion y guion bajo (3 a 64 caracteres).';
    } elseif (strlen($clave) < 12) {
        // Doce y no ocho: con ocho, una clave sin símbolos se rompe por fuerza
        // bruta en tiempo razonable aunque esté hasheada.
        $error = 'La contraseña tiene que tener al menos 12 caracteres.';
    } elseif ($clave !== $repetir) {
        $error = 'Las dos contraseñas no coinciden.';
    } else {
        ejecutar('INSERT INTO usuarios (usuario, hash_clave) VALUES (?, ?)', [
            $usuario,
            password_hash($clave, PASSWORD_DEFAULT, ['cost' => 12]),
        ]);
        $listo = true;
    }
}

function esc(?string $t): string
{
    return htmlspecialchars((string) $t, ENT_QUOTES, 'UTF-8');
}
?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Crear usuario — LTWEB</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#08080a;
       font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff}
  .caja{width:min(430px,92vw);background:#141418;border:1px solid rgba(255,255,255,.1);
        border-radius:16px;padding:32px}
  h1{margin:0 0 4px;font-size:19px}
  p{font-size:13px;color:rgba(255,255,255,.55);line-height:1.6}
  label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.12em;
        color:rgba(255,255,255,.45);margin:16px 0 6px}
  input{width:100%;padding:11px 13px;border-radius:9px;border:1px solid rgba(255,255,255,.14);
        background:rgba(255,255,255,.04);color:#fff;font-size:14px}
  button{width:100%;margin-top:24px;padding:12px;border:0;border-radius:9px;background:#fff;
         color:#08080a;font-weight:600;font-size:14px;cursor:pointer}
  .msg{margin-top:18px;padding:11px 13px;border-radius:9px;font-size:13px}
  .mal{background:rgba(220,60,60,.14);border:1px solid rgba(220,60,60,.3);color:#ffb4b4}
  .bien{background:rgba(60,190,110,.13);border:1px solid rgba(60,190,110,.3);color:#a8f0c4}
</style>
</head>
<body>
<div class="caja">
<?php if ($yaExiste): ?>
  <h1>Ya hay un usuario creado</h1>
  <p>
    Este script no hace nada más. <strong>Borralo del servidor</strong> y entrá por
    <a href="admin.php" style="color:#fff">admin.php</a>.
  </p>
  <p>
    Si perdiste la contraseña, no se puede recuperar (se guarda hasheada): hay que
    borrar la fila de la tabla <code>usuarios</code> desde phpMyAdmin y volver a subir este archivo.
  </p>
<?php elseif ($listo): ?>
  <h1>Usuario creado</h1>
  <div class="msg bien">
    Listo. Ahora <strong>borrá crear-usuario.php del servidor</strong> y entrá por
    <a href="admin.php" style="color:#a8f0c4">admin.php</a>.
  </div>
<?php else: ?>
  <h1>Crear el usuario del panel</h1>
  <p>Se hace una sola vez. Después borrá este archivo del servidor.</p>
  <form method="post" autocomplete="off">
    <label for="u">Usuario</label>
    <input id="u" name="usuario" required autofocus>
    <label for="c">Contraseña (mínimo 12 caracteres)</label>
    <input id="c" name="clave" type="password" required>
    <label for="r">Repetir contraseña</label>
    <input id="r" name="repetir" type="password" required>
    <button type="submit">Crear</button>
    <?php if ($error): ?><div class="msg mal"><?= esc($error) ?></div><?php endif; ?>
  </form>
<?php endif; ?>
</div>
</body>
</html>
