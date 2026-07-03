import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CmsPageShell, getAxiosErrorMessage } from '@/components/cms/CmsPageShell'
import { ReorderableListActions } from '@/components/cms/ReorderableListActions'
import { useCmsInitialLoad } from '@/hooks/useCmsInitialLoad'
import { useToast } from '@/context/ToastContext'
import { servicesAreaPagesService } from '@/services/servicesAreaPages'
import type { CmsFetchOptions } from '@/types/cms'
import type {
  ServiceAreaPageDetailForm,
  ServicesAreaPagesData,
  ServicesAreaPagesFormState,
} from '@/types/servicesAreaPages'
import { moveItem } from '@/utils/cms'
import { isAbortError } from '@/utils/abort'
import {
  createEmptyServiceDetail,
  mapFormStateToServicesAreaPages,
  mapServicesAreaPagesToFormState,
} from '@/utils/servicesAreaPages'

function ServiceDetailsList({
  items,
  onChange,
}: {
  items: ServiceAreaPageDetailForm[]
  onChange: (items: ServiceAreaPageDetailForm[]) => void
}) {
  const updateItem = (
    index: number,
    field: keyof ServiceAreaPageDetailForm,
    value: string,
  ) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  return (
    <Card title="Service details" description="Feature highlights on the service area page">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No service details configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `detail-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Detail {index + 1}
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
                  placeholder="e.g. Clock"
                />
                <Input
                  label="Title"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                />
                <Input
                  label="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="sm:col-span-2"
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
        onClick={() => onChange([...items, createEmptyServiceDetail()])}
      >
        Add service detail
      </Button>
    </Card>
  )
}

export function ServiceAreaPage() {
  const toast = useToast()
  const [form, setForm] = useState<ServicesAreaPagesFormState | null>(null)
  const [original, setOriginal] = useState<ServicesAreaPagesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async (options?: CmsFetchOptions) => {
    if (!options?.silent) setIsLoading(true)
    setError('')
    try {
      const data = await servicesAreaPagesService.get({ signal: options?.signal })
      setOriginal(data)
      setForm(mapServicesAreaPagesToFormState(data))
    } catch (err) {
      if (isAbortError(err)) return
      setError(getAxiosErrorMessage(err, 'Failed to load service area page data.'))
    } finally {
      if (!options?.silent && !options?.signal?.aborted) setIsLoading(false)
    }
  }, [])

  useCmsInitialLoad(fetchData)

  const updateField = <K extends keyof ServicesAreaPagesFormState>(
    field: K,
    value: ServicesAreaPagesFormState[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSave = async () => {
    if (!form || isSaving) return
    setIsSaving(true)
    try {
      await servicesAreaPagesService.update(
        mapFormStateToServicesAreaPages(form, original),
      )
      toast.success('Service area page saved successfully.')
      await fetchData({ silent: true })
    } catch (err) {
      toast.error(getAxiosErrorMessage(err, 'Failed to save changes.'))
    } finally {
      setIsSaving(false)
    }
  }

  if (!form && !isLoading && !error) return null

  return (
    <CmsPageShell
      description="Manage the service area page content loaded from Strapi."
      isLoading={isLoading}
      error={error}
      isSaving={isSaving}
      onRetry={fetchData}
      onSave={handleSave}
    >
      {form && (
        <>
          <Card title="Hero" description="Page headline">
            <Input
              label="Title"
              value={form.heroTitle}
              onChange={(e) => updateField('heroTitle', e.target.value)}
            />
          </Card>

          <Card title="Map section" description="Interactive map section header">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Title"
                value={form.mapTitle}
                onChange={(e) => updateField('mapTitle', e.target.value)}
              />
              <Input
                label="Subtitle"
                value={form.mapSubtitle}
                onChange={(e) => updateField('mapSubtitle', e.target.value)}
              />
            </div>
          </Card>

          <Card title="List sections" description="Section titles for counties and cities">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Primary section title"
                value={form.primarySectionTitle}
                onChange={(e) => updateField('primarySectionTitle', e.target.value)}
              />
              <Input
                label="Extended section title"
                value={form.extendedSectionTitle}
                onChange={(e) => updateField('extendedSectionTitle', e.target.value)}
              />
            </div>
          </Card>

          <ServiceDetailsList
            items={form.serviceDetails}
            onChange={(items) => updateField('serviceDetails', items)}
          />
        </>
      )}
    </CmsPageShell>
  )
}
