export interface TestimonialItem {
  id?: number
  name?: string | null
  role?: string | null
  location?: string | null
  rating?: number | null
  text?: string | null
  date?: string | null
}

export interface TestimonialsSectionData {
  title?: string | null
  subtitle?: string | null
  rating?: string | null
  reviewCount?: string | null
  testimonials?: TestimonialItem[] | null
}

export interface TestimonialItemForm {
  id?: number
  name: string
  role: string
  location: string
  rating: string
  text: string
  date: string
}

export interface TestimonialsFormState {
  title: string
  subtitle: string
  rating: string
  reviewCount: string
  testimonials: TestimonialItemForm[]
}
