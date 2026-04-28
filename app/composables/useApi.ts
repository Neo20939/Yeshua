/**
 * useApi - Reusable API client wrapper
 * Provides typed access to the $fetch API with automatic auth handling
 */

export const useApi = () => {
  const authStore = useAuthStore()
  const sessionToken = useCookie<string | null>('auth.session_token')

  const request = async <T>(
    url: string,
    options?: Record<string, any>
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (sessionToken.value) {
      headers['x-session-token'] = sessionToken.value
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
      if (error?.status === 401 || error?.response?.status === 401) {
        authStore.clearAuthState()
      }
      console.error('API Error:', error)
      throw error
    }
  }

  const get = <T>(url: string, options?: Record<string, any>) =>
    request<T>(url, { ...options, method: 'GET' })

  const post = <T>(url: string, data?: any, options?: Record<string, any>) =>
    request<T>(url, { ...options, method: 'POST', body: data })

  const put = <T>(url: string, data?: any, options?: Record<string, any>) =>
    request<T>(url, { ...options, method: 'PUT', body: data })

  const delete_ = <T>(url: string, options?: Record<string, any>) =>
    request<T>(url, { ...options, method: 'DELETE' })

  return {
    get,
    post,
    put,
    delete: delete_,
    request,
  }
}
