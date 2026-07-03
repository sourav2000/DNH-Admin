import type {
  HeroData,
  HeroFormState,
  HeroStatItem,
  HeroTrustIndicatorItem,
} from '@/types/hero'

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function resolveImageUrl(src: string | null | undefined): string | null {
  if (!src) return null
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:')) {
    return src
  }
  return `${import.meta.env.VITE_API_URL}${src}`
}

function normalizeHighlights(items: unknown): string[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => (typeof item === 'string' ? item : readString(item)))
}

function normalizeTrustIndicators(items: unknown): HeroTrustIndicatorItem[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return { id: index, icon: '', text: item }
    }
    const record = item as Record<string, unknown>
    return {
      id: typeof record.id === 'number' ? record.id : index,
      icon: readString(record.icon),
      text: readString(record.text),
    }
  })
}

function normalizeStats(items: unknown): HeroStatItem[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    const record = item as Record<string, unknown>
    return {
      id: typeof record.id === 'number' ? record.id : index,
      icon: readString(record.icon),
      label: readString(record.label),
      value: readString(record.value),
    }
  })
}

export function extractHeroFromResponse(responseData: unknown): HeroData | null {
  if (!responseData || typeof responseData !== 'object') return null

  const root = responseData as Record<string, unknown>

  if (root.hero && typeof root.hero === 'object') {
    return root.hero as HeroData
  }

  if (root.data && typeof root.data === 'object') {
    const nested = root.data as Record<string, unknown>
    if (nested.hero && typeof nested.hero === 'object') {
      return nested.hero as HeroData
    }
  }

  return null
}

export function mapHeroToFormState(hero: HeroData | null | undefined): HeroFormState {
  return {
    title: readString(hero?.title),
    titleHighlight: readString(hero?.titleHighlight),
    subtitle: readString(hero?.subtitle),
    highlights: normalizeHighlights(hero?.highlights),
    trustIndicators: normalizeTrustIndicators(hero?.trustIndicators),
    ctaText: readString(hero?.cta?.text),
    ctaPath: readString(hero?.cta?.path),
    stats: normalizeStats(hero?.stats),
    heroImageUrl: resolveImageUrl(hero?.heroImage?.src),
    heroImageAlt: readString(hero?.heroImage?.alt),
    floatingBadgeTitle: readString(hero?.floatingBadge?.title),
    floatingBadgeSubtitle: readString(hero?.floatingBadge?.subtitle),
  }
}

export function createEmptyHighlight(): string {
  return ''
}

export function createEmptyTrustIndicator(): HeroTrustIndicatorItem {
  return { icon: '', text: '' }
}

export function createEmptyStat(): HeroStatItem {
  return { icon: '', label: '', value: '' }
}

export function mapFormStateToHero(
  form: HeroFormState,
  existingHero: HeroData | null | undefined,
  uploadedImageSrc?: string,
): HeroData {
  const existingHeroImage = existingHero?.heroImage ?? {}
  const existingCta = existingHero?.cta ?? {}
  const existingFloatingBadge = existingHero?.floatingBadge ?? {}

  return {
    title: form.title,
    titleHighlight: form.titleHighlight,
    subtitle: form.subtitle,
    highlights: form.highlights,
    trustIndicators: form.trustIndicators.map(({ icon, text }) => ({ icon, text })),
    cta: {
      ...existingCta,
      text: form.ctaText,
      path: form.ctaPath,
    },
    stats: form.stats.map(({ icon, label, value }) => ({ icon, label, value })),
    heroImage: {
      ...existingHeroImage,
      alt: form.heroImageAlt,
      ...(uploadedImageSrc !== undefined ? { src: uploadedImageSrc } : {}),
    },
    floatingBadge: {
      ...existingFloatingBadge,
      title: form.floatingBadgeTitle,
      subtitle: form.floatingBadgeSubtitle,
    },
  }
}
