import api from '@/services/api'
import type { HeaderData } from '@/types/header'
import { extractHeaderFromResponse } from '@/utils/header'

export const headerService = {
  async getHeader(): Promise<HeaderData | null> {
    const { data } = await api.get('/api/dnh-property', {
      params: { fields: 'header' },
    })
    return extractHeaderFromResponse(data)
  },

  async updateHeader(header: HeaderData): Promise<HeaderData | null> {
    const { data } = await api.put('/api/dnh-property', {
      data: { header },
    })
    return extractHeaderFromResponse(data)
  },
}
