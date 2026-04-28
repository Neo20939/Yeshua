<template>
  <div class="admin-page">
    <h1>Admin Panel</h1>

    <div class="admin-grid">
      <div class="admin-card">
        <h3>System Settings</h3>
        <p>Configure system-wide settings and preferences</p>
        <NuxtLink to="#" class="btn btn-primary">Manage</NuxtLink>
      </div>

      <div class="admin-card">
        <h3>User Management</h3>
        <p>Manage administrators, teachers, and students</p>
        <NuxtLink to="#" class="btn btn-primary">Manage</NuxtLink>
      </div>

      <div class="admin-card">
        <h3>Academic Terms</h3>
        <p>Create and configure academic years and terms</p>
        <NuxtLink to="#" class="btn btn-primary">Manage</NuxtLink>
      </div>

      <div class="admin-card">
        <h3>Reports</h3>
        <p>View system reports and analytics</p>
        <NuxtLink to="#" class="btn btn-primary">View</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role'],
  roles: ['admin'],
})
</script>

<style scoped>
h1 {
  margin: 0 0 2rem 0;
  color: var(--color-foreground);
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.admin-card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}

.admin-card h3 {
  margin-top: 0;
  color: var(--color-foreground);
}

.admin-card p {
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-brand-600);
  color: white;
}

.btn-primary:hover {
  background: var(--color-brand-700);
}
</style>
