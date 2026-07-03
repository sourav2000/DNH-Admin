import api from '@/services/api'
import type { LoginCredentials, LoginResponse } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
      '/api/auth/local',
      credentials,
    )
    return data
  },

  async getMe() {
    const { data } = await api.get('/api/users/me')
    return data
  },
}
