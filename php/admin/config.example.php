<?php
/**
 * Copiá este archivo como config.php y completá los datos reales.
 *
 * config.php NO va al repositorio (está en .gitignore). Este ejemplo sí, para
 * que se sepa qué hay que completar sin tener que leer el código.
 *
 * Los datos de la base salen del hPanel de Hostinger, en Bases de datos ->
 * Administración de bases de datos MySQL.
 */

return [
    // --- Base de datos -----------------------------------------------------
    // En Hostinger el host casi siempre es 'localhost'. El nombre de la base y
    // el usuario llevan un prefijo tipo u123456789_ que asigna el panel.
    'db_host'   => 'localhost',
    'db_nombre' => 'u000000000_ltweb',
    'db_usuario'=> 'u000000000_ltweb',
    'db_clave'  => 'PONER_LA_CLAVE_DE_LA_BASE',

    // --- Rutas en el servidor ---------------------------------------------
    // Absolutas y sin barra final. En Hostinger la raíz del sitio suele ser
    // /home/u000000000/domains/ltweb.com.ar/public_html
    //
    // Para averiguar la tuya sin adivinar, subí un archivo con
    // <?php echo __DIR__; y abrilo en el navegador.
    'raiz_sitio' => '/home/u000000000/domains/ltweb.com.ar/public_html',

    // Carpeta donde se guardan las imágenes que se suben desde el panel.
    // Se crea sola si no existe. Va dentro de la raíz del sitio porque las
    // imágenes tienen que ser públicas.
    'carpeta_subidas' => '/uploads',

    // Archivo que genera el botón Publicar. Es el que lee el sitio.
    'archivo_publicado' => '/data/projects.js',

    // --- Seguridad ---------------------------------------------------------
    // Intentos fallidos permitidos por IP antes de bloquear, y por cuántos
    // minutos se bloquea.
    'intentos_maximos' => 8,
    'minutos_bloqueo'  => 15,

    // Peso máximo por imagen, en megabytes.
    'mb_maximos' => 8,

    // Poné true solo si el sitio ya anda por HTTPS. Con true, la cookie de
    // sesión deja de viajar por HTTP, que es lo correcto; pero si todavía no
    // tenés certificado, no vas a poder entrar al panel.
    'solo_https' => true,
];
