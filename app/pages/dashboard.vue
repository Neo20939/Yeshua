<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div class="welcome-section">
      <h2>Welcome, {{ user?.name }}!</h2>
      <p>You are logged in as a <strong>{{ user?.role }}</strong></p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">124</div>
        <div class="stat-label">Total Students</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">95%</div>
        <div class="stat-label">Attendance Rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">8</div>
        <div class="stat-label">Upcoming Exams</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">$45,500</div>
        <div class="stat-label">Total Finance</div>
      </div>
    </div>

    <div class="dashboard-content">
      <section class="recent-section">
        <h3>Recent Activity</h3>
        <p>Coming soon...</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

h1 {
  margin: 0 0 2rem 0;
  color: var(--color-foreground);
}

.welcome-section {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}

.welcome-section h2 {
  margin-top: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid var(--color-border);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-brand-600);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

.dashboard-content {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}

.recent-section h3 {
  margin-top: 0;
}
</style>
