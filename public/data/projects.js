/* Placeholder, sin usar en producción.

   El sitio ya no carga esta ruta: lee /api/publicado.js, que siempre llega al
   servidor Node (ver servidor/lib/api.js). Esta ruta se intercepta como
   archivo estático en Hostinger, sin pasar nunca por nuestro código — es
   justamente el problema que hizo que /api/publicado.js exista.

   Este archivo se deja acá vacío, sin window.__LTWEB_DATOS__, para que si
   algo cacheado en algún lado todavía lo pide, no reciba contenido viejo
   congelado desde el build en vez de nada.

   No editar con contenido real: se compila tal cual a dist/ en cada build. */
