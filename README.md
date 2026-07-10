# LT WEB — Landing en React

Réplica 1:1 de [ltweb.com.ar](https://ltweb.com.ar) (WordPress + Elementor, theme Hub) migrada a **React + Vite + Tailwind CSS v4 + Framer Motion**.

## Correr el proyecto

```bash
npm install
npm run dev      # desarrollo → http://localhost:5173
npm run build    # build de producción → dist/
npm run preview  # servir el build
```

## Estructura

```
src/
├── App.jsx                  # Orquesta las secciones en orden
├── index.css                # Theme Tailwind v4 (@theme): colores, fuentes, patrón de rayos del hero
├── data/content.js          # TODO el contenido editable (textos, FAQs, portfolio, links)
└── components/
    ├── Navbar.jsx           # Logo + redes (absolute, arriba)
    ├── BottomNav.jsx        # Menú pill flotante inferior con scroll-spy
    ├── Hero.jsx             # "Hacemos la web que soñas" + patrón radial
    ├── ClientsShowcase.jsx  # Acordeón horizontal MCH / HEY / FGM (auto-rota cada 6s)
    ├── Solutions.jsx        # "El futuro del contenido" + 3 cards
    ├── Marquee.jsx          # Chips violetas en loop infinito
    ├── Plans.jsx            # Landing Estándar / Pro / E-commerce (fondo #161616)
    ├── Statements.jsx       # Frases grandes con reveal por palabra ligado al scroll
    ├── Steps.jsx            # 3 pasos para contratar
    ├── Devices.jsx          # Cards sticky apiladas: móvil / tablet / escritorio
    ├── Portfolio.jsx        # Grilla masonry de proyectos (fondo #141414)
    ├── FAQ.jsx              # Acordeón de preguntas
    ├── SocialSection.jsx    # Instagram + chips flotantes
    └── Footer.jsx
```

## Páginas

- `/` — landing completa
- `/portfolio` — portfolio completo (el botón "Ver mas" del inicio lleva acá)
- `/admin` — panel para administrar el portfolio: agregar/editar/eliminar proyectos, elegir cuáles aparecen en el inicio, reordenar, subir imágenes y cambiar entre los dos diseños del portfolio (Clásico grilla / Nuevo lista interactiva). Los cambios se guardan en el navegador (localStorage); usá "Exportar JSON" para respaldarlos o pasarlos a otro navegador.

> **Deploy**: al ser una SPA con rutas, configurar el hosting para que todas las rutas sirvan `index.html` (en Vercel/Netlify es automático; en hosting propio, una regla de rewrite).

## Para editar contenido

Casi todo se cambia desde `src/data/content.js`: textos, preguntas del FAQ, proyectos del portfolio (nombre, tipo, imagen, URL), links de WhatsApp/Instagram.

Las imágenes locales viven en `public/images/`. Algunas se hotlinkean desde ltweb.com.ar (buscar `https://ltweb.com.ar/wp-content` en `content.js`) — conviene descargarlas a `public/images/` antes de dar de baja el WordPress.

## Tipografías y paleta

- **Phudu** — títulos display uppercase · **Be Vietnam Pro** — cuerpo · **Poppins** — subtítulos/nav
- Dark `#161616 / #141414` · Paper `#F7F7F7` · Lila `#A796F0` · Pasteles: celeste `#BFCFF5`, rosa `#FBD2CF`, verde `#C9F0D4`, naranja `#FFE2C4`, lila `#F0DBFF`, gris `#F0EFEF`
