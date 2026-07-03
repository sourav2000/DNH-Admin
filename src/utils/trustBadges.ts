import type {
  TrustBadgeItemForm,
  TrustBadgesData,
  TrustBadgesFormState,
} from '@/types/trustBadges'
import { readString } from '@/utils/cms'

function normalizeBadges(items: unknown): TrustBadgeItemForm[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    const record = item as Record<string, unknown>
    return {
      id: typeof record.id === 'number' ? record.id : index,
      icon: readString(record.icon),
      title: readString(record.title),
      description: readString(record.description),
    }
  })
}

export function mapTrustBadgesToFormState(
  data: TrustBadgesData | null | undefined,
): TrustBadgesFormState {
  return {
    title: readString(data?.title),
    subtitle: readString(data?.subtitle),
    badges: normalizeBadges(data?.badges),
  }
}

export function createEmptyTrustBadge(): TrustBadgeItemForm {
  return { icon: '', title: '', description: '' }
}

export function mapFormStateToTrustBadges(
  form: TrustBadgesFormState,
): TrustBadgesData {
  return {
    title: form.title,
    subtitle: form.subtitle,
    badges: form.badges.map(({ icon, title, description }) => ({
      icon,
      title,
      description,
    })),
  }
}
