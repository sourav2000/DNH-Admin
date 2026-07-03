export interface StrapiUser {
  id: number
  documentId?: string
  username: string
  email: string
  provider?: string
  confirmed?: boolean
  blocked?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface LoginResponse {
  jwt: string
  user: StrapiUser
}

export interface AuthState {
  user: StrapiUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
