import { useCallback, useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useCmsInitialLoad } from '@/hooks/useCmsInitialLoad'
import { heroService } from '@/services/hero'
import { uploadService } from '@/services/upload'
import type { CmsFetchOptions } from '@/types/cms'
import type { HeroData, HeroFormState, HeroStatItem, HeroTrustIndicatorItem } from '@/types/hero'
import { isAbortError } from '@/utils/abort'
import {
  createEmptyHighlight,
  createEmptyStat,
  createEmptyTrustIndicator,
  mapFormStateToHero,
  mapHeroToFormState,
} from '@/utils/hero'

const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml'

const ACCEPTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
])

const ACCEPTED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg'])

function isAcceptedImageFile(file: File): boolean {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  return ACCEPTED_IMAGE_TYPES.has(file.type) || ACCEPTED_IMAGE_EXTENSIONS.has(extension)
}

function HighlightsList({
  items,
  onChange,
}: {
  items: string[]
  onChange: (items: string[]) => void
}) {
  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...items, createEmptyHighlight()])
  }

  return (
    <Card title="Highlights" description="Key selling points shown in the hero section">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No highlights configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={`highlight-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Highlight {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <Input
                label="Text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder="e.g. Fast Turnaround Reports"
              />
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="secondary" className="mt-4" onClick={addItem}>
        Add highlight
      </Button>
    </Card>
  )
}

function TrustIndicatorsList({
  items,
  onChange,
}: {
  items: HeroTrustIndicatorItem[]
  onChange: (items: HeroTrustIndicatorItem[]) => void
}) {
  const updateItem = (
    index: number,
    field: keyof HeroTrustIndicatorItem,
    value: string,
  ) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...items, createEmptyTrustIndicator()])
  }

  return (
    <Card title="Trust indicators" description="Badges that build credibility">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No trust indicators configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `trust-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Indicator {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Icon"
                  value={item.icon}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                  placeholder="e.g. Shield"
                />
                <Input
                  label="Text"
                  value={item.text}
                  onChange={(e) => updateItem(index, 'text', e.target.value)}
                  placeholder="e.g. TREC Licensed"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="secondary" className="mt-4" onClick={addItem}>
        Add trust indicator
      </Button>
    </Card>
  )
}

function StatsList({
  items,
  onChange,
}: {
  items: HeroStatItem[]
  onChange: (items: HeroStatItem[]) => void
}) {
  const updateItem = (index: number, field: keyof HeroStatItem, value: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...items, createEmptyStat()])
  }

  return (
    <Card title="Stats" description="Statistics displayed in the hero section">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No stats configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `stat-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Stat {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Icon"
                  value={item.icon}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                  placeholder="e.g. CheckCircle"
                />
                <Input
                  label="Label"
                  value={item.label}
                  onChange={(e) => updateItem(index, 'label', e.target.value)}
                  placeholder="e.g. Inspections Completed"
                />
                <Input
                  label="Value"
                  value={item.value}
                  onChange={(e) => updateItem(index, 'value', e.target.value)}
                  placeholder="e.g. 2,500+"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="secondary" className="mt-4" onClick={addItem}>
        Add stat
      </Button>
    </Card>
  )
}

export function Hero() {
  const [form, setForm] = useState<HeroFormState | null>(null)
  const [originalHero, setOriginalHero] = useState<HeroData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [saveNoticeType, setSaveNoticeType] = useState<'success' | 'error'>('success')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const imagePreviewUrlRef = useRef<string | null>(null)

  const showSaveNotice = (message: string, type: 'success' | 'error') => {
    setSaveNotice(message)
    setSaveNoticeType(type)
    window.setTimeout(() => setSaveNotice(''), 4000)
  }

  const fetchHero = useCallback(async (options?: CmsFetchOptions) => {
    if (!options?.silent) {
      setIsLoading(true)
    }
    setError('')

    try {
      const hero = await heroService.getHero({ signal: options?.signal })
      setOriginalHero(hero)
      setForm(mapHeroToFormState(hero))
    } catch (err) {
      if (isAbortError(err)) return
      if (isAxiosError(err)) {
        const message =
          err.response?.data?.error?.message ??
          err.response?.data?.message ??
          'Failed to load hero data. Please try again.'
        setError(message)
      } else {
        setError('An unexpected error occurred while loading hero data.')
      }
    } finally {
      if (!options?.silent && !options?.signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useCmsInitialLoad(fetchHero)

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current)
      }
    }
  }, [])

  const updateField = <K extends keyof HeroFormState>(
    field: K,
    value: HeroFormState[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleImageSelect = (file: File) => {
    if (!isAcceptedImageFile(file)) {
      showSaveNotice(
        'Please select a valid image file (.jpg, .jpeg, .png, .webp, .svg).',
        'error',
      )
      return
    }

    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current)
    }

    const previewUrl = URL.createObjectURL(file)
    imagePreviewUrlRef.current = previewUrl
    setImageFile(file)
    updateField('heroImageUrl', previewUrl)
  }

  const handleSave = async () => {
    if (!form || isSaving) return

    setIsSaving(true)
    setSaveNotice('')

    try {
      let uploadedImageSrc: string | undefined

      if (imageFile) {
        uploadedImageSrc = await uploadService.uploadImage(imageFile)
      }

      const updatedHero = mapFormStateToHero(form, originalHero, uploadedImageSrc)
      await heroService.updateHero(updatedHero)
      setImageFile(null)
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current)
        imagePreviewUrlRef.current = null
      }
      showSaveNotice('Hero saved successfully.', 'success')
      await fetchHero({ silent: true })
    } catch (err) {
      if (isAxiosError(err)) {
        const message =
          err.response?.data?.error?.message ??
          err.response?.data?.message ??
          'Failed to save hero changes. Please try again.'
        showSaveNotice(message, 'error')
      } else {
        showSaveNotice('An unexpected error occurred while saving.', 'error')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-slate-500">Loading hero data…</p>
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
          <h2 className="text-lg font-semibold text-slate-900">Unable to load hero</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
          <Button className="mt-6" onClick={() => fetchHero()}>
            Try again
          </Button>
        </div>
      </Card>
    )
  }

  if (!form) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Manage the hero section content loaded from Strapi.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          {saveNotice && (
            <p
              className={`text-sm ${saveNoticeType === 'success' ? 'text-green-700' : 'text-red-700'}`}
            >
              {saveNotice}
            </p>
          )}
          <Button type="button" onClick={handleSave} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>

      <Card title="Headline" description="Main hero text content">
        <div className="grid gap-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Texas' Leading Property Inspection Team"
          />
          <Input
            label="Title highlight"
            value={form.titleHighlight}
            onChange={(e) => updateField('titleHighlight', e.target.value)}
            placeholder="- Fast Reports, Reliable Results"
          />
          <Input
            label="Subtitle"
            value={form.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Residential, Commercial, and Environmental Inspections..."
          />
        </div>
      </Card>

      <HighlightsList
        items={form.highlights}
        onChange={(items) => updateField('highlights', items)}
      />

      <TrustIndicatorsList
        items={form.trustIndicators}
        onChange={(items) => updateField('trustIndicators', items)}
      />

      <Card title="CTA" description="Call-to-action button in the hero section">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="CTA text"
            value={form.ctaText}
            onChange={(e) => updateField('ctaText', e.target.value)}
            placeholder="Schedule Your Inspection"
          />
          <Input
            label="CTA path"
            value={form.ctaPath}
            onChange={(e) => updateField('ctaPath', e.target.value)}
            placeholder="/book-now"
          />
        </div>
      </Card>

      <StatsList items={form.stats} onChange={(items) => updateField('stats', items)} />

      <Card title="Hero image" description="Background image for the hero section">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <input
            ref={imageInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageSelect(file)
              e.target.value = ''
            }}
          />
          <div className="flex w-64 shrink-0 flex-col gap-2">
            <div
              className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              aria-label="Current hero image preview"
            >
              {form.heroImageUrl ? (
                <img
                  src={form.heroImageUrl}
                  alt={form.heroImageAlt || 'Hero image'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm text-slate-400">No image available</span>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => imageInputRef.current?.click()}
            >
              Change Image
            </Button>
          </div>
          <div className="flex-1">
            <Input
              label="Alt text"
              value={form.heroImageAlt}
              onChange={(e) => updateField('heroImageAlt', e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>
        </div>
      </Card>

      <Card title="Floating badge" description="Overlay badge shown on the hero image">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Title"
            value={form.floatingBadgeTitle}
            onChange={(e) => updateField('floatingBadgeTitle', e.target.value)}
            placeholder="100% Satisfaction Rate"
          />
          <Input
            label="Subtitle"
            value={form.floatingBadgeSubtitle}
            onChange={(e) => updateField('floatingBadgeSubtitle', e.target.value)}
            placeholder="Over 2,500+ happy clients"
          />
        </div>
      </Card>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <Button type="button" onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
