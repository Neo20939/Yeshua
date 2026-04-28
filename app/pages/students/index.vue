<template>
  <div class="students-page">
    <div class="page-layout">
      <aside class="sidebar-section">
        <div class="sidebar-card">
          <h3>Quick Access</h3>
          <nav class="sidebar-nav">
            <NuxtLink to="/student/dashboard" class="nav-item">
              <span class="nav-icon">📊</span>
              <span>Dashboard</span>
            </NuxtLink>
            <div class="nav-item active">
              <span class="nav-icon">👥</span>
              <span>Students</span>
            </div>
          </nav>
        </div>

        <div class="sidebar-card">
          <h3>Academic</h3>
          <nav class="sidebar-nav">
            <div class="nav-item">
              <span class="nav-icon">📝</span>
              <span>Notes</span>
              <span class="badge-count">8</span>
            </div>
            <div class="nav-item">
              <span class="nav-icon">📋</span>
              <span>Assignments</span>
              <span class="badge-count">5</span>
            </div>
            <div class="nav-item">
              <span class="nav-icon">✍️</span>
              <span>Exams</span>
              <span class="badge-count">3</span>
            </div>
            <div class="nav-item">
              <span class="nav-icon">📄</span>
              <span>Tests</span>
              <span class="badge-count">4</span>
            </div>
            <div class="nav-item">
              <span class="nav-icon">📈</span>
              <span>Results</span>
            </div>
          </nav>
        </div>
      </aside>

      <main class="main-section">
        <div class="page-header">
          <h1>Students</h1>
          <NuxtLink to="/students/create" class="btn btn-primary">
            Add New Student
          </NuxtLink>
        </div>

        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search students by name or ID..."
          >
        </div>

        <div v-if="isLoading" class="loading">
          Loading students...
        </div>

        <table v-else-if="filteredStudents.length" class="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td>{{ student.id }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.class }}</td>
              <td>
                <span class="badge" :class="student.status">
                  {{ student.status }}
                </span>
              </td>
              <td>
                <NuxtLink
                  :to="`/students/${student.id}`"
                  class="btn btn-sm btn-info"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="empty-state">
          <p>No students found</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

interface Student {
  id: string
  name: string
  email: string
  class: string
  status: 'active' | 'inactive'
}

const searchQuery = ref('')
const isLoading = ref(true)
const students = ref<Student[]>([])

// Mock data - replace with actual API call
const loadStudents = async () => {
  isLoading.value = true
  try {
    // const api = useApi()
    // students.value = await api.get<Student[]>('/api-proxy/students')
    students.value = [
      {
        id: 'STU001',
        name: 'John Doe',
        email: 'john@example.com',
        class: 'Form 1',
        status: 'active',
      },
      {
        id: 'STU002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        class: 'Form 2',
        status: 'active',
      },
    ]
  }
  finally {
    isLoading.value = false
  }
}

const filteredStudents = computed(() => {
  if (!searchQuery.value)
    return students.value

  const query = searchQuery.value.toLowerCase()
  return students.value.filter(
    s =>
      s.name.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query),
  )
})

onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
:root {
  --color-background: hsl(45 25% 96%);
  --color-foreground: hsl(340 60% 30%);
  --color-border: hsl(30 20% 85%);
  --color-surface: white;
  --color-muted: hsl(45 15% 94%);
  --color-muted-foreground: hsl(30 15% 55%);
  --color-brand-100: hsl(45 20% 92%);
  --color-brand-600: hsl(340 55% 45%);
  --color-brand-700: hsl(340 55% 40%);
}

.page-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
  padding: 1rem;
}

.sidebar-card h3 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-foreground);
  text-decoration: none;
}

.nav-item:hover {
  background: var(--color-muted);
}

.nav-item.active {
  background: var(--color-brand-100);
  color: var(--color-brand-700);
}

.nav-icon {
  font-size: 1.125rem;
}

.badge-count {
  margin-left: auto;
  background: var(--color-brand-100);
  color: var(--color-brand-700);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.main-section {
  min-width: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  color: var(--color-foreground);
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-bar input {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.875rem;
  background: var(--color-surface);
  color: var(--color-foreground);
}

.search-bar input:focus {
  outline: none;
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 25%, transparent);
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-brand-600);
  color: white;
}

.btn-primary:hover {
  background: var(--color-brand-700);
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.btn-info {
  background: var(--color-brand-600);
  color: white;
}

.btn-info:hover {
  background: var(--color-brand-700);
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}

thead {
  background: var(--color-muted);
  border-bottom: 1px solid var(--color-border);
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-foreground);
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

tbody tr:hover {
  background: var(--color-muted);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  &.active {
    background: #d4edda;
    color: #155724;
  }

  &.inactive {
    background: #f8d7da;
    color: #721c24;
  }
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  color: var(--color-muted-foreground);
}
</style>
