import api from '@/services/api'
import type { CmsFetchOptions } from '@/types/cms'
import { extractSectionFromResponse } from '@/utils/cms'

export function createDnhPropertyService<T>(fieldName: string) {
  return {
    async get(options?: Pick<CmsFetchOptions, 'signal'>): Promise<T | null> {
      const { data } = await api.get('/api/dnh-property', {
        params: { fields: fieldName },
        signal: options?.signal,
      })
      return extractSectionFromResponse<T>(data, fieldName)
    },

    async update(section: T): Promise<T | null> {
      const { data } = await api.put('/api/dnh-property', {
        data: { [fieldName]: section },
      })
      return extractSectionFromResponse<T>(data, fieldName)
    },
  }
}
