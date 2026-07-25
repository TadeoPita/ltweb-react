export const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=5491159532487&text=%C2%A1Hola+equipo+LT+WEB%21+Me+contacto+mediante+la+p%C3%A1gina+web.+%C2%BFC%C3%B3mo+arrancamos+un+proyecto+juntos%3F&type=phone_number&app_absent=0'

export const INSTAGRAM_URL = 'https://www.instagram.com/ltweb__/'
export const TIKTOK_URL = 'https://www.tiktok.com/@ltweb__'
export const CONTACT_PHONE = '(+54) 11 5953-2487'
export const CONTACT_EMAIL = 'ltwebs.studio@gmail.com'
export const LOCATION = 'Buenos Aires, Argentina'

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Contacto', href: '#contacto' },
]

/* Capacidades: la franja sobria debajo del hero.
   Tres áreas concretas, sin adjetivos de venta. */
export const CAPABILITIES = ['Desarrollo web', 'E-commerce', 'Sistemas personalizados']

/* Casos destacados con formato problema/solución/servicios.
   Reemplaza el texto largo genérico anterior por información útil. */
export const CLIENTS = [
  {
    id: 'mch',
    label: 'MCH ODONTOLOGÍA LÁSER',
    title: 'MCH\nODONTOLOGÍA\nLÁSER',
    titleGradient: ['#1e3a68', '#6d9ce0'],
    bg: '#bfcff5',
    category: 'Salud',
    problem: 'Necesitaban una web que reflejara la seriedad de una clínica y mostrara con claridad sus tratamientos.',
    solution: 'Diseñamos una landing institucional con foco en tratamientos, equipo y contacto directo por WhatsApp.',
    tags: ['UX/UI', 'WordPress', 'Responsive'],
    image: '/images/76.png',
    url: 'https://mchodontolaser.com.ar',
  },
  {
    id: 'hey',
    label: 'HEY INSTITUTE',
    title: 'HEY INSTITUTE',
    titleGradient: ['#e2564e', '#f4a09a'],
    bg: '#fbd2cf',
    category: 'Educación',
    problem: 'Un instituto de inglés que necesitaba comunicar sus niveles, docentes y formas de inscripción.',
    solution: 'Armamos una web autoadministrable con secciones ordenadas para cursos, testimonios y consultas.',
    tags: ['UX/UI', 'WordPress', 'Formularios'],
    image: '/images/hey-tablets.webp',
    url: 'https://heyinstitute.com.ar',
  },
  {
    id: 'fgm',
    label: 'FGM TECH',
    title: 'FGM TECH',
    titleGradient: ['#2ebd52', '#7ce69a'],
    bg: '#c9f0d4',
    category: 'Tecnología',
    problem: 'Una empresa de tecnología en salud sin presencia digital que representara su nivel.',
    solution: 'Diseñamos un sitio claro que explica productos, casos de uso y facilita el contacto comercial.',
    tags: ['UX/UI', 'WordPress', 'Responsive'],
    image: '/images/34-1.png',
    url: 'https://fgmtech.com.ar',
  },
]

/* Servicios: las 3 áreas del brief con capacidades por área. */
export const SERVICES = [
  {
    id: 'diseno',
    icon: 'check',
    title: 'Diseño y rediseño web',
    // Los pasteles son los mismos que usan las fichas de clientes, para que
    // la paleta del sitio se sienta una sola.
    tint: 'var(--color-pastel-blue)',
    text: 'Creamos o renovamos sitios institucionales, landing pages y experiencias responsive alineadas con la identidad y los objetivos de cada empresa.',
    items: ['Arquitectura', 'UX/UI', 'Web institucional', 'Landing pages', 'Rediseño', 'Responsive'],
  },
  {
    id: 'ecommerce',
    icon: 'rocket',
    title: 'E-commerce',
    tint: 'var(--color-pastel-pink)',
    text: 'Diseñamos tiendas claras, confiables y preparadas para facilitar cada etapa del proceso de compra.',
    items: ['WooCommerce', 'Catálogos', 'Filtros', 'Medios de pago', 'Optimización de conversión'],
  },
  {
    id: 'desarrollo',
    icon: 'chat',
    title: 'Desarrollo y soluciones personalizadas',
    tint: 'var(--color-pastel-green)',
    text: 'Desarrollamos funciones e integraciones específicas cuando una solución estándar no alcanza.',
    items: ['Automatizaciones', 'Integraciones', 'Reservas', 'Formularios avanzados', 'Sistemas personalizados'],
  },
]

/* Servicios complementarios: se muestran como capacidades adicionales debajo del bloque principal. */
export const EXTRA_CAPABILITIES = ['SEO', 'Mantenimiento', 'Rendimiento', 'Soporte']

/* Diferenciales del estudio. Cada uno lleva un ícono de lucide y una línea
   corta que se muestra al pasar el cursor: la lista sola quedaba muy vacía. */
export const DIFFERENTIATORS = [
  {
    icon: 'palette',
    title: 'Diseño personalizado',
    text: 'Nada de plantillas: cada proyecto se diseña desde cero sobre tu identidad.',
  },
  {
    icon: 'message',
    title: 'Contacto directo',
    text: 'Hablás siempre con quien diseña y programa tu web, sin intermediarios.',
  },
  {
    icon: 'devices',
    title: 'Desarrollo responsive',
    text: 'Probamos el sitio en teléfono, tablet y escritorio antes de publicarlo.',
  },
  {
    icon: 'sliders',
    title: 'Sitios autoadministrables',
    text: 'Editás textos, imágenes y publicaciones desde un panel, sin depender de nosotros.',
  },
  {
    icon: 'lifebuoy',
    title: 'Acompañamiento post lanzamiento',
    text: 'Después de publicar seguimos disponibles para ajustes y consultas.',
  },
  {
    icon: 'puzzle',
    title: 'Soluciones a medida',
    text: 'Si lo estándar no alcanza, desarrollamos la función que tu negocio necesita.',
  },
  {
    icon: 'code',
    title: 'Sistemas personalizados',
    text: 'Reservas, automatizaciones e integraciones conectadas con tus herramientas.',
  },
  {
    icon: 'receipt',
    title: 'Plazos y presupuesto cerrados',
    text: 'Sabés desde el principio cuánto sale y cuándo se entrega.',
  },
]

/* Sección "¿Por dónde empezamos?": el visitante se identifica con un caso y
   lee una respuesta corta. Ayuda a que cada uno se ubique sin leer todo. */
export const STARTING_POINTS = [
  {
    id: 'primera',
    label: 'Es mi primera web',
    title: 'Arrancamos de cero, con orden.',
    text: 'Definimos juntos qué tiene que mostrar tu web, armamos la estructura y la escribimos con vos. No hace falta que traigas nada resuelto: te guiamos en cada decisión.',
    tags: ['Landing page', 'Web institucional', 'Dominio y hosting'],
  },
  {
    id: 'rediseno',
    label: 'Ya tengo una y quedó vieja',
    title: 'Rediseñamos sin perder lo que funciona.',
    text: 'Revisamos tu sitio actual, vemos qué contenido conviene mantener y qué hay que reordenar. Te decimos con franqueza si conviene rediseñar desde cero o intervenir sobre lo que ya está.',
    tags: ['Rediseño', 'Migración', 'Mejora de velocidad'],
  },
  {
    id: 'vender',
    label: 'Quiero vender online',
    title: 'Una tienda que la gente entienda.',
    text: 'Armamos el catálogo, los filtros y el proceso de compra pensando en que sea corto y claro. Integramos los medios de pago y envío que uses, y te enseñamos a cargar productos.',
    tags: ['WooCommerce', 'Medios de pago', 'Gestión de productos'],
  },
  {
    id: 'medida',
    label: 'Necesito algo a medida',
    title: 'Desarrollamos lo que no viene hecho.',
    text: 'Turnos, reservas, formularios con lógica propia, integraciones con sistemas que ya usás. Primero entendemos el circuito real de tu negocio y recién ahí proponemos cómo resolverlo.',
    tags: ['Reservas', 'Automatizaciones', 'Integraciones'],
  },
]

/* Proceso: 4 pasos claros, sin promesas vacías. */
export const STEPS = [
  {
    number: '1',
    title: 'Diagnóstico',
    text: 'Entendemos el negocio, el público, los objetivos y el alcance del proyecto.',
  },
  {
    number: '2',
    title: 'Estrategia y diseño',
    text: 'Organizamos el contenido, definimos la estructura y diseñamos la experiencia.',
  },
  {
    number: '3',
    title: 'Desarrollo',
    text: 'Construimos la web, adaptamos todos los dispositivos y verificamos sus funciones.',
  },
  {
    number: '4',
    title: 'Lanzamiento y soporte',
    text: 'Publicamos el sitio y acompañamos su evolución después de la entrega.',
  },
]

/* Portfolio: se mantiene la data actual, solo con etiquetas más precisas. */
export const PORTFOLIO = [
  { id: 'auralys', name: 'AURALYS', type: 'LANDING PAGE PRO', image: '/images/pf-auralys.png', url: 'https://auralys.com.ar', size: 'wide', home: true },
  { id: 'hey', name: 'HEY INSTITUTE', type: 'LANDING PAGE PRO', image: '/images/pf-heyinstitute.png', url: 'https://heyinstitute.com.ar', size: 'tall', home: true },
  { id: 'mch', name: 'MCH ODONTOLOGÍA LÁSER', type: 'LANDING PAGE PRO', image: 'https://ltweb.com.ar/wp-content/uploads/2025/03/mchodontolaser.com_.ar_.png', url: 'https://mchodontolaser.com.ar', size: 'tall', home: true },
  { id: 'acevedo', name: 'ACEVEDO PERFORACIONES', type: 'LANDING PAGE PRO', image: '/images/pf-acevedo.png', url: 'https://perforacionesacevedo.com.ar', size: 'normal', home: true },
  { id: 'corteza', name: 'CORTEZA', type: 'E-COMMERCE', image: '/images/pf-corteza.png', url: 'https://corteza.com.ar', size: 'tall', home: true },
  { id: 'biovitality', name: 'BIOVITALITY', type: 'LANDING PAGE', image: '/images/pf-biovitality.png', url: 'https://biovitalitywc.com', size: 'normal', label: 'Modificada por terceros actualmente', home: true },
  { id: 'fgmtech', name: 'FGM TECH', type: 'LANDING PAGE', image: '/images/pf-fgmtech.png', url: 'https://fgmtech.com.ar', size: 'full', home: true },
  { id: 'piccoli', name: 'PICCOLI QUESTION', type: 'E-COMMERCE', image: '/images/pf-piccoli.png', url: 'https://piccoliquestion.com.ar', size: 'wide', home: true },
  { id: 'mostudio', name: 'MO STUDIO', type: 'LANDING PAGE', image: 'https://ltweb.com.ar/wp-content/uploads/2025/03/FireShot-Capture-021-mostudiomedia.com-mostudiomedia.com_.png', url: 'https://mostudiomedia.com', size: 'tall', home: true },
  { id: 'mundalma', name: 'MUNDALMA', type: 'LANDING PAGE PRO', image: '/images/pf-mundalma.png', url: 'https://mundalma.com.ar', size: 'tall', home: true },
  { id: 'baldomero', name: 'CENTRO BALDOMERO', type: 'LANDING PAGE', image: '/images/pf-baldomero.jpg', url: 'https://centrobaldomero.com.ar', size: 'normal', label: 'En actualización', home: true },
  { id: 'glamhair', name: 'GLAM HAIR', type: 'LANDING PAGE', image: '/images/pf-glamhair.png', url: 'https://glamhair.com.ar', size: 'tall', home: true },
  { id: 'turnera', name: 'PROXIMAMENTE', type: 'LANDING TURNERA', image: '/images/pf-turnera.png', url: '#', size: 'normal', blurred: true, home: true },
  { id: 'modolaser', name: 'MODO LÁSER', type: 'LANDING PAGE', image: '/images/pf-modolaser.jpg', url: 'https://estancialaser.com', size: 'normal', home: true },
  { id: 'crucero', name: 'CRUCERO LÁSER', type: 'LANDING PAGE', image: '/images/pf-crucero.png', url: '#', size: 'normal', home: true },
]

/* FAQ: preguntas del brief con respuestas concretas y sin promesas vacías. */
export const FAQS = [
  {
    q: '¿Cuánto tiempo tarda el desarrollo de una web?',
    a: 'Depende del tipo de web. Una <strong>Landing Page</strong> puede estar lista en <strong>5-7 días hábiles</strong>, mientras que un <strong>E-Commerce</strong> o un sitio más complejo puede tardar <strong>2-4 semanas</strong>.',
  },
  {
    q: '¿Qué incluye el servicio de diseño web?',
    a: 'Incluye <strong>diseño personalizado, desarrollo responsivo, optimización SEO básica y configuración inicial</strong>. También brindamos integración con formularios y redes sociales.',
  },
  {
    q: '¿Puedo modificar mi sitio después de la entrega?',
    a: 'Sí, entregamos sitios <strong>autoadministrables</strong>. También ofrecemos <strong>planes de mantenimiento</strong> si preferís que nos encarguemos de las actualizaciones.',
  },
  {
    q: '¿Hacen rediseño de sitios web?',
    a: 'Sí, optimizamos y remodelamos sitios existentes para mejorar su <strong>diseño, velocidad y conversión</strong> sin perder contenido importante.',
  },
  {
    q: '¿Cuánto cuesta hacer una web?',
    a: 'Depende del tipo y funcionalidades. Escribinos y te enviamos un <strong>presupuesto personalizado</strong> sin compromiso.',
  },
  {
    q: '¿Mi sitio será visible en Google?',
    a: 'Sí, optimizamos tu web con <strong>SEO básico</strong> para que aparezca en los buscadores. Para estrategias avanzadas, ofrecemos <strong>servicios adicionales de SEO y marketing digital</strong>.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos <strong>transferencias bancarias, Mercado Pago y PayPal</strong>. También ofrecemos <strong>facilidades de pago en cuotas</strong> según el proyecto.',
  },
  {
    q: '¿Cómo contrato el servicio?',
    a: 'Fácil y rápido: <strong>nos contactás, definimos el proyecto, desarrollamos tu web y la lanzamos</strong>.',
  },
]

export const SOCIAL_CHIPS_LEFT = ['diseño web', 'e-commerce', 'WordPress', 'UX/UI']
export const SOCIAL_CHIPS_RIGHT = ['landing pages', 'rediseño', 'integraciones', 'responsive']
