import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'teacher' | 'student' | string
  roles: string[]
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}



export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const sessionToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const hasCheckedAuth = ref(false)

  const sessionTokenCookie = useCookie<string | null>('auth.session_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  if (import.meta.client && sessionTokenCookie.value) {
    sessionToken.value = sessionTokenCookie.value
  }

  const clearAuthState = () => {
    user.value = null
    sessionToken.value = null
    sessionTokenCookie.value = null
  }

  const normalizeUser = (payload: any): User => {
    const rawRoles = Array.isArray(payload?.roles)
      ? payload.roles
      : (payload?.role ? [payload.role] : [])
    const roles = rawRoles
      .map((role: unknown) => String(role).toLowerCase())
      .filter(Boolean)
    const role = roles[0] || 'student'

    return {
      id: String(payload?.id ?? ''),
      email: String(payload?.email ?? ''),
      name: String(payload?.name ?? ''),
      role,
      roles,
      createdAt: String(payload?.createdAt ?? ''),
    }
  }

  const setSessionToken = (token: string | null) => {
    sessionToken.value = token
    sessionTokenCookie.value = token
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        token?: string
        sessionToken?: string
        user?: unknown
      }>('/api-proxy/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(sessionToken.value ? { 'x-session-token': sessionToken.value } : {}),
        },
        body: { email, password },
      })

      const token = response?.sessionToken ?? response?.token ?? null
      if (token) {
        setSessionToken(token)
      }

      await checkAuth()
    }
    catch (err: any) {
      error.value = err.data?.message || 'Login failed'
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true

    try {
      await $fetch('/api-proxy/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(sessionToken.value ? { 'x-session-token': sessionToken.value } : {}),
        },
      })
    }
    catch (err) {
      console.error('Logout error:', err)
    }
    finally {
      clearAuthState()
      isLoading.value = false
      hasCheckedAuth.value = true
    }
  }

  const checkAuth = async () => {
    isLoading.value = true

    try {
      const response = await $fetch<any>('/api-proxy/auth/me', {
        credentials: 'include',
        headers: {
          ...(sessionToken.value ? { 'x-session-token': sessionToken.value } : {}),
        },
      })

      user.value = normalizeUser(response)
      hasCheckedAuth.value = true
    }
    catch (err) {
      clearAuthState()
      hasCheckedAuth.value = true
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    user: readonly(user),
    sessionToken: readonly(sessionToken),
    isLoading: readonly(isLoading),
    error: readonly(error),
    hasCheckedAuth: readonly(hasCheckedAuth),
    login,
    logout,
    checkAuth,
    clearAuthState,
    setSessionToken,
  }
})
