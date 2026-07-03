export interface CoverageAreaData {
  hero?: {
    title?: string | null
    counties?: string | null
    description?: string | null
  } | null
  sections?: {
    dfw?: { title?: string | null } | null
    houston?: { title?: string | null } | null
    sanAntonio?: { title?: string | null } | null
  } | null
  quickResponse?: {
    title?: string | null
    description?: string | null
    scheduleButton?: string | null
    callButton?: string | null
    phoneNumber?: string | null
  } | null
  map?: {
    image?: string | null
    alt?: string | null
    overlay?: {
      title?: string | null
      subtitle?: string | null
      buttonText?: string | null
    } | null
  } | null
}

export interface CoverageAreaFormState {
  heroTitle: string
  heroCounties: string
  heroDescription: string
  dfwTitle: string
  houstonTitle: string
  sanAntonioTitle: string
  quickResponseTitle: string
  quickResponseDescription: string
  scheduleButton: string
  callButton: string
  phoneNumber: string
  mapImageUrl: string | null
  mapAlt: string
  overlayTitle: string
  overlaySubtitle: string
  overlayButtonText: string
}
