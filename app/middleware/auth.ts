/**
 * Auth Middleware - Redirect unauthenticated users to login
 */

import { useAuthStore } from '~/stores/auth'
import { getRoleHomePath } from '~/composables/useRoleRedirect'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Public pages skip auth
  const publicPages = ['/login', '/register', '/reset-password']
  if (publicPages.includes(to.path)) {
    return
  }

  // Wait for auth check if not yet done
  if (!authStore.hasCheckedAuth) {
    await authStore.checkAuth()
  }

  if (!authStore.userInfo) {
    return navigateTo('/login')
  }

  // Redirect root/dashboard to role-appropriate home
  const roleHomeRoutes = ['/', '/dashboard']
  if (roleHomeRoutes.includes(to.path)) {
    const target = getRoleHomePath(authStore.user)
    if (to.path !== target) {
      return navigateTo(target)
    }
  }
})