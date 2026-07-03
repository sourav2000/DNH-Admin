import type {
  HeaderData,
  HeaderFormState,
  HeaderLinkItem,
  HeaderNavigationItem,
  HeaderServiceItem,
} from '@/types/header'

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function normalizeLinkItem(
  item: HeaderNavigationItem | HeaderServiceItem | HeaderLinkItem | string,
  index: number,
): HeaderLinkItem {
  if (typeof item === 'string') {
    return { id: index, label: item, path: '' }
  }

  const record = item as Record<string, unknown>
  return {
    id: typeof record.id === 'number' ? record.id : index,
    label: String(record.label ?? record.name ?? record.title ?? ''),
    path: String(record.path ?? record.url ?? record.href ?? ''),
  }
}

function normalizeLinkList(items: unknown): HeaderLinkItem[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => normalizeLinkItem(item, index))
}

function resolveLogoUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  return `${import.meta.env.VITE_API_URL}${imageUrl}`
}

export function extractHeaderFromResponse(
  responseData: unknown,
): HeaderData | null {
  if (!responseData || typeof responseData !== 'object') return null

  const root = responseData as Record<string, unknown>

  if (root.header && typeof root.header === 'object') {
    return root.header as HeaderData
  }

  if (root.data && typeof root.data === 'object') {
    const nested = root.data as Record<string, unknown>
    if (nested.header && typeof nested.header === 'object') {
      return nested.header as HeaderData
    }
  }

  return null
}

export function mapHeaderToFormState(header: HeaderData | null | undefined): HeaderFormState {
  const logo = header?.logo

  return {
    altText: readString(logo?.alt),
    companyName: readString(logo?.companyName),
    tagline: readString(logo?.tagline),
    navigationItems: normalizeLinkList(header?.navigation),
    servicesList: normalizeLinkList(header?.services),
    contactPhone: readString(
      header?.contact?.phone?.display ?? header?.contact?.phone?.number,
    ),
    ctaText: readString(header?.cta?.text),
    ctaPath: readString(header?.cta?.path),
    logoUrl: resolveLogoUrl(logo?.imageUrl),
  }
}

export function createEmptyLinkItem(): HeaderLinkItem {
  return { label: '', path: '' }
}

function mapLinkItemsToApi(
  items: HeaderLinkItem[],
): HeaderNavigationItem[] {
  return items.map(({ label, path }) => ({
    name: label,
    path,
  }))
}

export function mapFormStateToHeader(
  form: HeaderFormState,
  existingHeader: HeaderData | null | undefined,
  imageUrl?: string,
): HeaderData {
  const existingLogo = existingHeader?.logo ?? {}
  const existingPhone = existingHeader?.contact?.phone ?? {}
  const existingCta = existingHeader?.cta ?? {}

  return {
    logo: {
      ...existingLogo,
      alt: form.altText,
      companyName: form.companyName,
      tagline: form.tagline,
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    },
    navigation: mapLinkItemsToApi(form.navigationItems),
    services: mapLinkItemsToApi(form.servicesList),
    contact: {
      ...existingHeader?.contact,
      phone: {
        ...existingPhone,
        display: form.contactPhone,
      },
    },
    cta: {
      ...existingCta,
      text: form.ctaText,
      path: form.ctaPath,
    },
  }
}
