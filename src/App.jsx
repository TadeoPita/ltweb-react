import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectLightboxProvider } from './components/ProjectLightbox'
import ProtectedRoute from './components/ProtectedRoute'
import V3Nav from './v3/V3Nav'
import Ending from './v3/Ending'
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

/* Propuesta de rediseño completo, en su propia ruta para poder compararla con
   la publicada sin tocarla. Va aparte del bundle: no la carga nadie que entre
   a la home. */
const V3Page = lazy(() => import('./v3/V3Page'))
/* La home anterior: once secciones mas la barra y el pie viejos. Estatica
   viajaba en el paquete principal y se la bajaba todo el mundo. */
const ClasicoPage = lazy(() => import('./pages/ClasicoPage'))


function AppRoutes() {
  const { pathname } = useLocation()
  const isAuth = pathname.startsWith('/login')
  const isAdmin = pathname.startsWith('/admin')
  /* La barra y el pie del v3 son ahora los del sitio entero, no los de una
     pagina.

     Antes la home traia los suyos y el resto de las rutas publicas seguia con
     los del sitio anterior: al entrar a un proyecto desde el portfolio
     cambiaba el marco completo de golpe. Ahora /, /v3, /portfolio,
     /proyecto/:id y el 404 comparten cascara.

     /clasico es la excepcion a proposito: es el archivo de la home anterior y
     tiene que verse como era, con su barra y su pie. */
  const esClasico = pathname === '/clasico'
  const esPublica = !isAuth && !isAdmin

  return (
    <>
      {esPublica && !esClasico && <V3Nav />}
      {/* El fallback ocupa el alto de la pantalla para que el footer no salte
          hacia arriba mientras se descarga el chunk de la ruta. */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<V3Page />} />
          <Route path="/v3" element={<V3Page />} />
          {/* La home anterior queda accesible para comparar. No se enlaza
              desde ningun lado y lleva noindex, asi que no compite en Google
              con la home real. */}
          <Route path="/clasico" element={<ClasicoPage />} />
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
      {esPublica && !esClasico && <Ending />}
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
