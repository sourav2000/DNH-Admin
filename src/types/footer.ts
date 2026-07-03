export interface FooterLinkItem {
  name?: string | null
  path?: string | null
}

export interface FooterSocialLink {
  name?: string | null
  url?: string | null
  icon?: string | null
}

export interface FooterCertificationBadge {
  name?: string | null
  imageUrl?: string | null
  alt?: string | null
  html?: string | null
}

export interface FooterData {
  company?: {
    logo?: {
      imageUrl?: string | null
      alt?: string | null
    } | null
    description?: string | null
    certification?: string | null
  } | null
  quickLinks?: {
    title?: string | null
    links?: FooterLinkItem[] | null
  } | null
  services?: {
    title?: string | null
    links?: FooterLinkItem[] | null
  } | null
  contact?: {
    title?: string | null
    phone?: {
      number?: string | null
      display?: string | null
    } | null
    email?: string | null
    location?: {
      address?: string | null
      city?: string | null
      coverage?: string | null
    } | null
  } | null
  social?: {
    title?: string | null
    links?: FooterSocialLink[] | null
  } | null
  certificationBadges?: FooterCertificationBadge[] | null
  legal?: {
    copyright?: string | null
    links?: FooterLinkItem[] | null
    certifications?: string[] | null
    pestInspection?: string | null
  } | null
}

export interface FooterLinkItemForm {
  id?: number
  label: string
  path: string
}

export interface FooterSocialLinkForm {
  id?: number
  name: string
  url: string
  icon: string
}

export interface FooterCertificationBadgeForm {
  id?: number
  name: string
  imageUrl: string | null
  alt: string
  html: string
}

export interface FooterFormState {
  logoUrl: string | null
  logoAlt: string
  companyDescription: string
  companyCertification: string
  quickLinksTitle: string
  quickLinks: FooterLinkItemForm[]
  servicesTitle: string
  servicesLinks: FooterLinkItemForm[]
  contactTitle: string
  contactPhoneNumber: string
  contactPhoneDisplay: string
  contactEmail: string
  locationAddress: string
  locationCity: string
  locationCoverage: string
  socialTitle: string
  socialLinks: FooterSocialLinkForm[]
  certificationBadges: FooterCertificationBadgeForm[]
  legalCopyright: string
  legalLinks: FooterLinkItemForm[]
  legalCertifications: string[]
  legalPestInspection: string
}
