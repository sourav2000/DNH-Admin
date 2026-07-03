import { WelcomeCard } from '@/components/dashboard/WelcomeCard'
import { UserInfo } from '@/components/dashboard/UserInfo'
import { Card } from '@/components/ui/Card'

const quickLinks = [
  { label: 'Header', description: 'Manage site header content' },
  { label: 'Hero', description: 'Edit hero section' },
  { label: 'Services', description: 'Update services overview' },
  { label: 'Media', description: 'Browse media library' },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <UserInfo />

        <Card title="Quick Access" description="Navigate to content sections">
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li
                key={link.label}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{link.label}</p>
                  <p className="text-xs text-slate-500">{link.description}</p>
                </div>
                <span className="text-xs font-medium text-primary-600">Coming soon</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Content Sections', value: '10' },
          { label: 'Media Files', value: '—' },
          { label: 'Last Updated', value: 'Today' },
          { label: 'Status', value: 'Active' },
        ].map((stat) => (
          <Card key={stat.label} className="!p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
