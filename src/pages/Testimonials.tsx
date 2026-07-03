import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CmsPageShell, getAxiosErrorMessage } from '@/components/cms/CmsPageShell'
import { ReorderableListActions } from '@/components/cms/ReorderableListActions'
import { testimonialsService } from '@/services/testimonials'
import type { TestimonialItemForm, TestimonialsFormState } from '@/types/testimonials'
import { moveItem } from '@/utils/cms'
import {
  createEmptyTestimonial,
  mapFormStateToTestimonials,
  mapTestimonialsToFormState,
} from '@/utils/testimonials'

function TestimonialsList({
  items,
  onChange,
}: {
  items: TestimonialItemForm[]
  onChange: (items: TestimonialItemForm[]) => void
}) {
  const updateItem = (index: number, field: keyof TestimonialItemForm, value: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  return (
    <Card title="Testimonials" description="Client reviews shown on the site">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No testimonials configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `testimonial-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Testimonial {index + 1}
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
                  label="Name"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                />
                <Input
                  label="Role"
                  value={item.role}
                  onChange={(e) => updateItem(index, 'role', e.target.value)}
                />
                <Input
                  label="Location"
                  value={item.location}
                  onChange={(e) => updateItem(index, 'location', e.target.value)}
                />
                <Input
                  label="Rating"
                  value={item.rating}
                  onChange={(e) => updateItem(index, 'rating', e.target.value)}
                  placeholder="5"
                />
                <Input
                  label="Date"
                  value={item.date}
                  onChange={(e) => updateItem(index, 'date', e.target.value)}
                  placeholder="2024-05-15"
                />
                <Input
                  label="Review text"
                  value={item.text}
                  onChange={(e) => updateItem(index, 'text', e.target.value)}
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
        onClick={() => onChange([...items, createEmptyTestimonial()])}
      >
        Add testimonial
      </Button>
    </Card>
  )
}

export function Testimonials() {
  const [form, setForm] = useState<TestimonialsFormState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [saveNoticeType, setSaveNoticeType] = useState<'success' | 'error'>('success')

  const fetchData = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLoading(true)
    setError('')
    try {
      const data = await testimonialsService.get()
      setForm(mapTestimonialsToFormState(data))
    } catch (err) {
      setError(getAxiosErrorMessage(err, 'Failed to load testimonials data.'))
    } finally {
      if (!options?.silent) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateField = <K extends keyof TestimonialsFormState>(
    field: K,
    value: TestimonialsFormState[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSave = async () => {
    if (!form || isSaving) return
    setIsSaving(true)
    setSaveNotice('')
    try {
      await testimonialsService.update(mapFormStateToTestimonials(form))
      setSaveNotice('Testimonials saved successfully.')
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
      description="Manage testimonials section content loaded from Strapi."
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
          <Card title="Section header" description="Title and summary for the testimonials section">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
              <Input
                label="Subtitle"
                value={form.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                label="Rating label"
                value={form.rating}
                onChange={(e) => updateField('rating', e.target.value)}
                placeholder="5/5 Rating"
              />
              <Input
                label="Review count"
                value={form.reviewCount}
                onChange={(e) => updateField('reviewCount', e.target.value)}
                placeholder="250+ Google Reviews"
              />
            </div>
          </Card>

          <TestimonialsList
            items={form.testimonials}
            onChange={(items) => updateField('testimonials', items)}
          />
        </>
      )}
    </CmsPageShell>
  )
}
