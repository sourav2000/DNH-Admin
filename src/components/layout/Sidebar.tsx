import { NavLink } from 'react-router-dom'
import type { NavItem } from '@/types/navigation'

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '◫' },
  { label: 'Header', path: '/header', icon: '▤' },
  { label: 'Hero', path: '/hero', icon: '▣' },
  { label: 'Services Overview', path: '/services-overview', icon: '◧' },
  { label: 'Trust Badges', path: '/trust-badges', icon: '◈' },
  { label: 'Testimonials', path: '/testimonials', icon: '◉' },
  { label: 'Coverage Area', path: '/coverage-area', icon: '◎' },
  { label: 'Service Areas', path: '/service-areas', icon: '◍' },
  { label: 'Footer', path: '/footer', icon: '▥' },
  { label: 'Media Library', path: '/media-library', icon: '◫' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-white transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-700/50 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold">
            DNH
          </div>
          <div>
            <p className="text-sm font-semibold">DNH Admin</p>
            <p className="text-xs text-slate-400">Content Manager</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-sidebar-active text-white' : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'}`
                  }
                >
                  <span className="text-base opacity-70" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-700/50 px-6 py-4">
          <p className="text-xs text-slate-500">DNH Admin Panel v1.0</p>
        </div>
      </aside>
    </>
  )
}
