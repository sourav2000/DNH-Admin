export interface HeaderLinkItem {
  id?: number
  label: string
  path: string
}

export interface HeaderLogo {
  imageUrl?: string | null
  alt?: string | null
  fallbackText?: string | null
  companyName?: string | null
  tagline?: string | null
}

export interface HeaderNavigationItem {
  name?: string | null
  path?: string | null
}

export interface HeaderServiceItem {
  name?: string | null
  path?: string | null
}

export interface HeaderContact {
  phone?: {
    number?: string | null
    display?: string | null
  } | null
}

export interface HeaderCta {
  text?: string | null
  path?: string | null
  variant?: string | null
}

export interface HeaderData {
  logo?: HeaderLogo | null
  navigation?: HeaderNavigationItem[] | null
  services?: HeaderServiceItem[] | null
  contact?: HeaderContact | null
  cta?: HeaderCta | null
}

export interface DnhPropertyData {
  id?: number
  documentId?: string
  header?: HeaderData | null
}

export interface HeaderFormState {
  altText: string
  companyName: string
  tagline: string
  navigationItems: HeaderLinkItem[]
  servicesList: HeaderLinkItem[]
  contactPhone: string
  ctaText: string
  ctaPath: string
  logoUrl: string | null
}
