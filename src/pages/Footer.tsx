import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CmsPageShell, getAxiosErrorMessage } from '@/components/cms/CmsPageShell'
import { ImageUploadField } from '@/components/cms/ImageUploadField'
import { ReorderableListActions } from '@/components/cms/ReorderableListActions'
import { StringList } from '@/components/cms/StringList'
import { useCmsInitialLoad } from '@/hooks/useCmsInitialLoad'
import { footerService } from '@/services/footer'
import { uploadService } from '@/services/upload'
import type { CmsFetchOptions } from '@/types/cms'
import type {
  FooterCertificationBadgeForm,
  FooterData,
  FooterFormState,
  FooterLinkItemForm,
  FooterSocialLinkForm,
} from '@/types/footer'
import { isAcceptedImageFile, moveItem } from '@/utils/cms'
import { isAbortError } from '@/utils/abort'
import {
  createEmptyCertificationBadge,
  createEmptyFooterLink,
  createEmptySocialLink,
  mapFooterToFormState,
  mapFormStateToFooter,
} from '@/utils/footer'

function LinkList({
  title,
  description,
  items,
  onChange,
  addLabel,
}: {
  title: string
  description: string
  items: FooterLinkItemForm[]
  onChange: (items: FooterLinkItemForm[]) => void
  addLabel: string
}) {
  const updateItem = (index: number, field: keyof FooterLinkItemForm, value: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  return (
    <Card title={title} description={description}>
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No links configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `link-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Link {index + 1}
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
                  label="Label"
                  value={item.label}
                  onChange={(e) => updateItem(index, 'label', e.target.value)}
                />
                <Input
                  label="Path"
                  value={item.path}
                  onChange={(e) => updateItem(index, 'path', e.target.value)}
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
        onClick={() => onChange([...items, createEmptyFooterLink()])}
      >
        {addLabel}
      </Button>
    </Card>
  )
}

function SocialLinksList({
  items,
  onChange,
}: {
  items: FooterSocialLinkForm[]
  onChange: (items: FooterSocialLinkForm[]) => void
}) {
  const updateItem = (index: number, field: keyof FooterSocialLinkForm, value: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  return (
    <Card title="Social links" description="Social media profiles">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No social links configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `social-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Social {index + 1}
                </span>
                <ReorderableListActions
                  index={index}
                  total={items.length}
                  onMoveUp={() => onChange(moveItem(items, index, 'up'))}
                  onMoveDown={() => onChange(moveItem(items, index, 'down'))}
                  onRemove={() => onChange(items.filter((_, i) => i !== index))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Name"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                />
                <Input
                  label="URL"
                  value={item.url}
                  onChange={(e) => updateItem(index, 'url', e.target.value)}
                />
                <Input
                  label="Icon"
                  value={item.icon}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
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
        onClick={() => onChange([...items, createEmptySocialLink()])}
      >
        Add social link
      </Button>
    </Card>
  )
}

function CertificationBadgesList({
  items,
  onChange,
  onImageSelect,
}: {
  items: FooterCertificationBadgeForm[]
  onChange: (items: FooterCertificationBadgeForm[]) => void
  onImageSelect: (index: number, file: File) => void
}) {
  const updateItem = (
    index: number,
    field: keyof FooterCertificationBadgeForm,
    value: string,
  ) => {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  return (
    <Card title="Certification badges" description="Certification and trust badges in the footer">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No badges configured.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={item.id ?? `cert-${index}`}
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
              <div className="space-y-4">
                <Input
                  label="Name"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                />
                {item.html ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      HTML embed
                    </label>
                    <textarea
                      value={item.html}
                      onChange={(e) => updateItem(index, 'html', e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                ) : (
                  <ImageUploadField
                    label="Badge image"
                    imageUrl={item.imageUrl}
                    altText={item.alt}
                    onAltChange={(value) => updateItem(index, 'alt', value)}
                    onFileSelect={(file) => onImageSelect(index, file)}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button
        type="button"
        variant="secondary"
        className="mt-4"
        onClick={() => onChange([...items, createEmptyCertificationBadge()])}
      >
        Add certification badge
      </Button>
    </Card>
  )
}

export function Footer() {
  const [form, setForm] = useState<FooterFormState | null>(null)
  const [original, setOriginal] = useState<FooterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [saveNoticeType, setSaveNoticeType] = useState<'success' | 'error'>('success')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [badgeFiles, setBadgeFiles] = useState<Record<number, File>>({})
  const logoPreviewUrlRef = useRef<string | null>(null)
  const badgePreviewUrlRefs = useRef<Record<number, string>>({})

  const fetchData = useCallback(async (options?: CmsFetchOptions) => {
    if (!options?.silent) setIsLoading(true)
    setError('')
    try {
      const data = await footerService.get({ signal: options?.signal })
      setOriginal(data)
      setForm(mapFooterToFormState(data))
    } catch (err) {
      if (isAbortError(err)) return
      setError(getAxiosErrorMessage(err, 'Failed to load footer data.'))
    } finally {
      if (!options?.silent && !options?.signal?.aborted) setIsLoading(false)
    }
  }, [])

  useCmsInitialLoad(fetchData)

  useEffect(() => {
    return () => {
      if (logoPreviewUrlRef.current) URL.revokeObjectURL(logoPreviewUrlRef.current)
      Object.values(badgePreviewUrlRefs.current).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const updateField = <K extends keyof FooterFormState>(
    field: K,
    value: FooterFormState[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const showError = (message: string) => {
    setSaveNotice(message)
    setSaveNoticeType('error')
    window.setTimeout(() => setSaveNotice(''), 4000)
  }

  const handleLogoSelect = (file: File) => {
    if (!isAcceptedImageFile(file)) {
      showError('Please select a valid image file (.jpg, .jpeg, .png, .webp, .svg).')
      return
    }
    if (logoPreviewUrlRef.current) URL.revokeObjectURL(logoPreviewUrlRef.current)
    const previewUrl = URL.createObjectURL(file)
    logoPreviewUrlRef.current = previewUrl
    setLogoFile(file)
    updateField('logoUrl', previewUrl)
  }

  const handleBadgeImageSelect = (index: number, file: File) => {
    if (!isAcceptedImageFile(file)) {
      showError('Please select a valid image file (.jpg, .jpeg, .png, .webp, .svg).')
      return
    }
    const existing = badgePreviewUrlRefs.current[index]
    if (existing) URL.revokeObjectURL(existing)
    const previewUrl = URL.createObjectURL(file)
    badgePreviewUrlRefs.current[index] = previewUrl
    setBadgeFiles((prev) => ({ ...prev, [index]: file }))
    setForm((prev) => {
      if (!prev) return prev
      const badges = [...prev.certificationBadges]
      badges[index] = { ...badges[index], imageUrl: previewUrl }
      return { ...prev, certificationBadges: badges }
    })
  }

  const handleSave = async () => {
    if (!form || isSaving) return
    setIsSaving(true)
    setSaveNotice('')
    try {
      let uploadedLogoUrl: string | undefined
      if (logoFile) uploadedLogoUrl = await uploadService.uploadImage(logoFile)

      const uploadedBadgeImages: Record<number, string> = {}
      for (const [indexStr, file] of Object.entries(badgeFiles)) {
        const index = Number(indexStr)
        uploadedBadgeImages[index] = await uploadService.uploadImage(file)
      }

      await footerService.update(
        mapFormStateToFooter(form, original, uploadedLogoUrl, uploadedBadgeImages),
      )

      setLogoFile(null)
      setBadgeFiles({})
      if (logoPreviewUrlRef.current) {
        URL.revokeObjectURL(logoPreviewUrlRef.current)
        logoPreviewUrlRef.current = null
      }
      Object.values(badgePreviewUrlRefs.current).forEach((url) => URL.revokeObjectURL(url))
      badgePreviewUrlRefs.current = {}

      setSaveNotice('Footer saved successfully.')
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
      description="Manage footer content loaded from Strapi."
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
          <Card title="Company" description="Company information in the footer">
            <div className="space-y-6">
              <ImageUploadField
                label="Logo"
                imageUrl={form.logoUrl}
                altText={form.logoAlt}
                onAltChange={(value) => updateField('logoAlt', value)}
                onFileSelect={handleLogoSelect}
              />
              <Input
                label="Description"
                value={form.companyDescription}
                onChange={(e) => updateField('companyDescription', e.target.value)}
              />
              <Input
                label="Certification"
                value={form.companyCertification}
                onChange={(e) => updateField('companyCertification', e.target.value)}
              />
            </div>
          </Card>

          <Card title="Quick links" description="Quick navigation links section">
            <Input
              label="Section title"
              value={form.quickLinksTitle}
              onChange={(e) => updateField('quickLinksTitle', e.target.value)}
              className="mb-4"
            />
          </Card>
          <LinkList
            title="Quick link items"
            description="Links shown in the quick links column"
            items={form.quickLinks}
            onChange={(items) => updateField('quickLinks', items)}
            addLabel="Add quick link"
          />

          <Card title="Services" description="Services links section">
            <Input
              label="Section title"
              value={form.servicesTitle}
              onChange={(e) => updateField('servicesTitle', e.target.value)}
              className="mb-4"
            />
          </Card>
          <LinkList
            title="Service link items"
            description="Links shown in the services column"
            items={form.servicesLinks}
            onChange={(items) => updateField('servicesLinks', items)}
            addLabel="Add service link"
          />

          <Card title="Contact" description="Contact information in the footer">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Section title"
                value={form.contactTitle}
                onChange={(e) => updateField('contactTitle', e.target.value)}
              />
              <Input
                label="Email"
                value={form.contactEmail}
                onChange={(e) => updateField('contactEmail', e.target.value)}
              />
              <Input
                label="Phone number"
                value={form.contactPhoneNumber}
                onChange={(e) => updateField('contactPhoneNumber', e.target.value)}
              />
              <Input
                label="Phone display"
                value={form.contactPhoneDisplay}
                onChange={(e) => updateField('contactPhoneDisplay', e.target.value)}
              />
              <Input
                label="Address"
                value={form.locationAddress}
                onChange={(e) => updateField('locationAddress', e.target.value)}
              />
              <Input
                label="City"
                value={form.locationCity}
                onChange={(e) => updateField('locationCity', e.target.value)}
              />
              <Input
                label="Coverage"
                value={form.locationCoverage}
                onChange={(e) => updateField('locationCoverage', e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          </Card>

          <Card title="Social" description="Social media section header">
            <Input
              label="Section title"
              value={form.socialTitle}
              onChange={(e) => updateField('socialTitle', e.target.value)}
            />
          </Card>
          <SocialLinksList
            items={form.socialLinks}
            onChange={(items) => updateField('socialLinks', items)}
          />

          <CertificationBadgesList
            items={form.certificationBadges}
            onChange={(items) => updateField('certificationBadges', items)}
            onImageSelect={handleBadgeImageSelect}
          />

          <Card title="Legal" description="Copyright and legal information">
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Copyright
                </label>
                <textarea
                  value={form.legalCopyright}
                  onChange={(e) => updateField('legalCopyright', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <Input
                label="Pest inspection notice"
                value={form.legalPestInspection}
                onChange={(e) => updateField('legalPestInspection', e.target.value)}
              />
              <StringList
                title="Certifications"
                description="Certification labels shown in the legal bar"
                items={form.legalCertifications}
                onChange={(items) => updateField('legalCertifications', items)}
                addLabel="Add certification"
                itemLabel="Certification"
              />
            </div>
          </Card>
          <LinkList
            title="Legal links"
            description="Terms, privacy, and other legal links"
            items={form.legalLinks}
            onChange={(items) => updateField('legalLinks', items)}
            addLabel="Add legal link"
          />
        </>
      )}
    </CmsPageShell>
  )
}
