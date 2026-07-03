import { Card } from '@/components/ui/Card'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-2xl">
          🚧
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          This section is ready for CRUD implementation. Content management for{' '}
          <span className="font-medium text-slate-700">{title}</span> will be
          available here.
        </p>
      </div>
    </Card>
  )
}
