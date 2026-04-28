/**
 * Role Middleware - Restrict pages by user role (admin, teacher, student)
 */
import { useAuthStore } from "~/stores/auth"

interface RouteRoleMeta {
  roles?: Array<'admin' | 'teacher' | 'student'>
}

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Check if route has role restrictions
  const meta = to.meta as RouteRoleMeta
  if (!meta.roles || meta.roles.length === 0) {
    return
  }

  // Check if user has required role
  if (!authStore.user) {
    return navigateTo('/login')
  }

  const userRoles = authStore.user.roles?.length
    ? authStore.user.roles.map(role => role.toLowerCase())
    : [authStore.user.role.toLowerCase()]
  const allowedRoles = meta.roles.map(role => role.toLowerCase())
  const isAuthorized = userRoles.some(role => allowedRoles.includes(role))

  if (!isAuthorized) {
    // User doesn't have the required role
    console.warn(`User roles '${userRoles.join(', ')}' not authorized for this page`)
    return navigateTo('/dashboard')
  }
})
