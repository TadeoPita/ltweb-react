# Cómo cargar proyectos y subir la web

Sin Supabase, sin base de datos y sin PHP. Dos comandos.

---

## Cargar o editar proyectos

```bash
npm run dev
```

Abrí **http://localhost:5173/admin**. Es el mismo panel de siempre: agregar,
editar, ordenar, subir fotos, elegir cuáles van en la home.

Los cambios se guardan solos en **`datos/proyectos.json`**, un archivo del
proyecto. Las fotos que subís van a `public/images/subidas/`.

Cuando termines, apretá **Publicar al sitio**. Eso escribe
`public/data/projects.js`, que es lo que lee la web.

> Guardar y publicar son dos cosas distintas a propósito: podés dejar un
> proyecto a medio cargar sin que se vea publicado.

---

## Subir la web

```bash
npm run empaquetar
```

Genera **`ltweb-sitio.zip`** (unos 2,4 MB).

En Hostinger: **hPanel → Archivos → Administrador de archivos**, entrá a
`public_html`, subí el zip y usá **Extraer**. Después borrá el zip del
servidor.

Eso es todo. No hay más pasos.

> Los archivos van en la raíz del zip, no dentro de una carpeta. Al extraerlo
> en `public_html` queda todo en su lugar sin mover nada.

---

## Por qué es así

**El contenido viaja con el proyecto.** `datos/proyectos.json` se versiona con
git igual que el código. No depende de ningún servicio que pueda cambiar de
precio ni cortar el plan gratis, y tenés el historial completo de qué cambió y
cuándo.

**El sitio publicado no habla con nada.** `data/projects.js` entra con una
etiqueta `<script>` en el `<head>`, así que cuando React arranca los proyectos
ya están en memoria: no hay pedido de red, ni pantalla de carga, ni salto de
maqueta. Es más rápido que la versión con Supabase, no solo más barato.

**El panel solo existe mientras `npm run dev` está corriendo.** No hay panel
publicado, ni login expuesto, ni contraseña que se pueda filtrar. La web que
está en internet son archivos y nada más.

---

## Lo que hay que tener en cuenta

**Se edita desde tu computadora.** Es la contra de esto: no podés cargar un
proyecto desde el celular como podrías con un panel hosteado. A cambio no hay
servidor que mantener ni base de datos que administrar.

**Después de publicar hay que volver a subir.** Publicar escribe el archivo en
tu máquina; para que llegue al servidor hay que hacer `npm run empaquetar` y
subir el zip. Son dos pasos, no uno.

**Guardá `datos/proyectos.json` en git.** Es tu contenido. Si se pierde, se
pierden los 27 proyectos con sus textos.

---

## Preguntas que van a aparecer

**¿Y si quiero cargar desde el celular?** Necesitás el panel hosteado, y para
eso hace falta un servidor. En el hosting compartido de Hostinger eso es PHP
(hay una versión en el historial: `git show dbd6f8f`); en tu VPS con Dokploy
podría ser Node.

**¿Puedo automatizar la subida?** Sí, hay un workflow en
`.github/workflows/deploy.yml` que compila y sube por FTP. Está apagado hasta
que cargues cuatro secretos en GitHub. Con el zip no hace falta.

**El login de Firebase que pide el panel, ¿sigue haciendo falta?** No. Estaba
para autenticar las escrituras contra Supabase. Ahora el panel escribe un
archivo en tu propia máquina y solo existe mientras corrés `npm run dev`, así
que ese login no protege nada — pero sigue ahí y funciona. Sacarlo son dos
archivos menos y unos 154 KB de Firebase fuera del proyecto.
