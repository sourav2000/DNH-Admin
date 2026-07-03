import { useEffect } from 'react'
import type { CmsFetchOptions } from '@/types/cms'

/**
 * Loads CMS data once on mount. Aborts in-flight requests on cleanup so React
 * StrictMode's mount/unmount/remount cycle issues only one network request.
 */
export function useCmsInitialLoad(
  fetchFn: (options: CmsFetchOptions) => Promise<void>,
) {
  useEffect(() => {
    const controller = new AbortController()
    void fetchFn({ signal: controller.signal })
    return () => controller.abort()
  }, [fetchFn])
}
