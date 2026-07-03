import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Login } from '@/pages/Login'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

const placeholderRoutes = [
  { path: 'header', title: 'Header' },
  { path: 'hero', title: 'Hero' },
  { path: 'services-overview', title: 'Services Overview' },
  { path: 'trust-badges', title: 'Trust Badges' },
  { path: 'testimonials', title: 'Testimonials' },
  { path: 'coverage-area', title: 'Coverage Area' },
  { path: 'service-areas', title: 'Service Areas' },
  { path: 'footer', title: 'Footer' },
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
