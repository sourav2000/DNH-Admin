export interface ServiceOverviewItem {
  icon?: string | null
  title?: string | null
  description?: string | null
  idealFor?: string | null
  path?: string | null
}

export interface ServiceOverviewData {
  title?: string | null
  subtitle?: string | null
  services?: ServiceOverviewItem[] | null
  cta?: {
    text?: string | null
    path?: string | null
  } | null
}

export interface ServiceOverviewItemForm {
  id?: number
  icon: string
  title: string
  description: string
  idealFor: string
  path: string
}

export interface ServiceOverviewFormState {
  title: string
  subtitle: string
  services: ServiceOverviewItemForm[]
  ctaText: string
  ctaPath: string
}
