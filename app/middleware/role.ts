/**
 * Role Middleware - Restrict pages by user role (admin, teacher, student)
 */
import { useAuthStore } from '~/stores/auth'
import { getRoleHomePath } from '~/composables/useRoleRedirect'

interface RouteRoleMeta {
  roles?: string[]
}

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const meta = to.meta as RouteRoleMeta
  if (!meta.roles || meta.roles.length === 0) {
    return
  }

  if (!authStore.userInfo) {
    return navigateTo('/login')
  }

  const normalizedRoles = authStore.roleNames.map(r => r.toLowerCase())
  const normalizedAllowed = meta.roles.map(r => r.toLowerCase())
  const isAuthorized = normalizedRoles.some(role => normalizedAllowed.includes(role))

  if (!isAuthorized) {
    console.warn(`Roles '${authStore.roleNames.join(', ')}' not authorized for ${to.path}`)
    return navigateTo(getRoleHomePath(authStore.user))
  }
})