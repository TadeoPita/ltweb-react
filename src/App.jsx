import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectLightboxProvider } from './components/ProjectLightbox'
import { useSeo, useJsonLd } from './lib/seo'
import { FAQS } from './data/content'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Hero from './components/Hero'
import ClientsShowcase from './components/ClientsShowcase'
import Portfolio from './components/Portfolio'
import Solutions from './components/Solutions'
import StartingPoint from './components/StartingPoint'
import About from './components/About'
import Steps from './components/Steps'
import FAQ from './components/FAQ'
import SocialSection from './components/SocialSection'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import NotFoundPage from './pages/NotFoundPage'

/* Rutas partidas del bundle principal. Antes todo viajaba en un solo archivo
   de 817 KB: el visitante que entra a la home se bajaba también el panel de
   administración entero, que solo usamos nosotros. Ahora cada ruta se pide
   recién cuando se visita. NotFoundPage queda estático a propósito porque
   ProjectPage lo usa como fallback y tiene que pintar al instante. */
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

/* Orden de la home, pensado por lo que el visitante necesita en cada momento:
   quién sos (Hero) → probá que sabés (Casos + Proyectos) → qué vendés
   (Servicios) → ¿esto aplica a mí? (¿Por dónde empezamos?) → puedo confiar
   (Sobre LTWEB) → cómo se trabaja (Proceso) → dudas (FAQ) → redes → cierre.

   El CTA final va último, pegado al footer: es el remate de la página y
   comparte el mismo negro, así el cierre se lee como un solo bloque. */
function HomePage() {
  useSeo({
    title: 'LTWEB — Diseño y desarrollo web en Buenos Aires',
    description:
      'Estudio de diseño y desarrollo web. Hacemos sitios institucionales, landing pages, tiendas online y sistemas de gestión a medida para empresas.',
    path: '/',
  })

  /* Las preguntas frecuentes en formato FAQPage: es lo que habilita a Google a
     mostrarlas desplegables directamente en el resultado de búsqueda. Se
     arman desde el mismo FAQS que pinta la sección, sin las etiquetas <strong>
     que usa el texto en pantalla. */
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
    <main>
      <Hero />
      <ClientsShowcase />
      <Portfolio />
      <Solutions />
      <StartingPoint />
      <About />
      <Steps />
      <FAQ />
      <SocialSection />
      <FinalCTA />
    </main>
  )
}

function AppRoutes() {
  const { pathname } = useLocation()
  const isAuth = pathname.startsWith('/login')
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAuth && !isAdmin && <Navbar />}
      {/* El fallback ocupa el alto de la pantalla para que el footer no salte
          hacia arriba mientras se descarga el chunk de la ruta. */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/proyecto/:id" element={<ProjectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      {!isAuth && !isAdmin && <Footer />}
      {!isAuth && !isAdmin && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectLightboxProvider>
        <AppRoutes />
      </ProjectLightboxProvider>
    </AuthProvider>
  )
}
