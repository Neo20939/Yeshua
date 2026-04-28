<!-- components/RoleAwareDashboard.vue -->
<template>
  <div>
    <AdminDashboard v-if="roles.includes('admin')" />
    <TechnicianDashboard v-else-if="roles.includes('technician')" />
    <FinanceDashboard v-else-if="roles.includes('finance')" />
    <TeacherDashboard v-else-if="roles.includes('teacher')" />
    <StudentDashboard v-else-if="roles.includes('student')" />
    <div v-else>Loading roles...</div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const roles = computed(() => auth.roleNames.map(role => role.toLowerCase()))
</script>
