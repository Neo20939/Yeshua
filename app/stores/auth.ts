// stores/auth.ts
import { defineStore } from 'pinia'
import { idsToNames, ingestRoles } from '~/lib/validation'

interface UserInfo {
  userId: string
  email: string
  firstName: string
  lastName: string
  schoolId: string | null
}

/** Expose user shape for components that need old .user property */
export interface User {
  userId: string
  email: string
  name: string
  role: string
  roles: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref<UserInfo | null>(null)
  const sessionToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const hasCheckedAuth = ref(false)

  /** Computed: old-style user object for backward compatibility */
  const user = computed<User | null>(() => {
    if (!userInfo.value) return null
    const name = [userInfo.value.firstName, userInfo.value.lastName].filter(Boolean).join(' ') || userInfo.value.email
    return {
      userId: userInfo.value.userId,
      email: userInfo.value.email,
      name,
      role: roleNames.value[0] || 'student',
      roles: roleNames.value,
    }
  })

  const roleNames = ref<string[]>([])

  /** Cookie for persistence */
  const sessionTokenCookie = useCookie<string | null>('auth.session_token', {
    maxAge: 60 * 60 * 24 * 7,
  })

  if (import.meta.client && sessionTokenCookie.value) {
    sessionToken.value = sessionTokenCookie.value
  }

  /** Set session token */
  const setSessionToken = (token: string | null) => {
    sessionToken.value = token
    sessionTokenCookie.value = token
  }

  /** Clear all auth state */
  const clearAuthState = () => {
    userInfo.value = null
    sessionToken.value = null
    sessionTokenCookie.value = null
    roleNames.value = []
  }

  /** Login - calls /api/auth/login and updates state */
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        success: boolean
        data: {
          user: {
            id: string
            email: string
            firstName: string
            lastName: string
            roles: number[]
          }
          expiresAt?: string
        }
      }>('/api-proxy/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(sessionToken.value ? { 'x-session-token': sessionToken.value } : {}),
        },
        body: { email, password },
      })

      if (response.success && response.data) {
        const { user: u, expiresAt } = response.data
        userInfo.value = {
          userId: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          schoolId: null,
        }
        // Map IDs to names (may be "Role #N" until /me populates mapping)
        roleNames.value = idsToNames(u.roles)

        // Call /me to get full role info with names
        await checkAuth()
      }
      else {
        throw new Error(response.data ? String(response.data) : 'Login failed')
      }
    }
    catch (err: any) {
      error.value = err.data?.message || err.message || 'Login failed'
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  /** Logout - calls /api/auth/logout and clears state */
  async function logout() {
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
      hasCheckedAuth.value = true
      isLoading.value = false
    }
  }

  /** Check auth - calls /api/auth/me and updates state */
  async function checkAuth() {
    isLoading.value = true

    try {
      const response = await $fetch<{
        success: boolean
        data: {
          userId: string
          email: string
          firstName: string
          lastName: string
          roles: Array<{ id: number; name: string }>
          schoolId?: string | null
        }
      }>('/api-proxy/auth/me', {
        credentials: 'include',
        headers: {
          ...(sessionToken.value ? { 'x-session-token': sessionToken.value } : {}),
        },
      })

      if (response.success && response.data) {
        // Update role map from full role objects
        ingestRoles(response.data.roles)

        userInfo.value = {
          userId: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          schoolId: response.data.schoolId ?? null,
        }
        roleNames.value = response.data.roles.map(r => r.name)
        hasCheckedAuth.value = true
      }
      else {
        clearAuthState()
      }
    }
    catch (err) {
      clearAuthState()
    }
    finally {
      isLoading.value = false
    }
  }

  /** For interceptor: update from login response */
  function updateFromLogin(payload: {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      roles: number[]
    }
  }) {
    const u = payload.user
    userInfo.value = {
      userId: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      schoolId: null,
    }
    roleNames.value = idsToNames(u.roles)
  }

  /** For interceptor: update from /me response */
  function updateFromMe(payload: {
    userId: string
    email: string
    firstName: string
    lastName: string
    roles: Array<{ id: number; name: string }>
    schoolId?: string | null
  }) {
    ingestRoles(payload.roles)
    userInfo.value = {
      userId: payload.userId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      schoolId: payload.schoolId ?? null,
    }
    roleNames.value = payload.roles.map(r => r.name)
  }

  return {
    // State
    userInfo: readonly(userInfo),
    sessionToken: readonly(sessionToken),
    isLoading: readonly(isLoading),
    error: readonly(error),
    hasCheckedAuth: readonly(hasCheckedAuth),
    // Computed
    user,
    roleNames,
    // Actions
    login,
    logout,
    checkAuth,
    clearAuthState,
    setSessionToken,
    // For interceptor
    updateFromLogin,
    updateFromMe,
  }
})