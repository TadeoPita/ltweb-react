import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Hero from './components/Hero'
import Capabilities from './components/Capabilities'
import ClientsShowcase from './components/ClientsShowcase'
import Portfolio from './components/Portfolio'
import Solutions from './components/Solutions'
import Manifesto from './components/Manifesto'
import About from './components/About'
import Steps from './components/Steps'
import FAQ from './components/FAQ'
import SocialSection from './components/SocialSection'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import PortfolioPage from './pages/PortfolioPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

/* Estructura de la home reordenada según el brief de comunicación:
   Hero → Capacidades (franja) → Casos destacados → Proyectos (bento) →
   Servicios → Sobre LTWEB → Proceso → FAQ → Redes → CTA final → Footer */
function HomePage() {
  return (
    <main>
      <Hero />
      <Capabilities />
      <ClientsShowcase />
      <Portfolio />
      <Solutions />
      <Manifesto />
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
      <AppRoutes />
    </AuthProvider>
  )
}
