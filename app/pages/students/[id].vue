<template>
  <div class="student-detail">
    <div class="page-header">
      <NuxtLink to="/students" class="btn btn-secondary">Back</NuxtLink>
      <h1>Student Profile</h1>
      <div class="actions">
        <button class="btn btn-primary">Edit</button>
        <button class="btn btn-danger">Delete</button>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      Loading student details...
    </div>

    <div v-else-if="student" class="student-container">
      <div class="student-info">
        <div class="info-section">
          <h3>Personal Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <p>{{ student.name }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ student.email }}</p>
            </div>
            <div class="info-item">
              <label>Student ID</label>
              <p>{{ student.id }}</p>
            </div>
            <div class="info-item">
              <label>Class</label>
              <p>{{ student.class }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="student-tabs">
        <div class="tab-buttons">
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="['tab-btn', { active: activeTab === tab }]"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'Attendance'" class="tab-pane">
            <p>Attendance records coming soon...</p>
          </div>
          <div v-if="activeTab === 'Grades'" class="tab-pane">
            <p>Grade records coming soon...</p>
          </div>
          <div v-if="activeTab === 'Finance'" class="tab-pane">
            <p>Finance records coming soon...</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Student not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

interface Student {
  id: string
  name: string
  email: string
  class: string
}

const route = useRoute()
const isLoading = ref(true)
const student = ref<Student | null>(null)
const activeTab = ref('Attendance')
const tabs = ['Attendance', 'Grades', 'Finance']

const loadStudent = async () => {
  isLoading.value = true
  try {
    const studentId = route.params.id as string
    // const api = useApi()
    // student.value = await api.get<Student>(`/api-proxy/students/${studentId}`)
    student.value = {
      id: studentId,
      name: 'John Doe',
      email: 'john@example.com',
      class: 'Form 1',
    }
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadStudent()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

h1 {
  flex: 1;
  margin: 0;
  color: var(--color-foreground);
}

.actions {
  display: flex;
  gap: 0.5rem;
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

.btn-secondary {
  background: var(--color-muted);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-brand-100);
}

.btn-primary {
  background: var(--color-brand-600);
  color: white;
}

.btn-primary:hover {
  background: var(--color-brand-700);
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}

.btn-danger:hover {
  background: var(--color-danger-hover);
}

.student-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.student-info {
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.info-section h3 {
  margin-top: 0;
  color: var(--color-foreground);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.info-item p {
  margin: 0;
  color: var(--color-foreground);
}

.student-tabs {
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: var(--color-foreground);
}

.tab-btn.active {
  color: var(--color-brand-600);
  border-bottom-color: var(--color-brand-600);
}

.tab-content {
  padding: 1.5rem;
}

.tab-pane {
  color: var(--color-muted-foreground);
}

.loading,
.not-found {
  text-align: center;
  padding: 2rem;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  color: var(--color-muted-foreground);
}
</style>
