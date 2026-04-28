/**
 * useApi - Reusable API client wrapper
 * Provides typed access to the $fetch API with automatic auth handling
 */

export const useApi = () => {
  const authStore = useAuthStore()

  const request = async <T>(
    url: string,
    options?: Record<string, any>
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (authStore.sessionToken) {
      headers['x-session-token'] = authStore.sessionToken
    }

    try {
      const data = await $fetch<T>(url, {
        ...options,
        credentials: 'include',
        headers,
      })
      return data
    }
    catch (error: any) {
      // Auto-clear auth state on 401 Unauthorized
      if (error?.status === 401 || error?.response?.status === 401) {
        authStore.clearAuthState()
        navigateTo('/login')
      }
      else {
        console.error('API Error:', error)
      }
      throw error
    }
  }

  const get = <T>(url: string, options?: Record<string, any>) =>
    request<T>(url, { ...options, method: 'GET' })

  const post = <T>(url: string, data?: any, options?: Record<string, any>) =>
    request<T>(url, { ...options, method: 'POST', body: data })

  const put = <T>(url: string, data?: any, options?: Record<string, any>) =>
    request<T>(url, { ...options, method: 'PUT', body: data })

  const del = <T>(url: string, options?: Record<string, any>) =>
    request<T>(url, { ...options, method: 'DELETE' })

  return {
    get,
    post,
    put,
    delete: del,
    request,
  }
}