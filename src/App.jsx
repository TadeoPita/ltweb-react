import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectLightboxProvider } from './components/ProjectLightbox'
import { useSeo } from './lib/seo'
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
import PortfolioPage from './pages/PortfolioPage'
import ProjectPage from './pages/ProjectPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

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
