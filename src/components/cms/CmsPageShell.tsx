import { isAxiosError } from 'axios'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface CmsPageShellProps {
  description: string
  isLoading: boolean
  error: string
  isSaving: boolean
  onRetry: () => void
  onSave: () => void
  children: React.ReactNode
}

export function CmsPageShell({
  description,
  isLoading,
  error,
  isSaving,
  onRetry,
  onSave,
  children,
}: CmsPageShellProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-slate-500">Loading content…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            !
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Unable to load content</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
          <Button className="mt-6" onClick={onRetry}>
            Try again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <Button type="button" onClick={onSave} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>

      {children}

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <Button type="button" onClick={onSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}

export function getAxiosErrorMessage(
  err: unknown,
  fallback: string,
): string {
  if (isAxiosError(err)) {
    return (
      err.response?.data?.error?.message ??
      err.response?.data?.message ??
      fallback
    )
  }
  return 'An unexpected error occurred.'
}
