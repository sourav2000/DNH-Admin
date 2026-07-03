import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/header': 'Header',
  '/hero': 'Hero',
  '/services-overview': 'Services Overview',
  '/trust-badges': 'Trust Badges',
  '/testimonials': 'Testimonials',
  '/coverage-area': 'Coverage Area',
  '/service-areas': 'Service Areas',
  '/footer': 'Footer',
  '/media-library': 'Media Library',
  '/settings': 'Settings',
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          title={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
