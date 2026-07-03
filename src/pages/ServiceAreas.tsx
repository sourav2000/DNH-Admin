import { useCallback, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CmsPageShell, getAxiosErrorMessage } from '@/components/cms/CmsPageShell'
import { StringList } from '@/components/cms/StringList'
import { useCmsInitialLoad } from '@/hooks/useCmsInitialLoad'
import { servicesAreaService } from '@/services/servicesArea'
import type { CmsFetchOptions } from '@/types/cms'
import type { ServiceAreaRegionForm, ServicesAreaData, ServicesAreaFormState } from '@/types/servicesArea'
import { isAbortError } from '@/utils/abort'
import { mapFormStateToServicesArea, mapServicesAreaToFormState } from '@/utils/servicesArea'

function RegionCard({
  region,
  onChange,
}: {
  region: ServiceAreaRegionForm
  onChange: (region: ServiceAreaRegionForm) => void
}) {
  return (
    <Card title={region.label} description={`Service areas for ${region.label}`}>
      <div className="space-y-6">
        <Input
          label="Region name"
          value={region.name}
          onChange={(e) => onChange({ ...region, name: e.target.value })}
        />
        <StringList
          title="Primary counties"
          description="Primary counties served in this region"
          items={region.primary}
          onChange={(primary) => onChange({ ...region, primary })}
          addLabel="Add county"
          itemLabel="County"
          placeholder="County name"
        />
        <StringList
          title="Secondary cities"
          description="Major cities served in this region"
          items={region.secondary}
          onChange={(secondary) => onChange({ ...region, secondary })}
          addLabel="Add city"
          itemLabel="City"
          placeholder="City name"
        />
      </div>
    </Card>
  )
}

export function ServiceAreas() {
  const [form, setForm] = useState<ServicesAreaFormState | null>(null)
  const [original, setOriginal] = useState<ServicesAreaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [saveNoticeType, setSaveNoticeType] = useState<'success' | 'error'>('success')

  const fetchData = useCallback(async (options?: CmsFetchOptions) => {
    if (!options?.silent) setIsLoading(true)
    setError('')
    try {
      const data = await servicesAreaService.get({ signal: options?.signal })
      setOriginal(data)
      setForm(mapServicesAreaToFormState(data))
    } catch (err) {
      if (isAbortError(err)) return
      setError(getAxiosErrorMessage(err, 'Failed to load service areas data.'))
    } finally {
      if (!options?.silent && !options?.signal?.aborted) setIsLoading(false)
    }
  }, [])

  useCmsInitialLoad(fetchData)

  const updateRegion = (index: number, region: ServiceAreaRegionForm) => {
    setForm((prev) => {
      if (!prev) return prev
      const regions = [...prev.regions]
      regions[index] = region
      return { ...prev, regions }
    })
  }

  const handleSave = async () => {
    if (!form || isSaving) return
    setIsSaving(true)
    setSaveNotice('')
    try {
      await servicesAreaService.update(mapFormStateToServicesArea(form, original))
      setSaveNotice('Service areas saved successfully.')
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
      description="Manage service areas content loaded from Strapi."
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
          <Card title="Coverage summary" description="Overall coverage description">
            <Input
              label="Coverage text"
              value={form.coverage}
              onChange={(e) =>
                setForm((prev) => (prev ? { ...prev, coverage: e.target.value } : prev))
              }
            />
          </Card>

          {form.regions.map((region, index) => (
            <RegionCard
              key={region.key}
              region={region}
              onChange={(updated) => updateRegion(index, updated)}
            />
          ))}
        </>
      )}
    </CmsPageShell>
  )
}
