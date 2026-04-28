<template>
  <div class="finance-dashboard">
    <div class="header-row">
      <div>
        <h1>Finance Dashboard</h1>
        <p class="subtitle">Monitor payments, fee records, and outstanding balances.</p>
      </div>
      <button class="btn-refresh" type="button" :disabled="loading" @click="loadFinanceData">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Fee Records</div>
        <div class="stat-value">{{ stats.totalRecords }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pending Records</div>
        <div class="stat-value pending">{{ stats.pendingRecords }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Due</div>
        <div class="stat-value">{{ formatCurrency(stats.totalDue) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Paid</div>
        <div class="stat-value success">{{ formatCurrency(stats.totalPaid) }}</div>
      </div>
    </div>

    <section class="panel">
      <div class="panel-title-row">
        <h2>Recent Fee Records</h2>
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>
      <p v-else-if="loading" class="muted">Loading finance records...</p>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Term</th>
              <th>Due Date</th>
              <th>Amount Due</th>
              <th>Amount Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in recentRecords" :key="record.id">
              <td>{{ record.studentName || '-' }}</td>
              <td>{{ record.termName || '-' }}</td>
              <td>{{ formatDate(record.dueDate) }}</td>
              <td>{{ formatCurrency(record.amountDue) }}</td>
              <td>{{ formatCurrency(record.amountPaid) }}</td>
              <td>
                <span class="badge" :class="badgeClass(record.status)">{{ record.status || 'unknown' }}</span>
              </td>
            </tr>
            <tr v-if="recentRecords.length === 0">
              <td colspan="6" class="muted">No fee records found.</td>
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
  roles: ['finance', 'admin']
})

interface FeeRecord {
  id: string
  studentName?: string
  termName?: string
  dueDate?: string
  amountDue?: number
  amountPaid?: number
  status?: string
}

const api = useApi()
const loading = ref(false)
const error = ref('')
const recentRecords = ref<FeeRecord[]>([])

const stats = computed(() => {
  const totalRecords = recentRecords.value.length
  const pendingRecords = recentRecords.value.filter(r => (r.status || '').toLowerCase() !== 'paid').length
  const totalDue = recentRecords.value.reduce((sum, r) => sum + Number(r.amountDue || 0), 0)
  const totalPaid = recentRecords.value.reduce((sum, r) => sum + Number(r.amountPaid || 0), 0)
  return { totalRecords, pendingRecords, totalDue, totalPaid }
})

const badgeClass = (status?: string) => {
  const normalized = (status || '').toLowerCase()
  if (normalized === 'paid') return 'success'
  if (normalized === 'overdue') return 'danger'
  return 'warning'
}

const formatCurrency = (value?: number) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0
}).format(Number(value || 0))

const formatDate = (value?: string) => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
}

const loadFinanceData = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<any>('/api-proxy/finance/fee-records')
    if (Array.isArray(response)) {
      recentRecords.value = response.slice(0, 10)
    } else if (Array.isArray(response?.data)) {
      recentRecords.value = response.data.slice(0, 10)
    } else if (Array.isArray(response?.items)) {
      recentRecords.value = response.items.slice(0, 10)
    } else {
      recentRecords.value = []
    }
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to load finance records'
    recentRecords.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadFinanceData)
</script>

<style scoped>
.finance-dashboard {
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

.stat-label {
  color: var(--color-muted-foreground);
  font-size: 0.85rem;
}

.stat-value {
  margin-top: 0.35rem;
  font-size: 1.3rem;
  font-weight: 700;
}

.stat-value.success {
  color: #1f7a4f;
}

.stat-value.pending {
  color: #9a6700;
}

.panel-title-row h2 {
  margin: 0 0 0.85rem;
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
