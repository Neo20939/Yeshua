/**
 * roles-interceptor.ts - Intercept auth API responses and update store
 */
export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()

  nuxtApp.hook('app:created', () => {
    const originalFetch = globalThis.$fetch
    globalThis.$fetch = async function (request, options?) {
      const response = await originalFetch(request, options)

      if (typeof request === 'string') {
        const url = request
        // Login response: { success, data: { user: { roles: [number] } } }
        if (url.includes('/api-proxy/auth/login') && response?.data?.user?.roles) {
          authStore.updateFromLogin(response.data)
        }
        // Me response: { success, data: { roles: [{ id, name }] } }
        if (url.includes('/api-proxy/auth/me') && response?.data?.roles) {
          authStore.updateFromMe(response.data)
        }
        // Logout
        if (url.includes('/api-proxy/auth/logout')) {
          authStore.clearAuthState()
        }
      }
      return response
    }
  })
})