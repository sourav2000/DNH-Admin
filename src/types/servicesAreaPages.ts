export interface ServiceAreaPageDetail {
  icon?: string | null
  title?: string | null
  description?: string | null
}

export interface ServicesAreaPagesData {
  hero?: {
    title?: string | null
  } | null
  map?: {
    title?: string | null
    subtitle?: string | null
  } | null
  sections?: {
    primary?: { title?: string | null } | null
    extended?: { title?: string | null } | null
  } | null
  serviceDetails?: ServiceAreaPageDetail[] | null
}

export interface ServiceAreaPageDetailForm {
  id?: number
  icon: string
  title: string
  description: string
}

export interface ServicesAreaPagesFormState {
  heroTitle: string
  mapTitle: string
  mapSubtitle: string
  primarySectionTitle: string
  extendedSectionTitle: string
  serviceDetails: ServiceAreaPageDetailForm[]
}
