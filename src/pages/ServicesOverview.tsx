import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CmsPageShell, getAxiosErrorMessage } from '@/components/cms/CmsPageShell'
import { ReorderableListActions } from '@/components/cms/ReorderableListActions'
import { useCmsInitialLoad } from '@/hooks/useCmsInitialLoad'
import { serviceOverviewService } from '@/services/serviceOverview'
import type { CmsFetchOptions } from '@/types/cms'
import type { ServiceOverviewData, ServiceOverviewFormState, ServiceOverviewItemForm } from '@/types/serviceOverview'
import { isAbortError } from '@/utils/abort'
import { moveItem } from '@/utils/cms'
import {
  createEmptyServiceOverviewItem,
  mapFormStateToServiceOverview,
  mapServiceOverviewToFormState,
} from '@/utils/serviceOverview'

function ServicesList({
  items,
  onChange,
}: {
  items: ServiceOverviewItemForm[]
  onChange: (items: ServiceOverviewItemForm[]) => void
}) {
  const updateItem = (
    index: number,
    field: keyof ServiceOverviewItemForm,
    value: string,
  ) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  return (
    <Card title="Services" description="Inspection services shown in the overview section">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No services configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `service-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Service {index + 1}
                </span>
                <ReorderableListActions
                  index={index}
                  total={items.length}
                  onMoveUp={() => onChange(moveItem(items, index, 'up'))}
                  onMoveDown={() => onChange(moveItem(items, index, 'down'))}
                  onRemove={() => onChange(items.filter((_, i) => i !== index))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Icon"
                  value={item.icon}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                  placeholder="e.g. Home"
                />
                <Input
                  label="Title"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="e.g. Home Inspection"
                />
                <Input
                  label="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Service description"
                  className="sm:col-span-2"
                />
                <Input
                  label="Ideal for"
                  value={item.idealFor}
                  onChange={(e) => updateItem(index, 'idealFor', e.target.value)}
                  placeholder="Target audience"
                />
                <Input
                  label="Path"
                  value={item.path}
                  onChange={(e) => updateItem(index, 'path', e.target.value)}
                  placeholder="/services/home-inspection"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button
        type="button"
        variant="secondary"
        className="mt-4"
        onClick={() => onChange([...items, createEmptyServiceOverviewItem()])}
      >
        Add service
      </Button>
    </Card>
  )
}

export function ServicesOverview() {
  const [form, setForm] = useState<ServiceOverviewFormState | null>(null)
  const [original, setOriginal] = useState<ServiceOverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [saveNoticeType, setSaveNoticeType] = useState<'success' | 'error'>('success')

  const fetchData = useCallback(async (options?: CmsFetchOptions) => {
    if (!options?.silent) setIsLoading(true)
    setError('')
    try {
      const data = await serviceOverviewService.get({ signal: options?.signal })
      setOriginal(data)
      setForm(mapServiceOverviewToFormState(data))
    } catch (err) {
      if (isAbortError(err)) return
      setError(getAxiosErrorMessage(err, 'Failed to load services overview data.'))
    } finally {
      if (!options?.silent && !options?.signal?.aborted) setIsLoading(false)
    }
  }, [])

  useCmsInitialLoad(fetchData)

  const updateField = <K extends keyof ServiceOverviewFormState>(
    field: K,
    value: ServiceOverviewFormState[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSave = async () => {
    if (!form || isSaving) return
    setIsSaving(true)
    setSaveNotice('')
    try {
      await serviceOverviewService.update(mapFormStateToServiceOverview(form, original))
      setSaveNotice('Services overview saved successfully.')
      setSaveNoticeType('success')
      window.setTimeout(() => setSaveNotice(''), 4000)
      await fetchData({ silent: true })
    } catch (err) {
      setSaveNotice(getAxiosErrorMessage(err, 'Failed to save changes.'))
      setSaveNoticeType('error')
      window.setTimeout(() => setSaveNotice(''), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  if (!form && !isLoading && !error) return null

  return (
    <CmsPageShell
      description="Manage the services overview section content loaded from Strapi."
      isLoading={isLoading}
      error={error}
      saveNotice={saveNotice}
      saveNoticeType={saveNoticeType}
      isSaving={isSaving}
      onRetry={fetchData}
      onSave={handleSave}
    >
      {form && (
        <>
          <Card title="Section header" description="Title and subtitle for the services overview">
            <div className="grid gap-4">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
              <Input
                label="Subtitle"
                value={form.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
              />
            </div>
          </Card>

          <ServicesList
            items={form.services}
            onChange={(items) => updateField('services', items)}
          />

          <Card title="CTA" description="Call-to-action at the bottom of the section">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="CTA text"
                value={form.ctaText}
                onChange={(e) => updateField('ctaText', e.target.value)}
              />
              <Input
                label="CTA path"
                value={form.ctaPath}
                onChange={(e) => updateField('ctaPath', e.target.value)}
              />
            </div>
          </Card>
        </>
      )}
    </CmsPageShell>
  )
}
