import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/Card'

export function WelcomeCard() {
  const { user } = useAuth()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <Card className="bg-gradient-to-br from-primary-600 to-primary-800 !border-0 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary-100">{greeting()}</p>
          <h2 className="mt-1 text-2xl font-bold">
            Welcome back, {user?.username ?? 'Admin'}
          </h2>
          <p className="mt-2 text-sm text-primary-100">
            Manage your website content from this dashboard.
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
          {user?.username?.charAt(0).toUpperCase() ?? 'A'}
        </div>
      </div>
    </Card>
  )
}
