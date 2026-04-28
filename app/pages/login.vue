<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--color-background);">
    <UCard class="w-full max-w-md" :ui="{ root: 'border border-[color:var(--color-border)]' }">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold" style="color: var(--color-foreground);">YEMS Login</h1>
          <p class="text-sm mt-1" style="color: var(--color-muted-foreground);">Education Management System</p>
        </div>
      </template>

      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <UFormField label="Email Address" name="email">
            <UInput
              v-model="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              size="lg"
              icon="i-heroicons-envelope"
              :ui="{ base: 'border-[color:var(--color-border)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]' }"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              size="lg"
              icon="i-heroicons-lock-closed"
              :ui="{ base: 'border-[color:var(--color-border)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]' }"
            />
          </UFormField>

          <UAlert v-if="error" color="error" :title="error" />
        </div>

        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="isLoading"
          class="mt-6"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </UButton>
      </form>

      <template #footer>
        <div class="text-center pt-4 border-t space-y-2" style="border-color: var(--color-border);">
          <NuxtLink to="/reset-password" class="text-xs hover:underline" style="color: var(--color-muted-foreground);">
            Forgot your password?
          </NuxtLink>
          <p class="text-xs mb-2" style="color: var(--color-muted-foreground);">Demo Credentials:</p>
          <div class="text-xs" style="color: var(--color-muted-foreground);">
            <p><span class="font-medium">Admin:</span> admin@example.com</p>
            <p><span class="font-medium">Teacher:</span> teacher@example.com</p>
            <p><span class="font-medium">Student:</span> student@example.com</p>
            <p class="mt-2 italic">Password: password123</p>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { login } = useAuth()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = computed(() => authStore.isLoading)

const handleLogin = async () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }

  try {
    await login(email.value, password.value)
    // navigateTo is faster/synchronous-style redirect, no login URL flash
    await navigateTo(getRoleHomePath(authStore.user))
  }
  catch (err: any) {
    error.value = err.data?.message || err.message || 'Login failed. Please check your credentials.'
  }
}
</script>