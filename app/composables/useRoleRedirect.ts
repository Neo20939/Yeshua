/**
 * useRoleRedirect - Determine redirect target based on user role
 */

import type { User } from '~/stores/auth'

export const getRoleHomePath = (user: User | null | undefined) => {
  if (!user) return '/login'

  const roles = user.roles?.length ? user.roles : [user.role]
  const normalized = roles.map(r => r.toLowerCase())

  if (normalized.includes('admin')) return '/admin'
  if (normalized.includes('teacher')) return '/teacher/dashboard'
  if (normalized.includes('student')) return '/student/dashboard'
  return '/dashboard'
}