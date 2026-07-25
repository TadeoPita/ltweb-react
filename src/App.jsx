import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectLightboxProvider } from './components/ProjectLightbox'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Hero from './components/Hero'
import Capabilities from './components/Capabilities'
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

/* Estructura de la home reordenada según el brief de comunicación:
   Hero → Capacidades (franja) → Casos destacados → Proyectos (bento) →
   Servicios → ¿Por dónde empezamos? → Sobre LTWEB → Proceso → FAQ →
   Redes → CTA final → Footer

   El ritmo claro/oscuro queda: B B B N B N B N B B N */
function HomePage() {
  return (
    <main>
      <Hero />
      <Capabilities />
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
