<template>
  <div class="finance-page">
    <h1>Finance</h1>

    <div class="filters">
      <div class="filter-group">
        <label for="status">Status:</label>
        <select id="status" v-model="selectedStatus">
          <option value="">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="term">Term:</label>
        <select id="term" v-model="selectedTerm">
          <option value="">All Terms</option>
          <option value="Term 1">Term 1</option>
          <option value="Term 2">Term 2</option>
          <option value="Term 3">Term 3</option>
        </select>
      </div>
    </div>

    <div class="content">
      <p>Fees management and payment tracking coming soon...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const selectedStatus = ref('')
const selectedTerm = ref('')
</script>

<style scoped>
h1 {
  margin: 0 0 2rem 0;
  color: var(--color-foreground);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.875rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.875rem;
  background: var(--color-surface);
  color: var(--color-foreground);
}

.filter-group select:focus {
  outline: none;
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 25%, transparent);
}

.content {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-muted-foreground);
  text-align: center;
}
</style>
