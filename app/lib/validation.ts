// lib/validation.ts
import { reactive } from 'vue';

/**
 * Reactive dictionary mapping role IDs (number) to role names (string).
 * Populated automatically when the app receives Role objects from the API,
 * e.g., from GET /api/auth/me.
 * 
 * **No hardcoded assumptions about which ID corresponds to which role.**
 */
export const roleMap = reactive<Record<number, string>>({});

/**
 * Populate the roleMap from an array of Role objects (as received from the API).
 * Call this whenever a response contains the full Role schema.
 */
export function ingestRoles(roles: Array<{ id: number; name: string }>) {
  for (const role of roles) {
    roleMap[role.id] = role.name;
  }
}

/**
 * Translate an array of role IDs to role names.
 * If a mapping is not yet known, the ID is converted to a string like "Role #3"
 * to indicate an unknown mapping.
 */
export function idsToNames(ids: number[]): string[] {
  return ids.map(id => roleMap[id] ?? `Role #${id}`);
}

/**
 * Optionally, a helper that returns true when the map is empty
 * (i.e., we haven't yet loaded the role definitions).
 */
export function isRoleMapEmpty(): boolean {
  return Object.keys(roleMap).length === 0;
}