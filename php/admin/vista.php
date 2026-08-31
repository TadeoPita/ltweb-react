<?php
/**
 * La pantalla del panel. La incluye admin.php una vez que hay sesión.
 *
 * Recibe: $proyectos, $ajustes, $abierto, $aviso, $error.
 *
 * Todo lo que sale de la base pasa por e() antes de imprimirse. No es paranoia
 * de más: los textos de los proyectos los escribe una persona y pueden traer
 * comillas o signos que rompan el HTML, y si alguna vez alguien pega algo con
 * una etiqueta adentro, sin escapar se ejecutaría en el navegador de quien
 * abra el panel.
 */

/** @var array $proyectos @var array $ajustes @var string $abierto */

$TAMANOS = [
    'normal' => 'Normal (1 columna)',
    'tall'   => 'Alta (1 columna, imagen alta)',
    'wide'   => 'Ancha (2 columnas)',
    'full'   => 'Completa (3 columnas)',
];
$VARIANTES = [
    'classic'  => 'Clásico (grilla)',
    'showcase' => 'Lista interactiva',
    'gallery'  => 'Galería horizontal',
    'bento'    => 'Mosaico bento',
    'stack'    => 'Mazo interactivo',
];
$VARIANTES_HERO = [
    'centered' => 'Centrado',
    'split'    => 'Dividido con captura',
    'minimal'  => 'Minimal tipográfico',
    'showcase' => 'Con proyectos abajo',
];

$actual = null;
foreach ($proyectos as $p) {
    if ($p['id'] === $abierto) {
        $actual = $p;
        break;
    }
}
$galeria = $actual ? (json_decode((string) ($actual['galeria'] ?? '[]'), true) ?: []) : [];
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
  body{margin:0;background:#f4f4f5;color:#1c1c20;
       font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:14px}
  a{color:inherit}
  header{position:sticky;top:0;z-index:10;background:#fff;border-bottom:1px solid rgba(0,0,0,.08);
         padding:14px 22px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  header h1{margin:0;font-size:15px;letter-spacing:-.01em}
  header .sep{flex:1}
  .btn{padding:8px 15px;border-radius:9px;border:1px solid rgba(0,0,0,.12);background:#fff;
       font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block}
  .btn:hover{background:rgba(0,0,0,.04)}
  .btn.principal{background:#1c1c20;color:#fff;border-color:#1c1c20}
  .btn.principal:hover{background:#000}
  .btn.peligro{color:#b42318;border-color:rgba(180,35,24,.3)}
  .btn.peligro:hover{background:rgba(180,35,24,.06)}
  .btn:disabled{opacity:.3;cursor:default}
  .aviso{margin:14px 22px 0;padding:11px 14px;border-radius:10px;font-size:13px;
         background:#e8f6ec;border:1px solid #b9e3c6;color:#14612e}
  .aviso.mal{background:#fdecea;border-color:#f5c2bd;color:#8f231a}
  .cols{display:grid;grid-template-columns:290px 1fr;gap:18px;padding:18px 22px 60px;align-items:start}
  @media(max-width:900px){.cols{grid-template-columns:1fr}}
  .caja{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:14px;padding:16px}
  .caja h2{margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:rgba(0,0,0,.4)}
  .lista{display:flex;flex-direction:column;gap:4px;max-height:65vh;overflow:auto}
  .item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:9px;
        text-decoration:none;font-size:13px}
  .item:hover{background:rgba(0,0,0,.04)}
  .item.activo{background:#1c1c20;color:#fff}
  .item .nom{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .item .oculto{font-size:10px;opacity:.55;text-transform:uppercase;letter-spacing:.1em}
  .campo{margin-bottom:14px}
  .campo label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.12em;
               color:rgba(0,0,0,.45);margin-bottom:5px}
  input[type=text],input[type=url],select,textarea{
    width:100%;padding:9px 11px;border-radius:9px;border:1px solid rgba(0,0,0,.14);
    background:#fff;font:inherit;font-size:13.5px;color:inherit}
  textarea{min-height:78px;resize:vertical;line-height:1.55}
  input:focus,select:focus,textarea:focus{outline:none;border-color:#1c1c20}
  .par{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media(max-width:640px){.par{grid-template-columns:1fr}}
  .casillas{display:flex;gap:20px;flex-wrap:wrap;margin:4px 0 18px}
  .casillas label{display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer}
  .fila-btns{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .miniatura{width:100%;max-width:340px;border-radius:10px;border:1px solid rgba(0,0,0,.1);display:block}
  .galeria{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:9px;margin-top:10px}
  .galeria figure{margin:0;position:relative}
  .galeria img{width:100%;height:76px;object-fit:cover;border-radius:8px;border:1px solid rgba(0,0,0,.1)}
  .galeria button{position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:6px;
                  border:0;background:rgba(0,0,0,.72);color:#fff;cursor:pointer;font-size:13px;line-height:1}
  .nota{font-size:12px;color:rgba(0,0,0,.45);margin:6px 0 0;line-height:1.5}
  hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:20px 0}
  .vacio{padding:36px 12px;text-align:center;color:rgba(0,0,0,.4);font-size:13px}
</style>
</head>
<body>

<header>
  <h1>Panel de LTWEB</h1>

  <form method="post" style="display:inline">
    <?= campo_csrf() ?>
    <input type="hidden" name="accion" value="publicar">
    <button class="btn principal" type="submit"
            title="Vuelca lo que hay en la base a data/projects.js, que es lo que lee el sitio">
      Publicar al sitio
    </button>
  </form>

  <?php if (!empty($ajustes['publicado'])): ?>
    <span class="nota" style="margin:0">
      Última publicación: <?= e(date('d/m/Y H:i', strtotime((string) $ajustes['publicado']))) ?>
    </span>
  <?php endif; ?>

  <span class="sep"></span>

  <form method="post" style="display:inline">
    <?= campo_csrf() ?>
    <input type="hidden" name="accion" value="exportar">
    <button class="btn" type="submit" title="Baja todo el contenido como JSON, para respaldo">Exportar</button>
  </form>
  <button class="btn" type="button" onclick="document.getElementById('caja-importar').hidden = !document.getElementById('caja-importar').hidden">Importar</button>

  <a class="btn" href="/" target="_blank" rel="noreferrer">Ver el sitio</a>
  <a class="btn" href="admin.php?salir=1">Salir</a>
</header>

<div id="caja-importar" hidden style="margin:14px 22px 0">
  <form method="post" class="caja">
    <?= campo_csrf() ?>
    <input type="hidden" name="accion" value="importar">
    <h2>Importar desde JSON</h2>
    <p class="nota" style="margin:0 0 10px">
      Reemplaza <strong>todos</strong> los proyectos por los del JSON. Sirve para restaurar un
      respaldo, o para traer el contenido del panel anterior usando su botón «Exportar».
      Las imágenes ya subidas no se borran.
    </p>
    <textarea name="json" required placeholder='{"proyectos":[ ... ]}' style="min-height:150px"></textarea>
    <button class="btn peligro" type="submit" style="margin-top:10px"
            onclick="return confirm('Esto reemplaza todos los proyectos actuales. ¿Seguir?')">
      Importar y reemplazar
    </button>
  </form>
</div>

<?php if ($aviso): ?><div class="aviso"><?= e($aviso) ?></div><?php endif; ?>
<?php if ($error): ?><div class="aviso mal"><?= e($error) ?></div><?php endif; ?>

<div class="cols">

  <!-- ------------------------------------------------------------------ -->
  <!-- Listado y orden                                                     -->
  <!-- ------------------------------------------------------------------ -->
  <div class="caja">
    <h2>Proyectos (<?= count($proyectos) ?>)</h2>

    <div class="lista">
      <?php foreach ($proyectos as $p): ?>
        <a class="item <?= $p['id'] === $abierto ? 'activo' : '' ?>"
           href="admin.php?abierto=<?= e(urlencode($p['id'])) ?>">
          <span class="nom"><?= e($p['nombre'] !== '' ? $p['nombre'] : $p['id']) ?></span>
          <?php if (!$p['en_home']): ?><span class="oculto">oculto</span><?php endif; ?>
        </a>
      <?php endforeach; ?>
      <?php if (!$proyectos): ?>
        <p class="vacio">Todavía no hay proyectos cargados.</p>
      <?php endif; ?>
    </div>

    <hr>

    <form method="post">
      <?= campo_csrf() ?>
      <input type="hidden" name="accion" value="crear">
      <div class="campo">
        <label for="nuevo">Nuevo proyecto</label>
        <input id="nuevo" type="text" name="nombre" placeholder="Nombre del proyecto" required>
      </div>
      <button class="btn principal" type="submit" style="width:100%">Agregar</button>
    </form>

    <hr>

    <!-- Ajustes generales del portfolio -->
    <form method="post">
      <?= campo_csrf() ?>
      <input type="hidden" name="accion" value="ajustes">
      <h2>Cómo se ve el portfolio</h2>

      <div class="campo">
        <label for="variante">En la home</label>
        <select id="variante" name="variante">
          <?php foreach ($VARIANTES as $v => $t): ?>
            <option value="<?= e($v) ?>" <?= ($ajustes['variante'] ?? '') === $v ? 'selected' : '' ?>><?= e($t) ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="campo">
        <label for="vpagina">En /portfolio</label>
        <select id="vpagina" name="variante_pagina">
          <?php foreach ($VARIANTES as $v => $t): ?>
            <option value="<?= e($v) ?>" <?= ($ajustes['variante_pagina'] ?? '') === $v ? 'selected' : '' ?>><?= e($t) ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="campo">
        <label for="vhero">Portada del inicio</label>
        <select id="vhero" name="variante_hero">
          <?php foreach ($VARIANTES_HERO as $v => $t): ?>
            <option value="<?= e($v) ?>" <?= ($ajustes['variante_hero'] ?? '') === $v ? 'selected' : '' ?>><?= e($t) ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <button class="btn" type="submit" style="width:100%">Guardar ajustes</button>
    </form>
  </div>

  <!-- ------------------------------------------------------------------ -->
  <!-- Editor del proyecto abierto                                         -->
  <!-- ------------------------------------------------------------------ -->
  <div class="caja">
    <?php if ($actual === null): ?>
      <p class="vacio">Elegí un proyecto de la izquierda, o creá uno nuevo.</p>
    <?php else: ?>

      <div class="fila-btns" style="margin-bottom:18px">
        <h2 style="margin:0;flex:1"><?= e($actual['nombre'] ?: $actual['id']) ?></h2>

        <form method="post" style="display:inline">
          <?= campo_csrf() ?>
          <input type="hidden" name="accion" value="subir">
          <input type="hidden" name="id" value="<?= e($actual['id']) ?>">
          <button class="btn" type="submit" title="Subir en el orden"
                  <?= $proyectos[0]['id'] === $actual['id'] ? 'disabled' : '' ?>>&uarr;</button>
        </form>

        <form method="post" style="display:inline">
          <?= campo_csrf() ?>
          <input type="hidden" name="accion" value="bajar">
          <input type="hidden" name="id" value="<?= e($actual['id']) ?>">
          <button class="btn" type="submit" title="Bajar en el orden"
                  <?= end($proyectos)['id'] === $actual['id'] ? 'disabled' : '' ?>>&darr;</button>
        </form>

        <form method="post" style="display:inline"
              onsubmit="return confirm('¿Eliminar este proyecto? También se borran sus imágenes.')">
          <?= campo_csrf() ?>
          <input type="hidden" name="accion" value="borrar">
          <input type="hidden" name="id" value="<?= e($actual['id']) ?>">
          <button class="btn peligro" type="submit">Eliminar</button>
        </form>
      </div>

      <!-- Datos ------------------------------------------------------- -->
      <form method="post">
        <?= campo_csrf() ?>
        <input type="hidden" name="accion" value="guardar">
        <input type="hidden" name="id" value="<?= e($actual['id']) ?>">

        <div class="par">
          <div class="campo">
            <label for="nombre">Nombre</label>
            <input id="nombre" type="text" name="nombre" value="<?= e($actual['nombre']) ?>">
          </div>
          <div class="campo">
            <label for="tipo">Tipo</label>
            <input id="tipo" type="text" name="tipo" value="<?= e($actual['tipo']) ?>"
                   placeholder="LANDING PAGE, E-COMMERCE...">
          </div>
        </div>

        <div class="par">
          <div class="campo">
            <label for="url">Sitio del cliente</label>
            <input id="url" type="url" name="url" value="<?= e($actual['url']) ?>" placeholder="https://...">
          </div>
          <div class="campo">
            <label for="categoria">Rubro</label>
            <input id="categoria" type="text" name="categoria" value="<?= e($actual['categoria']) ?>"
                   placeholder="Salud, Gastronomía...">
          </div>
        </div>

        <div class="par">
          <div class="campo">
            <label for="tamano">Tamaño en la grilla</label>
            <select id="tamano" name="tamano">
              <?php foreach ($TAMANOS as $v => $t): ?>
                <option value="<?= e($v) ?>" <?= $actual['tamano'] === $v ? 'selected' : '' ?>><?= e($t) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="campo">
            <label for="etiqueta">Etiqueta (opcional)</label>
            <input id="etiqueta" type="text" name="etiqueta" value="<?= e($actual['etiqueta']) ?>"
                   placeholder="Destacado, Nuevo...">
          </div>
        </div>

        <div class="casillas">
          <label>
            <input type="checkbox" name="en_home" value="1" <?= $actual['en_home'] ? 'checked' : '' ?>>
            Mostrar en la home
          </label>
          <label>
            <input type="checkbox" name="difuminada" value="1" <?= $actual['difuminada'] ? 'checked' : '' ?>>
            Portada difuminada
          </label>
        </div>

        <div class="campo">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion"><?= e($actual['descripcion']) ?></textarea>
        </div>

        <div class="par">
          <div class="campo">
            <label for="problema">El problema</label>
            <textarea id="problema" name="problema"><?= e($actual['problema']) ?></textarea>
          </div>
          <div class="campo">
            <label for="solucion">La solución</label>
            <textarea id="solucion" name="solucion"><?= e($actual['solucion']) ?></textarea>
          </div>
        </div>

        <div class="campo">
          <label for="servicios">Servicios (separados por coma)</label>
          <input id="servicios" type="text" name="servicios" value="<?= e($actual['servicios']) ?>"
                 placeholder="Diseño UX, Desarrollo, SEO">
        </div>

        <button class="btn principal" type="submit">Guardar cambios</button>
        <p class="nota">
          Guardar escribe en la base, pero el sitio no cambia hasta que apretás
          <strong>Publicar al sitio</strong>. Así podés dejar algo a medio cargar sin que se vea.
        </p>
      </form>

      <hr>

      <!-- Portada ----------------------------------------------------- -->
      <h2>Portada</h2>
      <?php if ($actual['imagen']): ?>
        <img class="miniatura" src="<?= e($actual['imagen']) ?>" alt="" loading="lazy">
      <?php endif; ?>
      <form method="post" enctype="multipart/form-data" style="margin-top:10px">
        <?= campo_csrf() ?>
        <input type="hidden" name="accion" value="portada">
        <input type="hidden" name="id" value="<?= e($actual['id']) ?>">
        <div class="fila-btns">
          <input type="file" name="archivo" accept="image/jpeg,image/png,image/webp" required>
          <button class="btn" type="submit">Subir portada</button>
        </div>
      </form>
      <p class="nota">
        Se convierte a WebP y se achica a 1600&nbsp;px de ancho. No hace falta que la prepares antes.
      </p>

      <hr>

      <!-- Antes ------------------------------------------------------- -->
      <h2>Imagen «antes»</h2>
      <?php if ($actual['imagen_antes']): ?>
        <img class="miniatura" src="<?= e($actual['imagen_antes']) ?>" alt="" loading="lazy">
        <form method="post" style="margin-top:8px">
          <?= campo_csrf() ?>
          <input type="hidden" name="accion" value="quitar_antes">
          <input type="hidden" name="id" value="<?= e($actual['id']) ?>">
          <button class="btn peligro" type="submit">Quitar</button>
        </form>
      <?php endif; ?>
      <form method="post" enctype="multipart/form-data" style="margin-top:10px">
        <?= campo_csrf() ?>
        <input type="hidden" name="accion" value="antes">
        <input type="hidden" name="id" value="<?= e($actual['id']) ?>">
        <div class="fila-btns">
          <input type="file" name="archivo" accept="image/jpeg,image/png,image/webp" required>
          <button class="btn" type="submit">Subir «antes»</button>
        </div>
      </form>
      <p class="nota">Es la captura del sitio viejo, para la comparación antes/después.</p>

      <hr>

      <!-- Galería ----------------------------------------------------- -->
      <h2>Galería (<?= count($galeria) ?>)</h2>
      <form method="post" enctype="multipart/form-data">
        <?= campo_csrf() ?>
        <input type="hidden" name="accion" value="galeria_agregar">
        <input type="hidden" name="id" value="<?= e($actual['id']) ?>">
        <div class="fila-btns">
          <input type="file" name="archivo" accept="image/jpeg,image/png,image/webp" required>
          <button class="btn" type="submit">Agregar foto</button>
        </div>
      </form>

      <?php if ($galeria): ?>
        <div class="galeria">
          <?php foreach ($galeria as $i => $foto): ?>
            <figure>
              <img src="<?= e((string) $foto) ?>" alt="" loading="lazy">
              <form method="post">
                <?= campo_csrf() ?>
                <input type="hidden" name="accion" value="galeria_quitar">
                <input type="hidden" name="id" value="<?= e($actual['id']) ?>">
                <input type="hidden" name="indice" value="<?= (int) $i ?>">
                <button type="submit" title="Quitar">&times;</button>
              </form>
            </figure>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

    <?php endif; ?>
  </div>
</div>

</body>
</html>
