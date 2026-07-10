import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Hero from './components/Hero'
import ClientsShowcase from './components/ClientsShowcase'
import Solutions from './components/Solutions'
import Marquee from './components/Marquee'
import Plans from './components/Plans'
import Statements from './components/Statements'
import Steps from './components/Steps'
import Devices from './components/Devices'
import Portfolio from './components/Portfolio'
import FAQ from './components/FAQ'
import SocialSection from './components/SocialSection'
import Footer from './components/Footer'
import PortfolioPage from './pages/PortfolioPage'
import AdminPage from './pages/AdminPage'

function HomePage() {
  return (
    <main>
      <Hero />
      <ClientsShowcase />
      <Solutions />
      <Marquee />
      <Plans />
      <Statements />
      <Steps />
      <Devices />
      <Portfolio />
      <FAQ />
      <SocialSection />
    </main>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <BottomNav />}
    </>
  )
}
