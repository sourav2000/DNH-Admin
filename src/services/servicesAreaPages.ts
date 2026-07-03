import { createDnhPropertyService } from '@/services/dnhProperty'
import type { ServicesAreaPagesData } from '@/types/servicesAreaPages'

export const servicesAreaPagesService = createDnhPropertyService<ServicesAreaPagesData>(
  'servicesAreaPages',
)
