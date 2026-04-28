<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--color-background);">
    <UCard class="w-full max-w-md" :ui="{ root: 'border border-[color:var(--color-border)]' }">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold" style="color: var(--color-foreground);">Reset Password</h1>
          <p class="text-sm mt-1" style="color: var(--color-muted-foreground);">Enter your email to receive a reset link</p>
        </div>
      </template>

      <div v-if="success" class="text-center space-y-4">
        <UIcon name="i-heroicons-check-circle" class="text-4xl text-green-500 mx-auto" />
        <p style="color: var(--color-foreground);">
          Password reset link sent! Check your email inbox.
        </p>
        <NuxtLink to="/login" class="text-sm hover:underline" style="color: var(--color-brand-600);">
          Back to login
        </NuxtLink>
      </div>

      <form v-else @submit.prevent="handleReset">
        <div class="space-y-4">
          <UFormField label="Email Address" name="email">
            <UInput
              v-model="email"
              type="email"
              placeholder="Enter your registered email"
              autocomplete="email"
              size="lg"
              icon="i-heroicons-envelope"
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
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </UButton>

        <p class="text-center text-sm mt-4" style="color: var(--color-muted-foreground);">
          Remember your password?
          <NuxtLink to="/login" class="font-medium hover:underline" style="color: var(--color-brand-600);">
            Sign in
          </NuxtLink>
        </p>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const email = ref('')
const error = ref('')
const success = ref(false)
const isLoading = ref(false)

const handleReset = async () => {
  error.value = ''

  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  isLoading.value = true

  try {
    await $fetch('/api-proxy/auth/reset-password', {
      method: 'POST',
      body: { email: email.value },
    })
    success.value = true
  }
  catch (err: any) {
    error.value = err.data?.message || 'Failed to send reset link. Please check your email.'
  }
  finally {
    isLoading.value = false
  }
}
</script>