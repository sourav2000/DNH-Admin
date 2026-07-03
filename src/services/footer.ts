import { createDnhPropertyService } from '@/services/dnhProperty'
import type { FooterData } from '@/types/footer'

export const footerService = createDnhPropertyService<FooterData>('footer')
