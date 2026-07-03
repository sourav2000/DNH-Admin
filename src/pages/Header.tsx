import { useCallback, useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useCmsInitialLoad } from '@/hooks/useCmsInitialLoad'
import { useToast } from '@/context/ToastContext'
import { headerService } from '@/services/header'
import { uploadService } from '@/services/upload'
import type { CmsFetchOptions } from '@/types/cms'
import type { HeaderData, HeaderFormState, HeaderLinkItem } from '@/types/header'
import { isAbortError } from '@/utils/abort'
import {
  createEmptyLinkItem,
  mapFormStateToHeader,
  mapHeaderToFormState,
} from '@/utils/header'

const LOGO_ACCEPT = '.jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml'

const ACCEPTED_LOGO_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
])

const ACCEPTED_LOGO_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg'])

function isAcceptedLogoFile(file: File): boolean {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  return ACCEPTED_LOGO_TYPES.has(file.type) || ACCEPTED_LOGO_EXTENSIONS.has(extension)
}

function LinkItemList({
  title,
  description,
  items,
  onChange,
  addLabel,
}: {
  title: string
  description: string
  items: HeaderLinkItem[]
  onChange: (items: HeaderLinkItem[]) => void
  addLabel: string
}) {
  const updateItem = (index: number, field: keyof HeaderLinkItem, value: string) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    )
    onChange(next)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...items, createEmptyLinkItem()])
  }

  return (
    <Card title={title} description={description}>
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No items configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `item-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Item {index + 1}
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
                  label="Label"
                  value={item.label}
                  onChange={(e) => updateItem(index, 'label', e.target.value)}
                  placeholder="e.g. Home"
                />
                <Input
                  label="Path"
                  value={item.path}
                  onChange={(e) => updateItem(index, 'path', e.target.value)}
                  placeholder="e.g. /about"
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
        onClick={addItem}
      >
        {addLabel}
      </Button>
    </Card>
  )
}

export function Header() {
  const toast = useToast()
  const [form, setForm] = useState<HeaderFormState | null>(null)
  const [originalHeader, setOriginalHeader] = useState<HeaderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const logoPreviewUrlRef = useRef<string | null>(null)

  const fetchHeader = useCallback(async (options?: CmsFetchOptions) => {
    if (!options?.silent) {
      setIsLoading(true)
    }
    setError('')

    try {
      const header = await headerService.getHeader({ signal: options?.signal })
      setOriginalHeader(header)
      setForm(mapHeaderToFormState(header))
    } catch (err) {
      if (isAbortError(err)) return
      if (isAxiosError(err)) {
        const message =
          err.response?.data?.error?.message ??
          err.response?.data?.message ??
          'Failed to load header data. Please try again.'
        setError(message)
      } else {
        setError('An unexpected error occurred while loading header data.')
      }
    } finally {
      if (!options?.silent && !options?.signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useCmsInitialLoad(fetchHeader)

  useEffect(() => {
    return () => {
      if (logoPreviewUrlRef.current) {
        URL.revokeObjectURL(logoPreviewUrlRef.current)
      }
    }
  }, [])

  const updateField = <K extends keyof HeaderFormState>(
    field: K,
    value: HeaderFormState[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleLogoSelect = (file: File) => {
    if (!isAcceptedLogoFile(file)) {
      toast.error('Please select a valid image file (.jpg, .jpeg, .png, .webp, .svg).')
      return
    }

    if (logoPreviewUrlRef.current) {
      URL.revokeObjectURL(logoPreviewUrlRef.current)
    }

    const previewUrl = URL.createObjectURL(file)
    logoPreviewUrlRef.current = previewUrl
    setLogoFile(file)
    updateField('logoUrl', previewUrl)
  }

  const handleSave = async () => {
    if (!form || isSaving) return

    setIsSaving(true)

    try {
      let uploadedImageUrl: string | undefined

      if (logoFile) {
        uploadedImageUrl = await uploadService.uploadImage(logoFile)
      }

      const updatedHeader = mapFormStateToHeader(
        form,
        originalHeader,
        uploadedImageUrl,
      )
      await headerService.updateHeader(updatedHeader)
      setLogoFile(null)
      if (logoPreviewUrlRef.current) {
        URL.revokeObjectURL(logoPreviewUrlRef.current)
        logoPreviewUrlRef.current = null
      }
      toast.success('Header saved successfully.')
      await fetchHeader({ silent: true })
    } catch (err) {
      if (isAxiosError(err)) {
        const message =
          err.response?.data?.error?.message ??
          err.response?.data?.message ??
          'Failed to save header changes. Please try again.'
        toast.error(message)
      } else {
        toast.error('An unexpected error occurred while saving.')
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
          <p className="text-sm text-slate-500">Loading header data…</p>
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
          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load header
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
          <Button className="mt-6" onClick={() => fetchHeader()}>
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
            Manage the site header content loaded from Strapi.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <Button type="button" onClick={handleSave} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>

      <Card title="Logo" description="Current header logo">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <input
            ref={logoInputRef}
            type="file"
            accept={LOGO_ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleLogoSelect(file)
              e.target.value = ''
            }}
          />
          <div className="flex w-48 shrink-0 flex-col gap-2">
            <div
              className="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              aria-label="Current header logo preview"
            >
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt={form.altText || 'Header logo'}
                  className="max-h-full max-w-full object-contain p-2"
                />
              ) : (
                <span className="text-sm text-slate-400">No logo available</span>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => logoInputRef.current?.click()}
            >
              Change Image
            </Button>
          </div>
          <div className="flex-1">
            <Input
              label="Alt text"
              value={form.altText}
              onChange={(e) => updateField('altText', e.target.value)}
              placeholder="Describe the logo for accessibility"
            />
          </div>
        </div>
      </Card>

      <Card title="Brand" description="Company identity shown in the header">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Company name"
            value={form.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            placeholder="Company name"
          />
          <Input
            label="Tagline"
            value={form.tagline}
            onChange={(e) => updateField('tagline', e.target.value)}
            placeholder="Short tagline"
          />
        </div>
      </Card>

      <LinkItemList
        title="Navigation items"
        description="Primary navigation links in the header"
        items={form.navigationItems}
        onChange={(items) => updateField('navigationItems', items)}
        addLabel="Add navigation item"
      />

      <LinkItemList
        title="Services list"
        description="Services shown in the header"
        items={form.servicesList}
        onChange={(items) => updateField('servicesList', items)}
        addLabel="Add service"
      />

      <Card title="Contact & CTA" description="Phone number and call-to-action">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Contact phone"
            value={form.contactPhone}
            onChange={(e) => updateField('contactPhone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
          <Input
            label="CTA text"
            value={form.ctaText}
            onChange={(e) => updateField('ctaText', e.target.value)}
            placeholder="Get a quote"
          />
          <Input
            label="CTA path"
            value={form.ctaPath}
            onChange={(e) => updateField('ctaPath', e.target.value)}
            placeholder="/contact"
            className="sm:col-span-2"
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
