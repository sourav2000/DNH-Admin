import type {
  ServiceAreaPageDetailForm,
  ServicesAreaPagesData,
  ServicesAreaPagesFormState,
} from '@/types/servicesAreaPages'
import { readString } from '@/utils/cms'

function normalizeDetails(items: unknown): ServiceAreaPageDetailForm[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    const record = item as Record<string, unknown>
    return {
      id: typeof record.id === 'number' ? record.id : index,
      icon: readString(record.icon),
      title: readString(record.title),
      description: readString(record.description),
    }
  })
}

export function mapServicesAreaPagesToFormState(
  data: ServicesAreaPagesData | null | undefined,
): ServicesAreaPagesFormState {
  return {
    heroTitle: readString(data?.hero?.title),
    mapTitle: readString(data?.map?.title),
    mapSubtitle: readString(data?.map?.subtitle),
    primarySectionTitle: readString(data?.sections?.primary?.title),
    extendedSectionTitle: readString(data?.sections?.extended?.title),
    serviceDetails: normalizeDetails(data?.serviceDetails),
  }
}

export function createEmptyServiceDetail(): ServiceAreaPageDetailForm {
  return { icon: '', title: '', description: '' }
}

export function mapFormStateToServicesAreaPages(
  form: ServicesAreaPagesFormState,
  existing: ServicesAreaPagesData | null | undefined,
): ServicesAreaPagesData {
  return {
    hero: {
      ...existing?.hero,
      title: form.heroTitle,
    },
    map: {
      ...existing?.map,
      title: form.mapTitle,
      subtitle: form.mapSubtitle,
    },
    sections: {
      primary: { title: form.primarySectionTitle },
      extended: { title: form.extendedSectionTitle },
    },
    serviceDetails: form.serviceDetails.map(({ icon, title, description }) => ({
      icon,
      title,
      description,
    })),
  }
}
