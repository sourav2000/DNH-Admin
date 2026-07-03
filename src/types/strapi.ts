export interface StrapiMedia {
  id?: number
  documentId?: string
  url?: string
  alternativeText?: string | null
  data?: {
    id?: number
    attributes?: {
      url?: string
      alternativeText?: string | null
    }
  }
}

export interface StrapiSingleTypeResponse<T> {
  data: T
  meta?: Record<string, unknown>
}
