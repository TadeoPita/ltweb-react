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
   Cuatro áreas concretas, sin adjetivos de venta. */
export const CAPABILITIES = [
  'Diseño UX/UI',
  'Desarrollo WordPress',
  'E-commerce',
  'Soluciones personalizadas',
]

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
    text: 'Creamos o renovamos sitios institucionales, landing pages y experiencias responsive alineadas con la identidad y los objetivos de cada empresa.',
    items: ['Arquitectura', 'UX/UI', 'Web institucional', 'Landing pages', 'Rediseño', 'Responsive'],
  },
  {
    id: 'ecommerce',
    icon: 'rocket',
    title: 'E-commerce',
    text: 'Diseñamos tiendas claras, confiables y preparadas para facilitar cada etapa del proceso de compra.',
    items: ['WooCommerce', 'Catálogos', 'Filtros', 'Medios de pago', 'Optimización de conversión'],
  },
  {
    id: 'desarrollo',
    icon: 'chat',
    title: 'Desarrollo y soluciones personalizadas',
    text: 'Desarrollamos funciones e integraciones específicas cuando una solución estándar no alcanza.',
    items: ['Automatizaciones', 'Integraciones', 'Reservas', 'Formularios avanzados', 'Sistemas personalizados'],
  },
]

/* Servicios complementarios: se muestran como capacidades adicionales debajo del bloque principal. */
export const EXTRA_CAPABILITIES = ['SEO', 'Mantenimiento', 'Rendimiento', 'Soporte']

/* Diferenciales del estudio (sección Sobre LTWEB). */
export const DIFFERENTIATORS = [
  'Diseño personalizado',
  'Contacto directo',
  'Desarrollo responsive',
  'Sitios autoadministrables',
  'Acompañamiento después del lanzamiento',
  'Soluciones adaptadas a cada proyecto',
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
    q: '¿Cuánto tarda un proyecto?',
    a: 'Depende del alcance. Una <strong>landing page</strong> suele estar lista en <strong>1 a 2 semanas</strong>; un sitio institucional entre <strong>3 y 5 semanas</strong>; una <strong>tienda online</strong> entre <strong>4 y 8 semanas</strong>. En el diagnóstico inicial te damos un plazo estimado real.',
  },
  {
    q: '¿La web queda autoadministrable?',
    a: 'Sí. Entregamos los sitios en <strong>WordPress</strong>, con un panel para que puedas editar textos, imágenes y publicaciones sin depender de nosotros. Te dejamos un instructivo breve al momento de la entrega.',
  },
  {
    q: '¿Trabajan sobre sitios existentes?',
    a: 'Sí. Hacemos <strong>rediseños</strong> y ajustes puntuales sobre sitios que ya están online. Antes de arrancar revisamos la web actual y te decimos si conviene rediseñar desde cero o intervenir sobre lo existente.',
  },
  {
    q: '¿Ofrecen mantenimiento?',
    a: 'Sí, ofrecemos <strong>planes de mantenimiento</strong> mensuales que incluyen actualizaciones, backups, monitoreo de rendimiento y cambios menores de contenido. Es opcional, no es requisito para trabajar con nosotros.',
  },
  {
    q: '¿Cómo se define el presupuesto?',
    a: 'Después de una charla inicial armamos una <strong>propuesta escrita</strong> con alcance, plazo y precio cerrado. No trabajamos por hora ni con costos abiertos: sabés desde el principio cuánto vas a pagar.',
  },
  {
    q: '¿La web se adapta a celulares?',
    a: 'Sí, todos los sitios se diseñan <strong>responsive</strong> desde el primer boceto. Antes de publicar los probamos en teléfono, tablet y escritorio.',
  },
  {
    q: '¿Pueden integrar pagos, formularios o reservas?',
    a: 'Sí. Integramos <strong>Mercado Pago, Stripe, PayPal, WhatsApp, formularios avanzados, sistemas de reservas</strong> y otras herramientas según lo que necesite tu negocio.',
  },
]

export const SOCIAL_CHIPS_LEFT = ['diseño web', 'e-commerce', 'WordPress', 'UX/UI']
export const SOCIAL_CHIPS_RIGHT = ['landing pages', 'rediseño', 'integraciones', 'responsive']
