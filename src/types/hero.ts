export interface HeroTrustIndicator {
  icon?: string | null
  text?: string | null
}

export interface HeroStat {
  icon?: string | null
  label?: string | null
  value?: string | null
}

export interface HeroCta {
  text?: string | null
  path?: string | null
}

export interface HeroImage {
  src?: string | null
  alt?: string | null
}

export interface HeroFloatingBadge {
  title?: string | null
  subtitle?: string | null
}

export interface HeroData {
  title?: string | null
  titleHighlight?: string | null
  subtitle?: string | null
  highlights?: string[] | null
  trustIndicators?: HeroTrustIndicator[] | null
  cta?: HeroCta | null
  stats?: HeroStat[] | null
  heroImage?: HeroImage | null
  floatingBadge?: HeroFloatingBadge | null
}

export interface HeroTrustIndicatorItem {
  id?: number
  icon: string
  text: string
}

export interface HeroStatItem {
  id?: number
  icon: string
  label: string
  value: string
}

export interface HeroFormState {
  title: string
  titleHighlight: string
  subtitle: string
  highlights: string[]
  trustIndicators: HeroTrustIndicatorItem[]
  ctaText: string
  ctaPath: string
  stats: HeroStatItem[]
  heroImageUrl: string | null
  heroImageAlt: string
  floatingBadgeTitle: string
  floatingBadgeSubtitle: string
}
