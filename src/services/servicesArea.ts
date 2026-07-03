import { createDnhPropertyService } from '@/services/dnhProperty'
import type { ServicesAreaData } from '@/types/servicesArea'

export const servicesAreaService = createDnhPropertyService<ServicesAreaData>('servicesArea')
