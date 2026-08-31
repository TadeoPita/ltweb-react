<?php
/**
 * Panel de LTWEB.
 *
 * Un solo archivo con la pantalla de acceso y el editor. Va en la raíz del
 * sitio, así se entra por ltweb.com.ar/admin.php. Las librerías viven en
 * admin/, que tiene su propio .htaccess para que no se pueda abrir nada de ahí
 * desde el navegador.
 *
 * El flujo es: se edita contra MySQL, y recién al apretar Publicar se
 * regenera data/projects.js, que es lo que lee el sitio. Eso permite dejar
 * cosas a medio cargar sin que se vean publicadas.
 */

declare(strict_types=1);

require_once __DIR__ . '/admin/lib/db.php';
require_once __DIR__ . '/admin/lib/auth.php';
require_once __DIR__ . '/admin/lib/proyectos.php';
require_once __DIR__ . '/admin/lib/publicar.php';
require_once __DIR__ . '/admin/lib/traspaso.php';

iniciar_sesion();

// El panel no se indexa ni se guarda en caché.
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");

$aviso = null;
$error = null;

/** Atajo para escapar todo lo que se imprime. */
function e(?string $t): string
{
    return htmlspecialchars((string) $t, ENT_QUOTES, 'UTF-8');
}

// ---------------------------------------------------------------------------
// Acceso
// ---------------------------------------------------------------------------

if (($_POST['accion'] ?? '') === 'entrar') {
    if (esta_bloqueado()) {
        $error = 'Demasiados intentos fallidos. Esperá ' . config()['minutos_bloqueo'] . ' minutos.';
    } elseif (intentar_entrar((string) ($_POST['usuario'] ?? ''), (string) ($_POST['clave'] ?? ''))) {
        header('Location: admin.php');
        exit;
    } else {
        // Un solo mensaje para usuario inexistente y clave equivocada: decir
        // cuál de las dos falló le confirma a quien prueba que el usuario existe.
        $error = 'Usuario o contraseña incorrectos.';
    }
}

if (isset($_GET['salir'])) {
    cerrar_sesion();
    header('Location: admin.php');
    exit;
}

if (!hay_sesion()) {
    mostrar_login($error);
    exit;
}

// ---------------------------------------------------------------------------
// Acciones del panel. Todo lo que modifica algo va por POST y con token.
// ---------------------------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['accion'] ?? '') !== 'entrar') {
    exigir_csrf();
    $accion = (string) ($_POST['accion'] ?? '');
    $id = (string) ($_POST['id'] ?? '');

    try {
        switch ($accion) {
            case 'crear':
                $nuevo = crear_proyecto(trim((string) ($_POST['nombre'] ?? '')) ?: 'NUEVO PROYECTO');
                $aviso = 'Proyecto creado. Cargá los datos y acordate de publicar.';
                header('Location: admin.php?abierto=' . urlencode($nuevo) . '&ok=' . urlencode($aviso));
                exit;

            case 'guardar':
                guardar_proyecto($id, $_POST);
                $aviso = 'Cambios guardados.';
                break;

            case 'borrar':
                borrar_proyecto($id);
                reordenar_todo();
                $aviso = 'Proyecto eliminado.';
                break;

            case 'subir':
            case 'bajar':
                mover_proyecto($id, $accion === 'subir' ? -1 : 1);
                $aviso = 'Orden actualizado.';
                break;

            case 'portada':
                poner_portada($id, $_FILES['archivo'] ?? []);
                $aviso = 'Portada actualizada.';
                break;

            case 'antes':
                poner_antes($id, $_FILES['archivo'] ?? []);
                $aviso = 'Imagen "antes" actualizada.';
                break;

            case 'quitar_antes':
                quitar_antes($id);
                $aviso = 'Imagen "antes" eliminada.';
                break;

            case 'galeria_agregar':
                agregar_a_galeria($id, $_FILES['archivo'] ?? []);
                $aviso = 'Foto agregada a la galería.';
                break;

            case 'galeria_quitar':
                quitar_de_galeria($id, (int) ($_POST['indice'] ?? -1));
                $aviso = 'Foto eliminada de la galería.';
                break;

            case 'ajustes':
                ejecutar(
                    'UPDATE ajustes SET variante = ?, variante_pagina = ?, variante_hero = ? WHERE id = 1',
                    [
                        (string) ($_POST['variante'] ?? 'gallery'),
                        (string) ($_POST['variante_pagina'] ?? 'classic'),
                        (string) ($_POST['variante_hero'] ?? 'centered'),
                    ]
                );
                $aviso = 'Ajustes guardados.';
                break;

            case 'exportar':
                // Se manda como descarga y se corta acá: si siguiera, el HTML
                // del panel se pegaría al final del JSON.
                $json = exportar_json();
                header('Content-Type: application/json; charset=utf-8');
                header('Content-Disposition: attachment; filename="ltweb-proyectos-' . date('Y-m-d') . '.json"');
                echo $json;
                exit;

            case 'importar':
                $n = importar_json((string) ($_POST['json'] ?? ''));
                $aviso = "Importados {$n} proyectos. Revisá y después publicá.";
                break;

            case 'publicar':
                $n = publicar();
                $aviso = "Publicado: {$n} proyectos ya están en el sitio.";
                break;

            default:
                $error = 'Acción desconocida.';
        }
    } catch (Throwable $ex) {
        error_log('LTWEB panel: ' . $ex->getMessage());
        $error = $ex->getMessage();
    }

    // Redirección después de POST: sin esto, recargar la página repite la
    // última acción (otro borrado, otra subida).
    if ($error === null) {
        $q = 'admin.php?ok=' . urlencode((string) $aviso);
        if ($id !== '') {
            $q .= '&abierto=' . urlencode($id);
        }
        header('Location: ' . $q);
        exit;
    }
}

if (isset($_GET['ok'])) {
    $aviso = (string) $_GET['ok'];
}

$proyectos = listar_proyectos();
$ajustes = fila('SELECT * FROM ajustes WHERE id = 1') ?? [];
$abierto = (string) ($_GET['abierto'] ?? ($proyectos[0]['id'] ?? ''));

require __DIR__ . '/admin/vista.php';


// ---------------------------------------------------------------------------

function mostrar_login(?string $error): void
{
    $csrf = campo_csrf();
    ?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Panel — LTWEB</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#08080a;
       font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff}
  form{width:min(360px,92vw);background:#141418;border:1px solid rgba(255,255,255,.1);
       border-radius:16px;padding:32px}
  h1{margin:0 0 4px;font-size:19px;letter-spacing:-.01em}
  p.sub{margin:0 0 24px;font-size:13px;color:rgba(255,255,255,.45)}
  label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.12em;
        color:rgba(255,255,255,.45);margin:16px 0 6px}
  input{width:100%;padding:11px 13px;border-radius:9px;border:1px solid rgba(255,255,255,.14);
        background:rgba(255,255,255,.04);color:#fff;font-size:14px}
  input:focus{outline:none;border-color:rgba(255,255,255,.4)}
  button{width:100%;margin-top:24px;padding:12px;border:0;border-radius:9px;background:#fff;
         color:#08080a;font-weight:600;font-size:14px;cursor:pointer}
  button:hover{background:rgba(255,255,255,.9)}
  .error{margin-top:18px;padding:10px 12px;border-radius:9px;font-size:13px;
         background:rgba(220,60,60,.14);border:1px solid rgba(220,60,60,.3);color:#ffb4b4}
</style>
</head>
<body>
<form method="post" autocomplete="off">
  <h1>Panel de LTWEB</h1>
  <p class="sub">Ingresá para administrar los proyectos.</p>
  <?= $csrf ?>
  <input type="hidden" name="accion" value="entrar">
  <label for="usuario">Usuario</label>
  <input id="usuario" name="usuario" required autofocus>
  <label for="clave">Contraseña</label>
  <input id="clave" name="clave" type="password" required>
  <button type="submit">Entrar</button>
  <?php if ($error): ?><div class="error"><?= e($error) ?></div><?php endif; ?>
</form>
</body>
</html>
    <?php
}
