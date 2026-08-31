# Subir la web a Hostinger

La web y el panel son **una sola app Node**. Se sube una vez y después cargás
proyectos desde el navegador, sin volver a tocar nada.

Sin Supabase, sin Firebase, sin base de datos.

---

## Una sola vez: subirla

### 1. Poner la contraseña del panel

En tu compu:

```bash
npm run clave
```

Elegís usuario y contraseña (mínimo 12 caracteres). Al final te muestra dos
líneas tipo `PANEL_USUARIO=...` y `PANEL_CLAVE_HASH=...`. **Copialas**, las vas
a necesitar en el paso 3.

### 2. Crear la app en Hostinger

hPanel → **Añadir sitio web** → **Implementa tu app web** (el ícono de Node).

Elegí **desde GitHub** y apuntá a tu repositorio, rama `main`.

Configuración:

| Campo | Valor |
|---|---|
| Comando de instalación | `npm ci` |
| Comando de construcción | `npm run build` |
| Comando de inicio | `npm start` |
| Versión de Node | 20 o superior |

### 3. Cargar la contraseña

En la configuración de la app, sección **Variables de entorno**, agregá las dos
líneas que copiaste en el paso 1.

> Van como variable y no en un archivo para que la contraseña no quede escrita
> en el repositorio.

### 4. Desplegar

Botón **Desplegar**. Cuando termina, entrá a ltweb.com.ar y ya está.

---

## Después: cargar proyectos

Entrá a **ltweb.com.ar/admin**, poné tu usuario y contraseña.

Es el mismo panel de siempre: agregar, editar, ordenar, subir fotos, elegir
cuáles van en la home.

Cuando termines apretá **Publicar al sitio**. Recién ahí se ven los cambios.

> Guardar y publicar son dos cosas distintas a propósito: podés dejar algo a
> medio cargar sin que se vea publicado.

**Desde cualquier lado.** Es una web, así que se entra desde la compu, el
celular o donde sea.

---

## Cómo está armado

**Un servidor Node** (`servidor/index.js`) que hace tres cosas: sirve el sitio
ya construido, sirve las imágenes que subís, y atiende `/api`. Sin framework —
el módulo `http` de Node alcanza, y son 60 dependencias menos que mantener.

**Los proyectos viven en `datos/proyectos.json`.** Para el volumen que maneja
esto —decenas de proyectos, una persona editando— una base de datos es
infraestructura de más: un archivo se lee entero en un milisegundo, se respalda
copiándolo y no tiene plan gratis que se pueda terminar.

**El sitio no habla con el servidor.** Publicar escribe `data/projects.js`, que
entra con una etiqueta `<script>` en el `<head>`. Cuando React arranca los
proyectos ya están en memoria: no hay pedido de red, ni pantalla de carga, ni
salto de maqueta. Es más rápido que la versión con Supabase, no solo más
barato.

---

## Por qué el scroll ya no se traba

Esto vale la pena entenderlo porque no es obvio, y era la causa real.

El problema no era cuánto pesaban las imágenes sino **cuántos píxeles tenía que
descomprimir el navegador**. Una de las portadas era de 1920×9562 —una captura
de página entera—. En disco son 6 MB, pero al dibujarla el navegador la expande
a 1920 × 9562 × 4 bytes ≈ **73 MB de memoria**. Y eso pasaba aunque en pantalla
se viera en un recuadro de 268 px.

Con veintipico así, eran cientos de megas de mapas de bits y una tanda de
decodificaciones que le comía cuadros al scroll. Bajar la calidad del WebP no
arreglaba nada: el peso bajaba, los píxeles seguían siendo los mismos.

Ahora cada portada se guarda en **tres medidas** y cada lugar pide la que
necesita: 672 px para el fondo del inicio (recortada arriba, que es la franja
que se ve), 900 px para la grilla, 1600 px para la ficha del proyecto.

Medido en la home: de 76 MB de mapas de bits a **45 MB**, y el bloqueo del hilo
principal de 376 ms a **106 ms**.

---

## Seguridad

| Riesgo | Qué lo frena |
|---|---|
| Probar contraseñas | Bloqueo por IP: 8 intentos y corta 15 minutos |
| Que se filtre la clave | Se guarda solo el hash scrypt, nunca la contraseña |
| Robar la sesión con un XSS | Cookie `HttpOnly`: JavaScript no la puede leer |
| Pedidos desde otro sitio | `SameSite=Strict` |
| Escribir sin permiso | Todo lo que modifica algo exige sesión |
| Subir un script disfrazado de imagen | Se recodifica con sharp: se redibuja desde los píxeles y el nombre lo pone el servidor |
| Leer archivos de fuera de la carpeta | Las rutas se normalizan y se comprueba que sigan adentro |

Verificado contra el servidor corriendo: clave incorrecta da 401, publicar sin
sesión da 401, al noveno intento fallido bloquea, y la cookie sale con
`HttpOnly; SameSite=Strict; Secure`.

---

## Si preferís subirlo a mano

```bash
npm run empaquetar
```

Genera `ltweb-sitio.zip` con el sitio estático. Lo subís al Administrador de
archivos y lo extraés en `public_html`.

**Pero así no hay panel**: es solo el sitio. Para cargar proyectos tendrías que
hacerlo desde tu compu con `npm run dev` y volver a subir el zip cada vez. La
app Node es lo que te permite cargar desde el navegador.
