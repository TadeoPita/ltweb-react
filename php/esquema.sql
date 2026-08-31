-- Esquema del panel de LTWEB en MySQL.
--
-- Se corre una sola vez, desde phpMyAdmin en el hPanel de Hostinger:
-- Bases de datos -> phpMyAdmin -> pestaña SQL -> pegar esto -> Continuar.
--
-- utf8mb4 y no utf8: el "utf8" de MySQL es de tres bytes y no entra un emoji.
-- El sitio tiene emojis en los textos (el cohete del pie, por ejemplo), y con
-- utf8 a secas el INSERT falla o guarda basura.

CREATE TABLE IF NOT EXISTS proyectos (
  -- El id es el que va en la URL: /proyecto/auralys. Por eso es texto y lo
  -- elige quien carga, no un autoincremental.
  id                  VARCHAR(64)   NOT NULL PRIMARY KEY,

  nombre              VARCHAR(160)  NOT NULL DEFAULT '',
  tipo                VARCHAR(80)   NOT NULL DEFAULT '',
  url                 VARCHAR(500)  NOT NULL DEFAULT '',

  -- Portada. `imagen` es la ruta que sale publicada (/uploads/xxx.webp) y
  -- `imagen_archivo` el nombre del archivo en disco, que hace falta para
  -- poder borrarlo cuando se reemplaza. Sin eso las subidas viejas se
  -- acumulan para siempre.
  imagen              VARCHAR(500)  NOT NULL DEFAULT '',
  imagen_archivo      VARCHAR(255)  NOT NULL DEFAULT '',

  -- El "antes" de la comparación antes/después.
  imagen_antes        VARCHAR(500)  NOT NULL DEFAULT '',
  imagen_antes_archivo VARCHAR(255) NOT NULL DEFAULT '',

  -- Galería: array JSON de rutas. Va como JSON y no como tabla aparte porque
  -- siempre se lee y se escribe entera, nunca una foto suelta.
  galeria             JSON          NULL,

  -- Ficha del proyecto
  categoria           VARCHAR(120)  NOT NULL DEFAULT '',
  problema            TEXT          NULL,
  solucion            TEXT          NULL,
  descripcion         TEXT          NULL,
  servicios           TEXT          NULL,

  -- Presentación en la grilla
  tamano              VARCHAR(24)   NOT NULL DEFAULT 'normal',
  etiqueta            VARCHAR(80)   NOT NULL DEFAULT '',
  difuminada          TINYINT(1)    NOT NULL DEFAULT 0,

  -- Si entra o no en la home. Es lo que se pidió poder elegir desde el panel.
  en_home             TINYINT(1)    NOT NULL DEFAULT 1,

  -- Orden de la grilla. Con índice porque toda lectura ordena por acá.
  posicion            INT           NOT NULL DEFAULT 0,

  creado              TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_posicion (posicion),
  INDEX idx_home (en_home)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Ajustes generales. Una sola fila, con id fijo en 1: es la forma más simple
-- de tener un registro único sin que se puedan colar dos por error.
CREATE TABLE IF NOT EXISTS ajustes (
  id            TINYINT(1)   NOT NULL PRIMARY KEY DEFAULT 1,
  variante      VARCHAR(40)  NOT NULL DEFAULT 'gallery',
  variante_pagina VARCHAR(40) NOT NULL DEFAULT 'classic',
  variante_hero VARCHAR(40)  NOT NULL DEFAULT 'centered',
  publicado     TIMESTAMP    NULL,
  CONSTRAINT solo_una_fila CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO ajustes (id) VALUES (1);


-- Usuarios del panel.
--
-- La contraseña NUNCA se guarda como texto: se guarda el hash que devuelve
-- password_hash() de PHP (bcrypt). Aunque alguien se lleve la base entera, no
-- puede leer las contraseñas ni reusarlas en otro lado.
--
-- El usuario inicial se crea con crear-usuario.php, no a mano desde acá: hace
-- falta que PHP calcule el hash.
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario       VARCHAR(64)   NOT NULL UNIQUE,
  hash_clave    VARCHAR(255)  NOT NULL,
  creado        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso TIMESTAMP     NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Intentos de acceso fallidos, para frenar la fuerza bruta.
--
-- Sin esto, una contraseña se prueba a razón de miles por minuto. Con esto,
-- después de varios intentos fallidos desde la misma IP el panel deja de
-- responder por un rato, y probar el diccionario entero pasa a llevar años.
CREATE TABLE IF NOT EXISTS intentos (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  ip       VARBINARY(16) NOT NULL,
  cuando   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ip_cuando (ip, cuando)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
