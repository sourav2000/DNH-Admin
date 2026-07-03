import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CmsPageShell, getAxiosErrorMessage } from '@/components/cms/CmsPageShell'
import { ReorderableListActions } from '@/components/cms/ReorderableListActions'
import { trustBadgesService } from '@/services/trustBadges'
import type { TrustBadgeItemForm, TrustBadgesFormState } from '@/types/trustBadges'
import { moveItem } from '@/utils/cms'
import {
  createEmptyTrustBadge,
  mapFormStateToTrustBadges,
  mapTrustBadgesToFormState,
} from '@/utils/trustBadges'

function BadgesList({
  items,
  onChange,
}: {
  items: TrustBadgeItemForm[]
  onChange: (items: TrustBadgeItemForm[]) => void
}) {
  const updateItem = (index: number, field: keyof TrustBadgeItemForm, value: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  return (
    <Card title="Badges" description="Trust badges displayed on the site">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No badges configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `badge-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Badge {index + 1}
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
                  placeholder="e.g. Shield"
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
        onClick={() => onChange([...items, createEmptyTrustBadge()])}
      >
        Add badge
      </Button>
    </Card>
  )
}

export function TrustBadges() {
  const [form, setForm] = useState<TrustBadgesFormState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [saveNoticeType, setSaveNoticeType] = useState<'success' | 'error'>('success')

  const fetchData = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLoading(true)
    setError('')
    try {
      const data = await trustBadgesService.get()
      setForm(mapTrustBadgesToFormState(data))
    } catch (err) {
      setError(getAxiosErrorMessage(err, 'Failed to load trust badges data.'))
    } finally {
      if (!options?.silent) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateField = <K extends keyof TrustBadgesFormState>(
    field: K,
    value: TrustBadgesFormState[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSave = async () => {
    if (!form || isSaving) return
    setIsSaving(true)
    setSaveNotice('')
    try {
      await trustBadgesService.update(mapFormStateToTrustBadges(form))
      setSaveNotice('Trust badges saved successfully.')
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
      description="Manage trust badges content loaded from Strapi."
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
          <Card title="Section header" description="Title and subtitle for the trust badges section">
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

          <BadgesList
            items={form.badges}
            onChange={(items) => updateField('badges', items)}
          />
        </>
      )}
    </CmsPageShell>
  )
}
