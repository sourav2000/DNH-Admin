import type {
  ServiceOverviewData,
  ServiceOverviewFormState,
  ServiceOverviewItemForm,
} from '@/types/serviceOverview'
import { readString } from '@/utils/cms'

function normalizeServices(items: unknown): ServiceOverviewItemForm[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    const record = item as Record<string, unknown>
    return {
      id: typeof record.id === 'number' ? record.id : index,
      icon: readString(record.icon),
      title: readString(record.title),
      description: readString(record.description),
      idealFor: readString(record.idealFor),
      path: readString(record.path),
    }
  })
}

export function mapServiceOverviewToFormState(
  data: ServiceOverviewData | null | undefined,
): ServiceOverviewFormState {
  return {
    title: readString(data?.title),
    subtitle: readString(data?.subtitle),
    services: normalizeServices(data?.services),
    ctaText: readString(data?.cta?.text),
    ctaPath: readString(data?.cta?.path),
  }
}

export function createEmptyServiceOverviewItem(): ServiceOverviewItemForm {
  return { icon: '', title: '', description: '', idealFor: '', path: '' }
}

export function mapFormStateToServiceOverview(
  form: ServiceOverviewFormState,
  existing: ServiceOverviewData | null | undefined,
): ServiceOverviewData {
  return {
    title: form.title,
    subtitle: form.subtitle,
    services: form.services.map(({ icon, title, description, idealFor, path }) => ({
      icon,
      title,
      description,
      idealFor,
      path,
    })),
    cta: {
      ...existing?.cta,
      text: form.ctaText,
      path: form.ctaPath,
    },
  }
}
