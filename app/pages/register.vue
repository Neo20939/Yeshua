<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--color-background);">
    <UCard class="w-full max-w-md" :ui="{ root: 'border border-[color:var(--color-border)]' }">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold" style="color: var(--color-foreground);">Create Account</h1>
          <p class="text-sm mt-1" style="color: var(--color-muted-foreground);">Join YEMS Education Management System</p>
        </div>
      </template>

      <form @submit.prevent="handleRegister">
        <div class="space-y-4">
          <UFormField label="Full Name" name="name">
            <UInput
              v-model="name"
              type="text"
              placeholder="Enter your full name"
              autocomplete="name"
              size="lg"
              icon="i-heroicons-user"
              :ui="{ base: 'border-[color:var(--color-border)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]' }"
            />
          </UFormField>

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
              placeholder="Create a password"
              autocomplete="new-password"
              size="lg"
              icon="i-heroicons-lock-closed"
              :ui="{ base: 'border-[color:var(--color-border)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]' }"
            />
          </UFormField>

          <UFormField label="Confirm Password" name="confirmPassword">
            <UInput
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autocomplete="new-password"
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
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </UButton>

        <p class="text-center text-sm mt-4" style="color: var(--color-muted-foreground);">
          Already have an account?
          <NuxtLink to="/login" class="font-medium hover:underline" style="color: var(--color-brand-600);">
            Sign in
          </NuxtLink>
        </p>
      </form>

      <template #footer>
        <div class="text-center pt-4 border-t" style="border-color: var(--color-border);">
          <p class="text-xs italic" style="color: var(--color-muted-foreground);">
            Registration requires admin approval for teacher and student accounts.
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = computed(() => authStore.isLoading)

// Redirect if already authenticated
watch(
  () => authStore.user,
  (user) => {
    if (user) {
      router.push('/dashboard')
    }
  },
  { immediate: true },
)

const handleRegister = async () => {
  error.value = ''

  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  try {
    error.value = 'Self-registration is not enabled. Please contact an administrator.'
  }
  catch (err: any) {
    error.value = err.data?.message || 'Registration failed. Please try again.'
  }
}
</script>
