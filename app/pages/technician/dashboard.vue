<template>
  <div class="technician-dashboard">
    <div class="header-row">
      <div>
        <h1>Technician Dashboard</h1>
        <p class="subtitle">Track service health and active incidents.</p>
      </div>
      <button class="btn-refresh" type="button" :disabled="loading" @click="loadTechnicianData">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Services</div>
        <div class="stat-value">{{ serviceStats.total }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Healthy</div>
        <div class="stat-value success">{{ serviceStats.healthy }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Degraded</div>
        <div class="stat-value warning">{{ serviceStats.degraded }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Incidents</div>
        <div class="stat-value danger">{{ incidents.length }}</div>
      </div>
    </div>

    <section class="panel">
      <h2>Service Health</h2>
      <p v-if="error" class="error-text">{{ error }}</p>
      <p v-else-if="loading" class="muted">Loading services...</p>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
              <th>Message</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.name">
              <td>{{ service.name }}</td>
              <td><span class="badge" :class="serviceBadgeClass(service.status)">{{ service.status }}</span></td>
              <td>{{ service.message || '-' }}</td>
              <td>{{ formatDate(service.updatedAt) }}</td>
            </tr>
            <tr v-if="services.length === 0">
              <td colspan="4" class="muted">No services returned.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <h2>Active Incidents</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Started</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="incident in incidents" :key="incident.id">
              <td>{{ incident.title || incident.name || '-' }}</td>
              <td>{{ incident.severity || '-' }}</td>
              <td>{{ incident.status || '-' }}</td>
              <td>{{ formatDate(incident.startedAt || incident.createdAt) }}</td>
            </tr>
            <tr v-if="incidents.length === 0">
              <td colspan="4" class="muted">No active incidents.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role'],
  roles: ['technician', 'admin']
})

interface ServiceHealth {
  name: string
  status: string
  message?: string
  updatedAt?: string
}

const api = useApi()
const loading = ref(false)
const error = ref('')
const services = ref<ServiceHealth[]>([])
const incidents = ref<any[]>([])

const serviceStats = computed(() => {
  const total = services.value.length
  const healthy = services.value.filter(s => (s.status || '').toLowerCase() === 'healthy').length
  const degraded = total - healthy
  return { total, healthy, degraded }
})

const serviceBadgeClass = (status?: string) => {
  const normalized = (status || '').toLowerCase()
  if (normalized === 'healthy' || normalized === 'ok') return 'success'
  if (normalized === 'degraded' || normalized === 'warning') return 'warning'
  return 'danger'
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadTechnicianData = async () => {
  loading.value = true
  error.value = ''

  try {
    const [healthResponse, incidentResponse] = await Promise.all([
      api.get<any>('/api-proxy/services/health'),
      api.get<any>('/api-proxy/status/api/incidents')
    ])

    if (Array.isArray(healthResponse)) {
      services.value = healthResponse
    } else if (Array.isArray(healthResponse?.services)) {
      services.value = healthResponse.services
    } else if (Array.isArray(healthResponse?.data)) {
      services.value = healthResponse.data
    } else {
      services.value = []
    }

    if (Array.isArray(incidentResponse)) {
      incidents.value = incidentResponse
    } else if (Array.isArray(incidentResponse?.incidents)) {
      incidents.value = incidentResponse.incidents
    } else if (Array.isArray(incidentResponse?.data)) {
      incidents.value = incidentResponse.data
    } else {
      incidents.value = []
    }
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to load technician dashboard data'
    services.value = []
    incidents.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadTechnicianData)
</script>

<style scoped>
.technician-dashboard {
  max-width: 1200px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

h1 {
  margin: 0;
}

.subtitle {
  margin: 0.35rem 0 0;
  color: var(--color-muted-foreground);
}

.btn-refresh {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-foreground);
  border-radius: 6px;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card,
.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

.panel {
  margin-bottom: 1rem;
}

.stat-label {
  color: var(--color-muted-foreground);
  font-size: 0.85rem;
}

.stat-value {
  margin-top: 0.35rem;
  font-size: 1.3rem;
  font-weight: 700;
}

.success {
  color: #1f7a4f;
}

.warning {
  color: #9a6700;
}

.danger {
  color: #b42318;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.65rem;
  border-bottom: 1px solid var(--color-border);
}

.badge {
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.badge.success {
  background: #d9fbe8;
  color: #0f5132;
}

.badge.warning {
  background: #fff3cd;
  color: #664d03;
}

.badge.danger {
  background: #f8d7da;
  color: #842029;
}

.muted {
  color: var(--color-muted-foreground);
}

.error-text {
  color: var(--color-danger);
}

@media (max-width: 980px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
