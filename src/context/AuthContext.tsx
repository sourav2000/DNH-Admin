import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '@/services/auth'
import type { LoginCredentials, StrapiUser } from '@/types/auth'
import { storage } from '@/utils/storage'

interface AuthContextValue {
  user: StrapiUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<StrapiUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = storage.getToken()
    const storedUser = storage.getUser<StrapiUser>()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    }

    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    storage.setToken(response.jwt)
    storage.setUser(response.user)
    setToken(response.jwt)
    setUser(response.user)
  }, [])

  const logout = useCallback(() => {
    storage.clearAuth()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
