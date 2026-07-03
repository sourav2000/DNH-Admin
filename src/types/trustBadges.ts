export interface TrustBadgeItem {
  icon?: string | null
  title?: string | null
  description?: string | null
}

export interface TrustBadgesData {
  title?: string | null
  subtitle?: string | null
  badges?: TrustBadgeItem[] | null
}

export interface TrustBadgeItemForm {
  id?: number
  icon: string
  title: string
  description: string
}

export interface TrustBadgesFormState {
  title: string
  subtitle: string
  badges: TrustBadgeItemForm[]
}
