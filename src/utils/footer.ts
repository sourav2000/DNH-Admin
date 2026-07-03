import type {
  FooterCertificationBadgeForm,
  FooterData,
  FooterFormState,
  FooterLinkItemForm,
  FooterSocialLinkForm,
} from '@/types/footer'
import { normalizeStringList, readString, resolveImageUrl } from '@/utils/cms'

function normalizeLinks(items: unknown): FooterLinkItemForm[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    const record = item as Record<string, unknown>
    return {
      id: typeof record.id === 'number' ? record.id : index,
      label: readString(record.label ?? record.name ?? record.title),
      path: readString(record.path ?? record.url ?? record.href),
    }
  })
}

function normalizeSocialLinks(items: unknown): FooterSocialLinkForm[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    const record = item as Record<string, unknown>
    return {
      id: typeof record.id === 'number' ? record.id : index,
      name: readString(record.name),
      url: readString(record.url ?? record.path),
      icon: readString(record.icon),
    }
  })
}

function normalizeCertificationBadges(items: unknown): FooterCertificationBadgeForm[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    const record = item as Record<string, unknown>
    return {
      id: typeof record.id === 'number' ? record.id : index,
      name: readString(record.name),
      imageUrl: resolveImageUrl(readString(record.imageUrl)),
      alt: readString(record.alt),
      html: readString(record.html),
    }
  })
}

export function mapFooterToFormState(data: FooterData | null | undefined): FooterFormState {
  return {
    logoUrl: resolveImageUrl(data?.company?.logo?.imageUrl),
    logoAlt: readString(data?.company?.logo?.alt),
    companyDescription: readString(data?.company?.description),
    companyCertification: readString(data?.company?.certification),
    quickLinksTitle: readString(data?.quickLinks?.title),
    quickLinks: normalizeLinks(data?.quickLinks?.links),
    servicesTitle: readString(data?.services?.title),
    servicesLinks: normalizeLinks(data?.services?.links),
    contactTitle: readString(data?.contact?.title),
    contactPhoneNumber: readString(data?.contact?.phone?.number),
    contactPhoneDisplay: readString(data?.contact?.phone?.display),
    contactEmail: readString(data?.contact?.email),
    locationAddress: readString(data?.contact?.location?.address),
    locationCity: readString(data?.contact?.location?.city),
    locationCoverage: readString(data?.contact?.location?.coverage),
    socialTitle: readString(data?.social?.title),
    socialLinks: normalizeSocialLinks(data?.social?.links),
    certificationBadges: normalizeCertificationBadges(data?.certificationBadges),
    legalCopyright: readString(data?.legal?.copyright),
    legalLinks: normalizeLinks(data?.legal?.links),
    legalCertifications: normalizeStringList(data?.legal?.certifications),
    legalPestInspection: readString(data?.legal?.pestInspection),
  }
}

export function createEmptyFooterLink(): FooterLinkItemForm {
  return { label: '', path: '' }
}

export function createEmptySocialLink(): FooterSocialLinkForm {
  return { name: '', url: '', icon: '' }
}

export function createEmptyCertificationBadge(): FooterCertificationBadgeForm {
  return { name: '', imageUrl: null, alt: '', html: '' }
}

function mapLinksToApi(items: FooterLinkItemForm[]) {
  return items.map(({ label, path }) => ({ name: label, path }))
}

export function mapFormStateToFooter(
  form: FooterFormState,
  existing: FooterData | null | undefined,
  uploadedLogoUrl?: string,
  uploadedBadgeImages?: Record<number, string>,
): FooterData {
  const existingLogo = existing?.company?.logo ?? {}
  const existingPhone = existing?.contact?.phone ?? {}
  const existingLocation = existing?.contact?.location ?? {}

  return {
    company: {
      ...existing?.company,
      logo: {
        ...existingLogo,
        alt: form.logoAlt,
        ...(uploadedLogoUrl !== undefined ? { imageUrl: uploadedLogoUrl } : {}),
      },
      description: form.companyDescription,
      certification: form.companyCertification,
    },
    quickLinks: {
      ...existing?.quickLinks,
      title: form.quickLinksTitle,
      links: mapLinksToApi(form.quickLinks),
    },
    services: {
      ...existing?.services,
      title: form.servicesTitle,
      links: mapLinksToApi(form.servicesLinks),
    },
    contact: {
      ...existing?.contact,
      title: form.contactTitle,
      phone: {
        ...existingPhone,
        number: form.contactPhoneNumber,
        display: form.contactPhoneDisplay,
      },
      email: form.contactEmail,
      location: {
        ...existingLocation,
        address: form.locationAddress,
        city: form.locationCity,
        coverage: form.locationCoverage,
      },
    },
    social: {
      ...existing?.social,
      title: form.socialTitle,
      links: form.socialLinks.map(({ name, url, icon }) => ({ name, url, icon })),
    },
    certificationBadges: form.certificationBadges.map((badge, index) => {
      const existingBadge = existing?.certificationBadges?.[index] ?? {}
      const uploadedUrl = uploadedBadgeImages?.[index]
      if (badge.html) {
        return { name: badge.name, html: badge.html }
      }
      return {
        name: badge.name,
        alt: badge.alt,
        imageUrl:
          uploadedUrl ??
          (existingBadge as { imageUrl?: string | null }).imageUrl ??
          undefined,
      }
    }),
    legal: {
      ...existing?.legal,
      copyright: form.legalCopyright,
      links: mapLinksToApi(form.legalLinks),
      certifications: form.legalCertifications,
      pestInspection: form.legalPestInspection,
    },
  }
}
