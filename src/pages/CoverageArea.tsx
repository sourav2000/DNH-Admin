import { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CmsPageShell, getAxiosErrorMessage } from '@/components/cms/CmsPageShell'
import { ImageUploadField } from '@/components/cms/ImageUploadField'
import { coverageAreaService } from '@/services/coverageArea'
import { uploadService } from '@/services/upload'
import type { CoverageAreaData, CoverageAreaFormState } from '@/types/coverageArea'
import { isAcceptedImageFile } from '@/utils/cms'
import { mapCoverageAreaToFormState, mapFormStateToCoverageArea } from '@/utils/coverageArea'

export function CoverageArea() {
  const [form, setForm] = useState<CoverageAreaFormState | null>(null)
  const [original, setOriginal] = useState<CoverageAreaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [saveNoticeType, setSaveNoticeType] = useState<'success' | 'error'>('success')
  const [mapFile, setMapFile] = useState<File | null>(null)
  const mapPreviewUrlRef = useRef<string | null>(null)

  const fetchData = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLoading(true)
    setError('')
    try {
      const data = await coverageAreaService.get()
      setOriginal(data)
      setForm(mapCoverageAreaToFormState(data))
    } catch (err) {
      setError(getAxiosErrorMessage(err, 'Failed to load coverage area data.'))
    } finally {
      if (!options?.silent) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    return () => {
      if (mapPreviewUrlRef.current) URL.revokeObjectURL(mapPreviewUrlRef.current)
    }
  }, [])

  const updateField = <K extends keyof CoverageAreaFormState>(
    field: K,
    value: CoverageAreaFormState[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleMapSelect = (file: File) => {
    if (!isAcceptedImageFile(file)) {
      setSaveNotice('Please select a valid image file (.jpg, .jpeg, .png, .webp, .svg).')
      setSaveNoticeType('error')
      window.setTimeout(() => setSaveNotice(''), 4000)
      return
    }
    if (mapPreviewUrlRef.current) URL.revokeObjectURL(mapPreviewUrlRef.current)
    const previewUrl = URL.createObjectURL(file)
    mapPreviewUrlRef.current = previewUrl
    setMapFile(file)
    updateField('mapImageUrl', previewUrl)
  }

  const handleSave = async () => {
    if (!form || isSaving) return
    setIsSaving(true)
    setSaveNotice('')
    try {
      let uploadedMapImage: string | undefined
      if (mapFile) uploadedMapImage = await uploadService.uploadImage(mapFile)

      await coverageAreaService.update(
        mapFormStateToCoverageArea(form, original, uploadedMapImage),
      )
      setMapFile(null)
      if (mapPreviewUrlRef.current) {
        URL.revokeObjectURL(mapPreviewUrlRef.current)
        mapPreviewUrlRef.current = null
      }
      setSaveNotice('Coverage area saved successfully.')
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
      description="Manage coverage area section content loaded from Strapi."
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
          <Card title="Hero" description="Main coverage area headline">
            <div className="grid gap-4">
              <Input
                label="Title"
                value={form.heroTitle}
                onChange={(e) => updateField('heroTitle', e.target.value)}
              />
              <Input
                label="Counties"
                value={form.heroCounties}
                onChange={(e) => updateField('heroCounties', e.target.value)}
              />
              <Input
                label="Description"
                value={form.heroDescription}
                onChange={(e) => updateField('heroDescription', e.target.value)}
              />
            </div>
          </Card>

          <Card title="Region sections" description="Titles for each coverage region">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="DFW title"
                value={form.dfwTitle}
                onChange={(e) => updateField('dfwTitle', e.target.value)}
              />
              <Input
                label="Houston title"
                value={form.houstonTitle}
                onChange={(e) => updateField('houstonTitle', e.target.value)}
              />
              <Input
                label="San Antonio title"
                value={form.sanAntonioTitle}
                onChange={(e) => updateField('sanAntonioTitle', e.target.value)}
              />
            </div>
          </Card>

          <Card title="Quick response" description="Call-to-action for scheduling">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Title"
                value={form.quickResponseTitle}
                onChange={(e) => updateField('quickResponseTitle', e.target.value)}
              />
              <Input
                label="Phone number"
                value={form.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value)}
              />
              <Input
                label="Description"
                value={form.quickResponseDescription}
                onChange={(e) => updateField('quickResponseDescription', e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                label="Schedule button"
                value={form.scheduleButton}
                onChange={(e) => updateField('scheduleButton', e.target.value)}
              />
              <Input
                label="Call button"
                value={form.callButton}
                onChange={(e) => updateField('callButton', e.target.value)}
              />
            </div>
          </Card>

          <Card title="Map" description="Coverage map image and overlay">
            <div className="space-y-6">
              <ImageUploadField
                label="Map image"
                imageUrl={form.mapImageUrl}
                altText={form.mapAlt}
                onAltChange={(value) => updateField('mapAlt', value)}
                onFileSelect={handleMapSelect}
                previewClassName="h-40"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Overlay title"
                  value={form.overlayTitle}
                  onChange={(e) => updateField('overlayTitle', e.target.value)}
                />
                <Input
                  label="Overlay subtitle"
                  value={form.overlaySubtitle}
                  onChange={(e) => updateField('overlaySubtitle', e.target.value)}
                />
                <Input
                  label="Overlay button text"
                  value={form.overlayButtonText}
                  onChange={(e) => updateField('overlayButtonText', e.target.value)}
                />
              </div>
            </div>
          </Card>
        </>
      )}
    </CmsPageShell>
  )
}
