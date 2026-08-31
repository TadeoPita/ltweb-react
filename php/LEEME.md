# Panel de LTWEB en PHP + MySQL

Reemplaza el panel que usaba Supabase. La idea es la misma que venías
planteando:

- **MySQL** es donde se trabaja. Se edita, se sube, se prueba.
- **Publicar** vuelca todo a `data/projects.js`.
- **El sitio público sigue siendo archivos estáticos.** El visitante nunca toca
  la base: se baja un `.js` y listo.

Eso último es lo que hace que esto sea más rápido que la versión con Supabase, y
no solo más barato. `data/projects.js` entra con una etiqueta `<script>` normal
en el `<head>`, así que **cuando React arranca los proyectos ya están en
memoria**: no hay pedido de red, ni pantalla de carga, ni salto de maqueta. Y si
un día la base se cae, el sitio sigue en pie con la última publicación.

---

## Qué va dónde en Hostinger

```
public_html/
├─ index.html            ← del build (carpeta dist/)
├─ assets/               ← del build
├─ images/               ← del build
├─ .htaccess             ← del build
│
├─ admin.php             ← el panel
├─ crear-usuario.php     ← se usa una vez y SE BORRA
├─ admin/                ← librerías (protegido, no se abre desde el navegador)
│  ├─ config.php         ← lo creás vos, no está en el repo
│  ├─ vista.php
│  └─ lib/
│
├─ data/
│  └─ projects.js        ← lo escribe el panel al publicar
└─ uploads/              ← las imágenes que subís (se crea sola)
```

---

## Pasos

### 1. La base de datos

hPanel → **Bases de datos → MySQL**. Creá una base y anotá **nombre, usuario y
contraseña** (Hostinger les pone un prefijo tipo `u123456789_`).

Entrá a **phpMyAdmin** → pestaña **SQL** → pegá el contenido de `esquema.sql` →
Continuar.

### 2. Subir los archivos

Del build (`npm run build`): subí **el contenido** de `dist/` a `public_html/`.

De esta carpeta `php/`: subí `admin.php`, `crear-usuario.php` y la carpeta
`admin/` a `public_html/`.

> Es el contenido de `dist/`, no la carpeta. Si subís `dist` entera, el sitio
> queda en `ltweb.com.ar/dist/`.

### 3. La configuración

Copiá `admin/config.example.php` como `admin/config.php` y completá los datos de
la base.

Falta un dato: **la ruta absoluta del sitio**. Para no adivinarla, subí un
archivo `ruta.php` con esto, abrilo en el navegador, copiá lo que dice y
borralo:

```php
<?php echo __DIR__;
```

Eso va en `raiz_sitio`.

### 4. Crear tu usuario

Abrí `https://ltweb.com.ar/crear-usuario.php`, elegí usuario y contraseña
(mínimo 12 caracteres).

**Después borrá `crear-usuario.php` del servidor.** El script se niega a
funcionar si ya hay un usuario, pero igual no tiene por qué seguir ahí.

### 5. Traer los proyectos que ya tenés

En el panel viejo (`/admin`), botón **Exportar** — baja un JSON.
En el panel nuevo (`/admin.php`), botón **Importar** — pegá ese JSON.

Las portadas que están en Supabase se siguen viendo, porque el JSON guarda la
URL completa. Cuando quieras cortar del todo con Supabase, volvé a subir esas
imágenes desde el panel nuevo y quedan en `uploads/`.

### 6. Publicar

Botón **Publicar al sitio**. Recién ahí el sitio muestra los cambios.

---

## Cómo se trabaja

1. Entrás a `ltweb.com.ar/admin.php`.
2. Editás, subís fotos, ordenás. Nada de esto se ve todavía.
3. **Publicar al sitio** cuando esté listo.

Que guardar y publicar sean dos cosas distintas es a propósito: podés dejar un
proyecto a medio cargar sin que se vea en el sitio.

---

## Sobre la seguridad

Lo pediste explícitamente, así que va el detalle de qué protege qué:

| Riesgo | Qué lo frena |
|---|---|
| Adivinar la contraseña probando | Bloqueo por IP: 8 intentos fallidos y se corta 15 minutos |
| Que se filtre la contraseña | Se guarda solo el hash bcrypt (coste 12). Ni vos podés leerla |
| Robar la sesión con un XSS | Cookie `httponly`: JavaScript no la puede leer |
| Que otra web mande formularios con tu sesión | Token CSRF en cada formulario + cookie `SameSite=Strict` |
| Inyección SQL | Consultas preparadas del lado del motor, sin excepción |
| Subir un `.php` disfrazado de imagen | El tipo se lee de los bytes, el nombre lo pone el servidor, la imagen se recodifica con GD y la carpeta tiene la ejecución de PHP apagada |
| Leer `config.php` desde el navegador | `.htaccess` que niega toda la carpeta `admin/` |
| Fijación de sesión | Se regenera el id al entrar |
| Averiguar qué usuarios existen | Mismo mensaje y mismo tiempo de respuesta para usuario inexistente y clave incorrecta |

Tres cosas que dependen de vos:

1. **Borrá `crear-usuario.php`** después de usarlo.
2. **Contraseña larga.** El mínimo son 12 caracteres; con eso más el bloqueo por
   IP, probarla a ciegas deja de ser viable.
3. **HTTPS activo** antes de poner `'solo_https' => true`. Con el certificado
   apagado y esa opción en true no vas a poder entrar.

---

## Si algo falla

**«Falta admin/config.php»** — no lo copiaste, o quedó con otro nombre.

**«No se pudo conectar a la base de datos»** — revisá los cuatro datos de la
base. En Hostinger el usuario y el nombre llevan el prefijo `u123456789_`.

**«No se pudo escribir en .../data»** — la ruta de `raiz_sitio` está mal, o la
carpeta no tiene permiso de escritura (tiene que ser 755).

**Publiqué y el sitio no cambia** — es caché. El `.htaccess` del build ya trae
la regla que evita que `projects.js` se cachee; si subiste un `.htaccess` viejo,
ese es el problema. Probá primero con Ctrl+Shift+R para confirmarlo.

**Las imágenes se suben pero se ven cortadas o gigantes** — el servidor no tiene
GD. Sin GD no se recodifican ni se achican: se guardan tal cual. Se puede
activar desde hPanel → Avanzado → Configuración de PHP → extensiones.

---

## Lo que queda del sistema viejo

El panel de React (`/admin`) y Supabase **siguen funcionando**. No los saqué a
propósito: mientras la mudanza no esté probada en el servidor, conviene tener el
camino anterior entero.

El sitio elige solo. Si `data/projects.js` define los datos, los usa y no le
pregunta nada a Supabase. Si no —en desarrollo, o antes de la primera
publicación— sigue leyendo como venía.

Cuando el panel nuevo esté andando y hayas publicado, se puede sacar todo lo de
Supabase y Firebase del proyecto. Eso son unos 370 KB menos de JavaScript, pero
son para el `/admin`, así que hoy no los baja ningún visitante.
