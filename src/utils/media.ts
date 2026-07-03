import type { StrapiMedia } from '@/types/strapi'

export function resolveMediaUrl(media: StrapiMedia | null | undefined): string | null {
  if (!media) return null

  const url =
    media.url ??
    media.data?.attributes?.url ??
    (media as { attributes?: { url?: string } }).attributes?.url

  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`
}

export function resolveMediaAltText(
  media: StrapiMedia | null | undefined,
  fallback = '',
): string {
  if (!media) return fallback

  return (
    media.alternativeText ??
    media.data?.attributes?.alternativeText ??
    (media as { attributes?: { alternativeText?: string | null } }).attributes
      ?.alternativeText ??
    fallback
  )
}
