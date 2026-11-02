const TELEFONO = '5491159532487'

export function whatsappCon(mensaje) {
  return `https://api.whatsapp.com/send/?phone=${TELEFONO}&text=${encodeURIComponent(mensaje)}&type=phone_number&app_absent=0`
}

export const SERVICIOS = [
  {
    slug: 'diseno-web',
    area: 'Diseño y rediseño web',
    nombre: 'Diseño web',
    titulo: 'Diseño de páginas web para empresas en Buenos Aires | LTWEB',
    descripcion:
      'Diseñamos y desarrollamos páginas web empresariales e institucionales desde cero, sin plantillas. Rediseño de sitios, responsive y listas para Google.',
    volanta: 'Diseño y rediseño web',
    h1: 'Páginas web para empresas, diseñadas desde cero',
    intro:
      'Creamos o renovamos webs empresariales y sitios institucionales alineados con la identidad de cada empresa. Programamos sobre código propio y no sobre plantillas, así el sitio se adapta a lo que tu negocio necesita y no al revés.',
    incluye: [
      { t: 'Diseño a medida', d: 'Cada sitio se diseña sobre tu identidad: tipografías, colores y estructura pensados para tu marca.' },
      { t: 'Responsive de verdad', d: 'Probamos el sitio en teléfono, tablet y escritorio antes de publicarlo.' },
      { t: 'Velocidad de carga', d: 'Imágenes optimizadas y código liviano para que la página abra rápido también en el celular.' },
      { t: 'Estructura para Google', d: 'Títulos, descripciones y contenido indexable en cada página, para que los buscadores la entiendan.' },
      { t: 'Contacto directo', d: 'Formularios, WhatsApp y los canales que uses, a un clic desde cualquier parte del sitio.' },
      { t: 'Rediseño sin perder lo ganado', d: 'Si ya tenés una web, mantenemos lo que funciona y el posicionamiento que ya conseguiste.' },
    ],
    proceso: [
      { t: 'Diagnóstico', d: 'Entendemos el negocio, el público y qué tiene que lograr la web.' },
      { t: 'Estructura y diseño', d: 'Ordenamos el contenido y te mostramos una propuesta visual antes de programar.' },
      { t: 'Desarrollo', d: 'Construimos el sitio, lo adaptamos a todos los dispositivos y verificamos cada función.' },
      { t: 'Lanzamiento', d: 'Publicamos y seguimos disponibles para ajustes después de la entrega.' },
    ],
    faqs: [
      { q: '¿Cuánto tarda una página web institucional?', a: 'Un sitio institucional puede estar listo en 1 a 2 semanas, según la cantidad de secciones y de contenido que haya que preparar.' },
      { q: '¿Usan plantillas?', a: 'No. Diseñamos y programamos cada sitio desde cero, lo que permite resolver requerimientos específicos que una plantilla no cubre.' },
      { q: '¿Pueden rediseñar la web que ya tengo?', a: 'Sí. Revisamos el sitio actual, definimos qué contenido conviene mantener y lo rehacemos mejorando diseño, velocidad y conversión, sin perder el posicionamiento ganado.' },
      { q: '¿Voy a poder editar el contenido?', a: 'Cuando el proyecto lo justifica sumamos un panel de administración a medida. También ofrecemos planes de mantenimiento si preferís que nos encarguemos nosotros.' },
    ],
    proyectos: ['pmrzrgv20', 'pmtccsl6o', 'auralys', 'hey', 'mch', 'acevedo'],
    mensaje: '¡Hola LTWEB! Vi la página de diseño web y quiero consultar por una web para mi empresa.',
  },
  {
    slug: 'tiendas-online',
    area: 'Tiendas online',
    nombre: 'Tiendas online',
    titulo: 'Tiendas online y e-commerce a medida en Argentina | LTWEB',
    descripcion:
      'Desarrollamos tiendas online claras y confiables: catálogo, filtros, medios de pago y envíos. E-commerce a medida para negocios de Argentina.',
    volanta: 'E-commerce',
    h1: 'Tiendas online que la gente entiende y usa',
    intro:
      'Diseñamos tiendas claras y confiables, preparadas para facilitar cada etapa de la compra. Armamos el catálogo, los filtros y un proceso de compra corto, integramos los medios de pago y envío que uses y te enseñamos a cargar productos.',
    incluye: [
      { t: 'Catálogo ordenado', d: 'Categorías y filtros pensados para que cada cliente encuentre rápido lo que busca.' },
      { t: 'Medios de pago', d: 'Integramos los medios de pago que uses en tu negocio.' },
      { t: 'Compra corta y clara', d: 'Menos pasos entre el producto y la compra confirmada.' },
      { t: 'Compra por WhatsApp', d: 'Si tu negocio vende por chat, el carrito puede terminar en un mensaje con el pedido armado.' },
      { t: 'Carga de productos', d: 'Te dejamos la tienda lista y te enseñamos a sumar y editar productos.' },
      { t: 'Pensada para el celular', d: 'La mayoría compra desde el teléfono: diseñamos primero para esa pantalla.' },
    ],
    proceso: [
      { t: 'Relevamiento', d: 'Vemos qué vendés, cómo cobrás y cómo entregás hoy.' },
      { t: 'Catálogo y diseño', d: 'Definimos categorías, filtros y la ficha de producto.' },
      { t: 'Integraciones', d: 'Conectamos pagos, envíos y las herramientas que ya uses.' },
      { t: 'Publicación', d: 'Cargamos los productos iniciales y te enseñamos a manejar la tienda.' },
    ],
    faqs: [
      { q: '¿Cuánto tarda una tienda online?', a: 'Una tienda online o un sitio con integraciones lleva de 2 a 4 semanas, según la cantidad de productos y de integraciones.' },
      { q: '¿Qué plataforma usan?', a: 'Depende del caso. Trabajamos con WooCommerce y también desarrollamos tiendas a medida cuando el negocio lo necesita.' },
      { q: '¿Puedo cargar los productos yo?', a: 'Sí. Te dejamos la tienda funcionando y te enseñamos a sumar, editar y ordenar productos.' },
    ],
    proyectos: ['corteza', 'piccoli'],
    mensaje: '¡Hola LTWEB! Vi la página de tiendas online y quiero consultar por una tienda para mi negocio.',
  },
  {
    slug: 'sistemas-a-medida',
    area: 'Sistemas a medida',
    nombre: 'Sistemas a medida',
    titulo: 'Desarrollo de sistemas y apps a medida para empresas | LTWEB',
    descripcion:
      'Desarrollamos todo tipo de sistemas y aplicaciones a medida: gestión interna, turnos, reservas, stock, plataformas y automatizaciones. Pago por etapas o mensual.',
    volanta: 'Sistemas y apps a medida',
    h1: 'Sistemas y apps a medida, para lo que tu negocio necesite',
    intro:
      'Desarrollamos todo tipo de sistemas y aplicaciones a medida: control de stock, administración interna, gestión de clientes, turnos, reservas, plataformas y automatizaciones, conectados con las herramientas que ya usás. Si lo podés imaginar, lo podemos construir: primero entendemos el circuito real de tu negocio y recién ahí proponemos cómo resolverlo.',
    incluye: [
      { t: 'Gestión interna', d: 'Clientes, alumnos, docentes, cobros y calendarios centralizados en un solo panel.' },
      { t: 'Turnos y reservas', d: 'Que tus clientes reserven online y vos veas la agenda ordenada.' },
      { t: 'Stock y pedidos', d: 'Control de inventario y seguimiento de pedidos sin planillas sueltas.' },
      { t: 'Automatizaciones', d: 'Tareas repetitivas que el sistema hace solo: avisos, recordatorios, reportes.' },
      { t: 'Integraciones', d: 'Conectamos el sistema con las herramientas que la empresa ya usa.' },
      { t: 'Apps y plataformas', d: 'Aplicaciones y plataformas completas, pensadas desde cero para tu idea o tu negocio.' },
    ],
    proceso: [
      { t: 'Relevamiento del circuito', d: 'Entendemos cómo trabaja hoy tu equipo, paso por paso.' },
      { t: 'Propuesta', d: 'Te pasamos alcance, etapas y plazos antes de arrancar.' },
      { t: 'Desarrollo por etapas', d: 'Vas probando partes del sistema a medida que se terminan.' },
      { t: 'Puesta en marcha', d: 'Migramos los datos, capacitamos al equipo y acompañamos el arranque.' },
    ],
    faqs: [
      { q: '¿Cuánto tarda un sistema a medida?', a: 'Se estima después de relevar el circuito de trabajo, porque el plazo depende de qué tiene que resolver y con qué tiene que integrarse.' },
      { q: '¿Qué tipo de sistemas hacen?', a: 'Todo tipo de sistemas y aplicaciones: desde una gestión interna o un sistema de turnos hasta una plataforma completa. Cada proyecto se diseña según lo que el negocio necesita.' },
      { q: '¿Cómo se paga un proyecto así?', a: 'Se puede pagar por etapas o con un esquema de pagos mensuales, según el proyecto. Aceptamos transferencia, Mercado Pago y PayPal.' },
      { q: '¿Se puede conectar con lo que ya uso?', a: 'Sí. Parte del relevamiento es ver qué herramientas usa la empresa para que el sistema se integre con ellas en vez de reemplazarlas sin necesidad.' },
    ],
    proyectos: ['nuevo-proyecto-2', 'pmrzr727g'],
    mensaje: '¡Hola LTWEB! Vi la página de sistemas a medida y quiero consultar por un sistema o una app.',
  },
  {
    slug: 'chatbots',
    area: 'Chatbots para WhatsApp, Instagram y Facebook',
    nombre: 'Chatbots',
    titulo: 'Chatbots para WhatsApp, Instagram y Facebook | LTWEB',
    descripcion:
      'Armamos chatbots que responden las consultas de WhatsApp, Instagram y Facebook de tu negocio, toman los datos del cliente y te derivan lo importante.',
    volanta: 'Chatbots',
    h1: 'Chatbots que responden las consultas por vos',
    intro:
      'Armamos chatbots para WhatsApp, Instagram y Facebook que contestan las preguntas que se repiten, toman los datos de quien escribe y te pasan las consultas que necesitan una respuesta tuya. Los hacemos con Gestionate, nuestra propia plataforma de chatbots, con la que somos partners de Meta.',
    incluye: [
      { t: 'Plataforma propia', d: 'Trabajamos con Gestionate (gestionate.online), nuestra plataforma de chatbots. Somos partners de Meta.' },
      { t: 'Respuestas a lo frecuente', d: 'Precios, horarios, servicios y requisitos: lo que más te preguntan, contestado al instante.' },
      { t: 'WhatsApp, Instagram y Facebook', d: 'El mismo criterio de respuesta en los canales donde te escriben.' },
      { t: 'Datos del cliente', d: 'El bot pide nombre, consulta y lo que necesites para que el seguimiento arranque ordenado.' },
      { t: 'Derivación a una persona', d: 'Cuando la consulta lo necesita, la pasa a vos o a tu equipo.' },
      { t: 'Escrito con tu forma de hablar', d: 'Armamos los mensajes con el tono de tu marca, no con frases genéricas.' },
    ],
    proceso: [
      { t: 'Relevamiento', d: 'Juntamos las preguntas que más recibís y cómo las respondés hoy.' },
      { t: 'Guion', d: 'Escribimos el recorrido de la conversación y te lo mostramos.' },
      { t: 'Configuración', d: 'Lo conectamos a tus cuentas y lo probamos con casos reales.' },
      { t: 'Seguimiento', d: 'Lo ajustamos según cómo lo usan tus clientes.' },
    ],
    faqs: [
      { q: '¿Con qué plataforma trabajan?', a: 'Con Gestionate (gestionate.online), nuestra propia plataforma de chatbots. Somos partners de Meta, la empresa de WhatsApp, Instagram y Facebook.' },
      { q: '¿En qué redes funciona?', a: 'Armamos chatbots para WhatsApp, Instagram y Facebook, según los canales por los que te escriben tus clientes.' },
      { q: '¿El chatbot reemplaza la atención humana?', a: 'No. Resuelve lo repetitivo y deriva a una persona las consultas que necesitan una respuesta personalizada.' },
      { q: '¿Se puede combinar con la web?', a: 'Sí. Muchos clientes nos piden la web, las redes y el chatbot juntos, para que todo el recorrido del cliente tenga el mismo criterio.' },
    ],
    proyectos: ['nuevo-proyecto', 'pmrzqy091'],
    resena: 'micaelarodera',
    mensaje: '¡Hola LTWEB! Vi la página de chatbots y quiero consultar por un chatbot para mi negocio.',
  },
  {
    slug: 'meta-ads',
    area: 'Meta Ads',
    nombre: 'Meta Ads',
    titulo: 'Campañas de Meta Ads en Facebook e Instagram | LTWEB',
    descripcion:
      'Campañas profesionales de Meta Ads para negocios de Argentina: publicidad en Facebook e Instagram con objetivos claros, públicos definidos y seguimiento.',
    volanta: 'Publicidad en Facebook e Instagram',
    h1: 'Campañas de Meta Ads para negocios de Argentina',
    intro:
      'Hacemos campañas profesionales de publicidad en Facebook e Instagram. Definimos con vos qué querés lograr, a quién le hablamos y con qué piezas, y seguimos los resultados para ajustar sobre datos reales.',
    incluye: [
      { t: 'Objetivo claro', d: 'Mensajes, visitas a la web o ventas: cada campaña arranca con una meta concreta.' },
      { t: 'Públicos definidos', d: 'Segmentamos por zona, intereses y comportamiento según tu cliente real.' },
      { t: 'Piezas para cada formato', d: 'Anuncios pensados para historias, reels y el feed.' },
      { t: 'Conexión con la web', d: 'Si tenés tu sitio con nosotros, campaña y página trabajan juntas.' },
      { t: 'Seguimiento', d: 'Revisamos el rendimiento y movemos el presupuesto hacia lo que funciona.' },
      { t: 'Informes claros', d: 'Te contamos qué pasó con la inversión sin vueltas.' },
    ],
    proceso: [
      { t: 'Diagnóstico', d: 'Vemos tu negocio, tu público y lo que ya probaste.' },
      { t: 'Estrategia', d: 'Objetivo, públicos, presupuesto y piezas de la campaña.' },
      { t: 'Lanzamiento', d: 'Publicamos las campañas y controlamos los primeros días de cerca.' },
      { t: 'Optimización', d: 'Ajustamos según los resultados y te informamos.' },
    ],
    faqs: [
      { q: '¿En qué redes se publican los anuncios?', a: 'Meta Ads publica en Facebook e Instagram, y también puede llegar a Messenger y a la red de audiencias de Meta.' },
      { q: '¿Cuánto hay que invertir?', a: 'Depende del objetivo y del alcance que busques. Te recomendamos un presupuesto después de conocer tu negocio.' },
      { q: '¿Trabajan solo en Argentina?', a: 'Hacemos campañas para negocios de Argentina y también para clientes de otros países.' },
    ],
    proyectos: [],
    mensaje: '¡Hola LTWEB! Vi la página de Meta Ads y quiero consultar por campañas para mi negocio.',
  },
  {
    slug: 'videos',
    area: 'Videos',
    nombre: 'Videos',
    titulo: 'Edición de videos y reels para marcas y negocios | LTWEB',
    descripcion:
      'Editamos videos para marcas y negocios: reels para redes, anuncios para Meta Ads y videos para tu página web, a partir del material que grabás vos.',
    volanta: 'Edición de videos',
    h1: 'Edición de videos para redes, anuncios y tu web',
    intro:
      'Grabás vos, editamos nosotros. Con el material que tenés armamos reels para redes, anuncios en video para tus campañas de Meta Ads y videos para tu página web, cada uno pensado para el lugar donde se va a ver.',
    incluye: [
      { t: 'Reels para redes', d: 'Videos verticales con el ritmo que piden Instagram y TikTok.' },
      { t: 'Anuncios para Meta Ads', d: 'Piezas en video listas para usar en tus campañas de Facebook e Instagram.' },
      { t: 'Videos para la web', d: 'Videos para la portada o las secciones de tu sitio, optimizados para que carguen rápido.' },
      { t: 'Edición de tu material', d: 'Nos mandás lo que grabaste y le damos forma: cortes, ritmo, música y textos.' },
      { t: 'Textos y subtítulos', d: 'La mayoría mira sin sonido: sumamos textos para que el mensaje llegue igual.' },
      { t: 'Identidad de marca', d: 'Colores, tipografías y tono coherentes con el resto de tu comunicación.' },
    ],
    proceso: [
      { t: 'Idea', d: 'Definimos qué contar, para quién y dónde se va a publicar.' },
      { t: 'Material', d: 'Nos mandás lo que grabaste o el material que ya tenés.' },
      { t: 'Edición', d: 'Editamos y te mostramos una primera versión.' },
      { t: 'Ajustes y entrega', d: 'Ajustamos con tus comentarios y entregamos en cada formato.' },
    ],
    faqs: [
      { q: '¿Ustedes graban los videos?', a: 'No. Trabajamos sobre el material que grabás vos o que ya tenés, y nos encargamos de toda la edición.' },
      { q: '¿Qué tipo de videos editan?', a: 'Reels para redes sociales, anuncios para campañas de Meta Ads y videos para páginas web.' },
      { q: '¿Se puede sumar a una campaña de Meta Ads?', a: 'Sí. Los videos se pueden usar como anuncios en las campañas que armamos.' },
    ],
    proyectos: [],
    mensaje: '¡Hola LTWEB! Vi la página de videos y quiero consultar por la edición de videos para mi marca.',
  },
]

export const SERVICIO_POR_AREA = Object.fromEntries(SERVICIOS.map((s) => [s.area, s.slug]))
