import axios from 'axios'

export function isAbortError(error: unknown): boolean {
  if (axios.isCancel(error)) return true
  if (error instanceof DOMException && error.name === 'AbortError') return true
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'ERR_CANCELED'
  ) {
    return true
  }
  return false
}
