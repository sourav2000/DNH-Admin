import { createDnhPropertyService } from '@/services/dnhProperty'
import type { TrustBadgesData } from '@/types/trustBadges'

export const trustBadgesService = createDnhPropertyService<TrustBadgesData>('trustBadges')
