import api from '@/services/api'

interface StrapiUploadedFile {
  url?: string
}

function extractUploadUrl(responseData: unknown): string {
  const files = Array.isArray(responseData)
    ? responseData
    : responseData &&
        typeof responseData === 'object' &&
        Array.isArray((responseData as { data?: unknown }).data)
      ? (responseData as { data: StrapiUploadedFile[] }).data
      : null

  const url = files?.[0]?.url
  if (!url) {
    throw new Error('Upload response did not include an image URL.')
  }

  return url
}

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('files', file)

    const { data } = await api.post('/api/upload', formData, {
      transformRequest: [(data, headers) => {
        if (headers) {
          delete headers['Content-Type']
        }
        return data
      }],
    })

    return extractUploadUrl(data)
  },
}
