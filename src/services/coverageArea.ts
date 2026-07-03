import { createDnhPropertyService } from '@/services/dnhProperty'
import type { CoverageAreaData } from '@/types/coverageArea'

export const coverageAreaService = createDnhPropertyService<CoverageAreaData>('coverageArea')
