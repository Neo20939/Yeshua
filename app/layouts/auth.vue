<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Auth layout for login and registration pages
// Spans full screen without sidebar
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  background: linear-gradient(135deg, var(--color-brand-100) 0%, var(--color-background) 100%);
}
</style>
