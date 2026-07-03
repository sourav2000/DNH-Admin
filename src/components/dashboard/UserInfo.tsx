import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/Card'

export function UserInfo() {
  const { user } = useAuth()

  if (!user) return null

  const fields = [
    { label: 'Username', value: user.username },
    { label: 'Email', value: user.email },
    { label: 'User ID', value: String(user.id) },
    { label: 'Provider', value: user.provider ?? 'local' },
  ]

  return (
    <Card title="User Information" description="Your account details">
      <dl className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
