<template>
  <div class="student-dashboard">
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>Welcome back, {{ studentName }}!</h1>
        <p class="subtitle">{{ currentDate }}</p>
      </div>
      <div class="student-info-card">
        <div class="info-row">
          <span class="info-label">Student ID</span>
          <span class="info-value">{{ studentId }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Class</span>
          <span class="info-value">{{ studentClass }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="badge-active">{{ attendanceStatus }}</span>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <UIcon name="i-lucide-sticky-note" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">8</div>
          <div class="stat-label">Notes</div>
        </div>
      </div>
      <div class="stat-card">
        <UIcon name="i-lucide-clipboard-list" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">5</div>
          <div class="stat-label">Assignments</div>
        </div>
      </div>
      <div class="stat-card">
        <UIcon name="i-lucide-book-open" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">12</div>
          <div class="stat-label">Texts</div>
        </div>
      </div>
      <div class="stat-card">
        <UIcon name="i-lucide-pencil" class="stat-icon" />
        <div class="stat-content">
          <div class="stat-value">3</div>
          <div class="stat-label">Exams</div>
        </div>
      </div>
    </div>

    <section aria-live="polite">
      <div v-if="activeSection === 'overview'" class="section">
        <div class="dashboard-layout">
          <div class="main-content">
            <section class="school-news">
              <h2>School News</h2>
              <div class="news-list">
                <article class="news-card">
                  <div class="news-image"></div>
                  <div class="news-content">
                    <span class="news-category">Announcement</span>
                    <h3>Mid-Term Examinations Scheduled</h3>
                    <p>Mid-term examinations will be held from May 15-20, 2026. All students are advised to prepare accordingly. The schedule has been uploaded to the student portal.</p>
                    <span class="news-date">Apr 27, 2026</span>
                  </div>
                </article>
                <article class="news-card">
                  <div class="news-image"></div>
                  <div class="news-content">
                    <span class="news-category">Event</span>
                    <h3>Annual Sports Day</h3>
                    <p>Our annual sports day is scheduled for May 25, 2026. Registration is now open for all interested participants.</p>
                    <span class="news-date">Apr 25, 2026</span>
                  </div>
                </article>
                <article class="news-card">
                  <div class="news-image"></div>
                  <div class="news-content">
                    <span class="news-category">Notice</span>
                    <h3>Parent-Teacher Meeting</h3>
                    <p>The quarterly PTA meeting will be held on May 30, 2026 at 2:00 PM. All parents are encouraged to attend.</p>
                    <span class="news-date">Apr 20, 2026</span>
                  </div>
                </article>
              </div>
            </section>
          </div>

          <div class="side-content">
            <section class="pending-tasks">
              <h2>Pending Tasks</h2>
              <div class="tasks-list">
                <div class="task-item">
                  <div class="task-check"></div>
                  <div class="task-info">
                    <h4>Mathematics Assignment</h4>
                    <p>Due: May 05, 2026</p>
                  </div>
                </div>
                <div class="task-item">
                  <div class="task-check"></div>
                  <div class="task-info">
                    <h4>English Essay</h4>
                    <p>Due: May 08, 2026</p>
                  </div>
                </div>
                <div class="task-item">
                  <div class="task-check"></div>
                  <div class="task-info">
                    <h4>Science Lab Report</h4>
                    <p>Due: May 10, 2026</p>
                  </div>
                </div>
                <div class="task-item">
                  <div class="task-check"></div>
                  <div class="task-info">
                    <h4>History Project</h4>
                    <p>Due: May 15, 2026</p>
                  </div>
                </div>
                <div class="task-item">
                  <div class="task-check"></div>
                  <div class="task-info">
                    <h4>Physics Quiz</h4>
                    <p>Due: May 12, 2026</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div v-else class="section section-card">
        <div class="section-header">
          <h2 class="section-title">{{ sectionTitle }}</h2>
          <p class="section-subtitle">Coming soon...</p>
        </div>

        <div class="section-body">
          <p class="muted">
            This section will contain your {{ sectionTitle.toLowerCase() }}.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'student',
  middleware: ['auth', 'role'],
  roles: ['student'],
})

const studentName = ref('John Doe')
const studentId = ref('STU001')
const studentClass = ref('Form 1 - A')
const attendanceStatus = ref('Present')

type SectionKey = 'overview' | 'notes' | 'assignments' | 'exams' | 'tests' | 'results'

const route = useRoute()

const activeSection = computed<SectionKey>(() => {
  const tab = route.query.tab
  if (typeof tab !== 'string')
    return 'overview'

  const allowed: SectionKey[] = ['overview', 'notes', 'assignments', 'exams', 'tests', 'results']
  return allowed.includes(tab as SectionKey) ? (tab as SectionKey) : 'overview'
})

const sectionTitle = computed(() => {
  switch (activeSection.value) {
    case 'overview': return 'Overview'
    case 'notes': return 'Notes'
    case 'assignments': return 'Assignments'
    case 'exams': return 'Exams'
    case 'tests': return 'Tests'
    case 'results': return 'Results'
    default: return 'Section'
  }
})

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
</script>

<style scoped>
.student-dashboard {
  max-width: 1400px;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.welcome-content h1 {
  margin: 0 0 0.5rem 0;
  color: var(--color-foreground);
}

.subtitle {
  margin: 0;
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

.student-info-card {
  background: var(--color-surface);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 200px;
  border: 1px solid var(--color-border);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
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

.badge-active {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #d4edda;
  color: #155724;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--color-border);
}

.stat-icon {
  width: 28px;
  height: 28px;
  color: var(--color-brand-600);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--color-brand-600);
}

.stat-label {
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
}

section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: var(--color-foreground);
}

.school-news {
  margin-bottom: 2rem;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-card {
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  border: 1px solid var(--color-border);
}

.news-image {
  width: 200px;
  background: var(--color-muted);
  flex-shrink: 0;
}

.news-content {
  padding: 1.25rem;
  flex: 1;
}

.news-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-brand-100);
  color: var(--color-brand-700);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.news-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: var(--color-foreground);
}

.news-content p {
  margin: 0 0 0.75rem 0;
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
  line-height: 1.5;
}

.news-date {
  color: var(--color-muted-foreground);
  font-size: 0.75rem;
}

.tasks-list {
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border: 1px solid var(--color-border);
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.task-item:last-child {
  border-bottom: none;
}

.task-check {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  flex-shrink: 0;
}

.task-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: var(--color-foreground);
}

.task-info p {
  margin: 0;
  color: var(--color-danger);
  font-size: 0.75rem;
}

.section-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.75rem;
}

.section-title {
  margin: 0;
  color: var(--color-foreground);
  font-size: 1.125rem;
}

.section-subtitle {
  margin: 0.25rem 0 0 0;
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

.muted {
  color: var(--color-muted-foreground);
}
</style>
