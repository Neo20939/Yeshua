/**
 * Auth Middleware - Redirect unauthenticated users to login
 */

import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Skip middleware for login page and public pages
  const publicPages = ['/login', '/register', '/reset-password']
  if (publicPages.includes(to.path)) {
    return
  }

  if (!authStore.user) {
    await authStore.checkAuth()
  }

  if (!authStore.user) {
    return navigateTo('/login')
  }
})
