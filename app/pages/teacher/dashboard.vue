<template>
  <div class="teacher-dashboard">
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>{{ sectionTitle }}</h1>
        <p class="subtitle">Create and manage student learning content for {{ teacherSubject }}</p>
      </div>
      <div class="teacher-info-card">
        <div class="info-row">
          <span class="info-label">Teacher</span>
          <span class="info-value">{{ teacherName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Subject</span>
          <span class="info-value">{{ teacherSubject }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Active Class</span>
          <span class="info-value">{{ activeClass }}</span>
        </div>
      </div>
    </div>

    <div v-if="activeSection === 'dashboard'" class="stats-grid">
      <div class="stat-card">
        <UIcon name="i-lucide-sticky-note" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">24</div>
          <div class="stat-label">Published Notes</div>
        </div>
      </div>
      <div class="stat-card">
        <UIcon name="i-lucide-clipboard-list" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">12</div>
          <div class="stat-label">Active Assignments</div>
        </div>
      </div>
      <div class="stat-card">
        <UIcon name="i-lucide-square-check" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">9</div>
          <div class="stat-label">Scheduled Tests</div>
        </div>
      </div>
      <div class="stat-card">
        <UIcon name="i-lucide-pencil" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">4</div>
          <div class="stat-label">Upcoming Exams</div>
        </div>
      </div>
    </div>

    <section class="panel section-card">
      <div class="section-header">
        <h2 class="section-title">{{ sectionTitle }} Workspace</h2>
        <p class="section-subtitle">Creation tools for student delivery</p>
      </div>

      <form class="form-grid" @submit.prevent>
        <div class="field">
          <label class="label" for="title">Title</label>
          <input id="title" type="text" :placeholder="`Enter ${sectionTitle.toLowerCase()} title`">
        </div>

        <div class="field">
          <label class="label" for="class">Class</label>
          <select id="class">
            <option>Form 1</option>
            <option>Form 2</option>
            <option>Form 3</option>
            <option>Form 4</option>
          </select>
        </div>

        <div class="field">
          <label class="label" for="deadline">Due Date</label>
          <input id="deadline" type="date">
        </div>

        <div class="field full-width">
          <label class="label" for="desc">Description</label>
          <textarea id="desc" rows="4" :placeholder="`Add details for students`"></textarea>
        </div>

        <div class="actions full-width">
          <button class="btn btn-primary" type="button">
            Create {{ sectionTitle === 'Dashboard' ? 'Item' : sectionTitle.slice(0, -1) }}
          </button>
          <button class="btn btn-secondary" type="button">
            Save Draft
          </button>
        </div>
      </form>
    </section>

    <section class="panel section-card">
      <div class="section-header">
        <h2 class="section-title">Recent {{ sectionTitle }}</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Class</th>
              <th>Status</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Week 3 Topic Review</td>
              <td>Form 2</td>
              <td><span class="badge published">Published</span></td>
              <td>Apr 24, 2026</td>
            </tr>
            <tr>
              <td>Continuous Assessment 1</td>
              <td>Form 1</td>
              <td><span class="badge draft">Draft</span></td>
              <td>Apr 22, 2026</td>
            </tr>
            <tr>
              <td>Chapter 4 Exercise</td>
              <td>Form 3</td>
              <td><span class="badge published">Published</span></td>
              <td>Apr 19, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'teacher',
  middleware: ['auth', 'role'],
  roles: ['teacher', 'admin'],
})

type SectionKey = 'dashboard' | 'notes' | 'assignments' | 'tests' | 'exams'

const route = useRoute()
const authStore = useAuthStore()

const teacherName = computed(() => authStore.user?.name || 'Teacher')
const teacherSubject = ref('Mathematics')
const activeClass = ref('Form 2')

const activeSection = computed<SectionKey>(() => {
  const tab = route.query.tab
  if (typeof tab !== 'string')
    return 'dashboard'

  const allowed: SectionKey[] = ['dashboard', 'notes', 'assignments', 'tests', 'exams']
  return allowed.includes(tab as SectionKey) ? (tab as SectionKey) : 'dashboard'
})

const sectionTitle = computed(() => {
  switch (activeSection.value) {
    case 'dashboard': return 'Dashboard'
    case 'notes': return 'Notes'
    case 'assignments': return 'Assignments'
    case 'tests': return 'Tests'
    case 'exams': return 'Exams'
    default: return 'Dashboard'
  }
})
</script>

<style scoped>
.teacher-dashboard {
  max-width: 1400px;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.welcome-content h1 {
  margin: 0 0 0.35rem 0;
  color: var(--color-foreground);
}

.subtitle {
  margin: 0;
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

.teacher-info-card {
  background: var(--color-surface);
  padding: 1rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 240px;
  border: 1px solid var(--color-border);
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid var(--color-border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

.info-value {
  font-weight: 600;
  color: var(--color-foreground);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--color-surface);
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.stat-icon {
  width: 24px;
  height: 24px;
  color: var(--color-brand-600);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-brand-700);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
}

.panel {
  margin-bottom: 1rem;
}

.section-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.1rem;
}

.section-header {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.85rem;
}

.section-title {
  margin: 0;
  color: var(--color-foreground);
  font-size: 1.05rem;
}

.section-subtitle {
  margin: 0.2rem 0 0 0;
  color: var(--color-muted-foreground);
  font-size: 0.82rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 0.83rem;
  font-weight: 600;
  color: var(--color-foreground);
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
  background: var(--color-surface);
  color: var(--color-foreground);
  font-size: 0.875rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 25%, transparent);
}

.actions {
  display: flex;
  gap: 0.7rem;
}

.btn {
  border: none;
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-brand-600);
  color: white;
}

.btn-primary:hover {
  background: var(--color-brand-700);
}

.btn-secondary {
  background: var(--color-muted);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-brand-100);
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--color-muted);
}

th,
td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-foreground);
  font-size: 0.875rem;
}

.badge {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
}

.badge.published {
  background: #d9fbe8;
  color: #0f5132;
}

.badge.draft {
  background: #fff3cd;
  color: #664d03;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
