import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Login } from '@/pages/Login'
import { Header } from '@/pages/Header'
import { Hero } from '@/pages/Hero'
import { ServicesOverview } from '@/pages/ServicesOverview'
import { TrustBadges } from '@/pages/TrustBadges'
import { Testimonials } from '@/pages/Testimonials'
import { CoverageArea } from '@/pages/CoverageArea'
import { ServiceAreas } from '@/pages/ServiceAreas'
import { ServiceAreaPage } from '@/pages/ServiceAreaPage'
import { Footer } from '@/pages/Footer'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

const placeholderRoutes = [
  { path: 'media-library', title: 'Media Library' },
  { path: 'settings', title: 'Settings' },
]

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/header" element={<Header />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/services-overview" element={<ServicesOverview />} />
          <Route path="/trust-badges" element={<TrustBadges />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/coverage-area" element={<CoverageArea />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/service-area-page" element={<ServiceAreaPage />} />
          <Route path="/footer" element={<Footer />} />
          {placeholderRoutes.map(({ path, title }) => (
            <Route
              key={path}
              path={`/${path}`}
              element={<PlaceholderPage title={title} />}
            />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
