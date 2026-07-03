import { createDnhPropertyService } from '@/services/dnhProperty'
import type { ServiceOverviewData } from '@/types/serviceOverview'

export const serviceOverviewService = createDnhPropertyService<ServiceOverviewData>(
  'serviceOverview',
)
