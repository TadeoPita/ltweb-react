import { useSeo, useJsonLd } from '../lib/seo'
import { FAQS } from '../data/content'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ClientsShowcase from '../components/ClientsShowcase'
import Testimonials from '../components/Testimonials'
import Portfolio from '../components/Portfolio'
import Solutions from '../components/Solutions'
import StartingPoint from '../components/StartingPoint'
import About from '../components/About'
import Steps from '../components/Steps'
import FAQ from '../components/FAQ'
import SocialSection from '../components/SocialSection'
import FinalCTA from '../components/FinalCTA'

/* La home anterior, guardada tal cual era.

   Vive acá y no en App.jsx por una razón de peso, literalmente: App.jsx lo
   importa todo de forma estática, así que estos once componentes —más la barra
   y el pie viejos— viajaban en el paquete principal y se los bajaba cualquiera
   que entrara al sitio, aunque nunca pisara esta página. Como módulo aparte, se
   piden recién cuando alguien abre /clasico.

   Trae su propia barra y su propio pie a propósito: es el archivo de cómo era
   el sitio, y tiene que verse como era y no con la cáscara nueva.

   Orden de la home: qué hacés (Servicios) → mostralo (Proyectos) → quiénes
   somos (Sobre LTWEB) → ¿esto aplica a mí? (¿Por dónde empezamos?) → la prueba
   (Casos) → cómo se trabaja (Proceso) → dudas (FAQ) → redes → cierre. */
export default function ClasicoPage() {
  useSeo({
    title: 'LTWEB — Diseño y desarrollo web en Buenos Aires',
    description:
      'Equipo de desarrollo web. Hacemos webs empresariales, sitios institucionales, tiendas online y sistemas personalizados para empresas.',
    path: '/clasico',
    noindex: true,
  })

  /* Las preguntas frecuentes en formato FAQPage: es lo que habilita a Google a
     mostrarlas desplegables directamente en el resultado de búsqueda. Se arman
     desde el mismo FAQS que pinta la sección, sin las etiquetas <strong> que
     usa el texto en pantalla. */
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
    })),
  })

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Solutions />
        <Portfolio />
        <About />
        <StartingPoint />
        {/* Testimonios va a ocupar el lugar de Casos. Mientras no haya frases
            reales cargadas no se renderiza. */}
        <Testimonials />
        <ClientsShowcase />
        <Steps />
        <FAQ />
        <SocialSection />
        <FinalCTA />
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
