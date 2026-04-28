/**
 * auth.init.ts - Restore user session on app startup
 * Runs once on app initialization, restores auth state from stored token
 */

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const sessionToken = useCookie('auth.session_token')

  // Check auth if session cookie exists or fallback token exists.
  if ((sessionToken.value || import.meta.client) && !authStore.user) {
    try {
      await authStore.checkAuth()
    }
    catch {
      // Silently fail - middleware will handle redirect if needed
    }
  }
})
