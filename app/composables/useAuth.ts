/**
 * useAuth - Authentication and user session management
 */

import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => !!authStore.user)
  const user = computed(() => authStore.user)
  const isLoading = computed(() => authStore.isLoading)
  const roles = computed(() => authStore.user?.roles || [])

  const login = async (email: string, password: string) => {
    await authStore.login(email, password)
  }

  const logout = async () => {
    await authStore.logout()
  }

  const checkAuth = async () => {
    await authStore.checkAuth()
  }

  const hasRole = (role: string) => roles.value.includes(role.toLowerCase())
  const hasAnyRole = (allowed: string[]) =>
    allowed.some(role => hasRole(role))

  return {
    isAuthenticated,
    user,
    roles,
    isLoading,
    login,
    logout,
    checkAuth,
    hasRole,
    hasAnyRole,
  }
}
