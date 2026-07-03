import { createDnhPropertyService } from '@/services/dnhProperty'
import type { TestimonialsSectionData } from '@/types/testimonials'

export const testimonialsService = createDnhPropertyService<TestimonialsSectionData>(
  'testimonialsSection',
)
