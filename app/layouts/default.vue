<template>
  <div class="app-layout">
    <div class="overlay" :class="{ open: sidebarOpen }" @click="sidebarOpen = false" />

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h1>YEMS</h1>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink to="/dashboard" class="nav-link">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/students" class="nav-link">
          Students
        </NuxtLink>
        <NuxtLink to="/attendance" class="nav-link">
          Attendance
        </NuxtLink>
        <NuxtLink to="/exams" class="nav-link">
          Exams
        </NuxtLink>
        <NuxtLink to="/finance" class="nav-link">
          Finance
        </NuxtLink>
        <NuxtLink to="/admin" class="nav-link">
          Admin
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-logout" type="button" @click="handleLogout">
          Logout
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="header">
        <div class="header-left">
          <button
            class="menu-toggle"
            type="button"
            aria-label="Toggle navigation"
            @click="toggleSidebar"
          >
            <UIcon name="i-lucide-menu" class="menu-toggle-icon" />
          </button>
        </div>

        <div class="header-right">
          <div class="user-profile">
            <span>{{ authUser?.firstName }} {{ authUser?.lastName }}</span>
          </div>
        </div>
      </header>

      <div class="content-area">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth()
const authStore = useAuthStore()

const authUser = computed(() => authStore.userInfo)
const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

onMounted(() => {
  // Start closed on small screens so content isn't covered on first paint.
  if (window.matchMedia('(max-width: 768px)').matches) {
    sidebarOpen.value = false
  }
})

const handleLogout = async () => {
  await logout()
  await navigateTo('/login')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.overlay {
  display: none;
}

.sidebar {
  width: 250px;
  background: var(--color-brand-800);
  color: var(--color-background);
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar-header h1 {
  margin: 0;
  font-size: 1.25rem;
  letter-spacing: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-link {
  display: block;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-background);
  border-left-color: var(--color-brand-400);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-background);
  border-left-color: var(--color-brand-400);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.btn-logout {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: var(--color-danger-hover);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  padding: 0.25rem;
  border-radius: 8px;
  color: var(--color-foreground);
}

.menu-toggle:hover {
  background: var(--color-muted);
}

.menu-toggle-icon {
  width: 22px;
  height: 22px;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.header-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-foreground);
}

.content-area {
  flex: 1;
  padding: 2rem;
  background: var(--color-background);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: inline-flex;
  }

  .overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 40;
  }

  .overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 260px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.2s;
    z-index: 50;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .content-area {
    padding: 1.25rem;
  }
}

</style>
 <script setup lang="ts">
// This triggers the /me call – the plugin interceptor does the rest.
// No need to await – just fire and forget.
useFetch('/api/auth/me');
</script>
