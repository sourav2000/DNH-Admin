import type {
  TestimonialItemForm,
  TestimonialsFormState,
  TestimonialsSectionData,
} from '@/types/testimonials'
import { readNumber, readString } from '@/utils/cms'

function normalizeTestimonials(items: unknown): TestimonialItemForm[] {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => {
    const record = item as Record<string, unknown>
    const rating = record.rating
    return {
      id: typeof record.id === 'number' ? record.id : index,
      name: readString(record.name),
      role: readString(record.role),
      location: readString(record.location),
      rating: typeof rating === 'number' ? String(rating) : readString(rating),
      text: readString(record.text),
      date: readString(record.date),
    }
  })
}

export function mapTestimonialsToFormState(
  data: TestimonialsSectionData | null | undefined,
): TestimonialsFormState {
  return {
    title: readString(data?.title),
    subtitle: readString(data?.subtitle),
    rating: readString(data?.rating),
    reviewCount: readString(data?.reviewCount),
    testimonials: normalizeTestimonials(data?.testimonials),
  }
}

export function createEmptyTestimonial(): TestimonialItemForm {
  return { name: '', role: '', location: '', rating: '5', text: '', date: '' }
}

export function mapFormStateToTestimonials(
  form: TestimonialsFormState,
): TestimonialsSectionData {
  return {
    title: form.title,
    subtitle: form.subtitle,
    rating: form.rating,
    reviewCount: form.reviewCount,
    testimonials: form.testimonials.map(({ id, name, role, location, rating, text, date }) => ({
      ...(id !== undefined ? { id } : {}),
      name,
      role,
      location,
      rating: Number(rating) || readNumber(rating),
      text,
      date,
    })),
  }
}
