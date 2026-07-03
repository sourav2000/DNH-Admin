import api from '@/services/api'
import type { HeroData } from '@/types/hero'
import { extractHeroFromResponse } from '@/utils/hero'

export const heroService = {
  async getHero(): Promise<HeroData | null> {
    const { data } = await api.get('/api/dnh-property', {
      params: { fields: 'hero' },
    })
    return extractHeroFromResponse(data)
  },

  async updateHero(hero: HeroData): Promise<HeroData | null> {
    const { data } = await api.put('/api/dnh-property', {
      data: { hero },
    })
    return extractHeroFromResponse(data)
  },
}
