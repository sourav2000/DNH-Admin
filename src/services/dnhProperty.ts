import api from '@/services/api'
import { extractSectionFromResponse } from '@/utils/cms'

export function createDnhPropertyService<T>(fieldName: string) {
  return {
    async get(): Promise<T | null> {
      const { data } = await api.get('/api/dnh-property', {
        params: { fields: fieldName },
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
