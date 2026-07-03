import type {
  ServiceAreaRegionForm,
  ServiceAreaRegionKey,
  ServicesAreaData,
  ServicesAreaFormState,
} from '@/types/servicesArea'
import {
  SERVICE_AREA_REGION_KEYS,
  SERVICE_AREA_REGION_LABELS,
} from '@/types/servicesArea'
import { normalizeStringList, readString } from '@/utils/cms'

function mapRegion(
  key: ServiceAreaRegionKey,
  region: { name?: string | null; primary?: unknown; secondary?: unknown } | null | undefined,
): ServiceAreaRegionForm {
  return {
    key,
    label: SERVICE_AREA_REGION_LABELS[key],
    name: readString(region?.name),
    primary: normalizeStringList(region?.primary),
    secondary: normalizeStringList(region?.secondary),
  }
}

export function mapServicesAreaToFormState(
  data: ServicesAreaData | null | undefined,
): ServicesAreaFormState {
  const areas = data?.serviceAreas ?? {}
  return {
    regions: SERVICE_AREA_REGION_KEYS.map((key) => mapRegion(key, areas[key])),
    coverage: readString(data?.coverage),
  }
}

export function mapFormStateToServicesArea(
  form: ServicesAreaFormState,
  existing: ServicesAreaData | null | undefined,
): ServicesAreaData {
  const serviceAreas: ServicesAreaData['serviceAreas'] = {
    ...existing?.serviceAreas,
  }

  for (const region of form.regions) {
    serviceAreas[region.key] = {
      name: region.name,
      primary: region.primary,
      secondary: region.secondary,
    }
  }

  return {
    serviceAreas,
    coverage: form.coverage,
  }
}

export function createEmptyStringItem(): string {
  return ''
}
