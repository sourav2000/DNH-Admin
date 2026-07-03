import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { isAxiosError } from 'axios'

export function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    '/dashboard'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login({ identifier, password })
      navigate(from, { replace: true })
    } catch (err) {
      if (isAxiosError(err)) {
        const message =
          err.response?.data?.error?.message ??
          err.response?.data?.message ??
          'Invalid credentials. Please try again.'
        setError(message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-primary-700 to-primary-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm font-bold backdrop-blur-sm">
            DNH
          </div>
          <span className="text-xl font-semibold">DNH Admin</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Manage your content with ease
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            A modern admin panel for managing your website sections, media, and
            settings.
          </p>
        </div>
        <p className="text-sm text-primary-200">
          Powered by Strapi CMS
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
                DNH
              </div>
              <span className="text-xl font-semibold text-slate-900">DNH Admin</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your credentials to access the admin panel
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Input
              label="Email or Username"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="username"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
