export type ServiceAreaRegionKey = 'dfw' | 'houston' | 'sanAntonio'

export interface ServiceAreaRegion {
  name?: string | null
  primary?: string[] | null
  secondary?: string[] | null
}

export interface ServicesAreaData {
  serviceAreas?: {
    dfw?: ServiceAreaRegion | null
    houston?: ServiceAreaRegion | null
    sanAntonio?: ServiceAreaRegion | null
  } | null
  coverage?: string | null
}

export interface ServiceAreaRegionForm {
  key: ServiceAreaRegionKey
  label: string
  name: string
  primary: string[]
  secondary: string[]
}

export interface ServicesAreaFormState {
  regions: ServiceAreaRegionForm[]
  coverage: string
}

export const SERVICE_AREA_REGION_KEYS: ServiceAreaRegionKey[] = [
  'dfw',
  'houston',
  'sanAntonio',
]

export const SERVICE_AREA_REGION_LABELS: Record<ServiceAreaRegionKey, string> = {
  dfw: 'Dallas-Fort Worth',
  houston: 'Greater Houston',
  sanAntonio: 'San Antonio',
}
