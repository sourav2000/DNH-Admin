export const IMAGE_ACCEPT =
  '.jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml'

const ACCEPTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
])

const ACCEPTED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg'])

export function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function readNumber(value: unknown): number {
  return typeof value === 'number' ? value : 0
}

export function resolveImageUrl(src: string | null | undefined): string | null {
  if (!src) return null
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:')) {
    return src
  }
  return `${import.meta.env.VITE_API_URL}${src}`
}

export function extractSectionFromResponse<T>(
  responseData: unknown,
  fieldName: string,
): T | null {
  if (!responseData || typeof responseData !== 'object') return null

  const root = responseData as Record<string, unknown>

  if (root[fieldName] && typeof root[fieldName] === 'object') {
    return root[fieldName] as T
  }

  if (root.data && typeof root.data === 'object') {
    const nested = root.data as Record<string, unknown>
    if (nested[fieldName] && typeof nested[fieldName] === 'object') {
      return nested[fieldName] as T
    }
  }

  return null
}

export function isAcceptedImageFile(file: File): boolean {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  return ACCEPTED_IMAGE_TYPES.has(file.type) || ACCEPTED_IMAGE_EXTENSIONS.has(extension)
}

export function moveItem<T>(items: T[], index: number, direction: 'up' | 'down'): T[] {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= items.length) return items

  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(newIndex, 0, item)
  return next
}

export function normalizeStringList(items: unknown): string[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => (typeof item === 'string' ? item : readString(item)))
}
