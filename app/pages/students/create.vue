<template>
  <div class="create-student">
    <div class="page-header">
      <NuxtLink to="/students" class="btn btn-secondary">Back</NuxtLink>
      <h1>Add New Student</h1>
    </div>

    <form class="student-form" @submit.prevent="submitForm">
      <div class="form-section">
        <h3>Personal Information</h3>

        <div class="form-group">
          <label for="name">Full Name *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter student full name"
          >
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email address"
          >
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="Enter phone number"
          >
        </div>

        <div class="form-group">
          <label for="class">Class *</label>
          <select id="class" v-model="form.class" required>
            <option value="">Select a class</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          Create Student
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="$router.back()"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

interface StudentForm {
  name: string
  email: string
  phone: string
  class: string
}

const router = useRouter()
const form = reactive<StudentForm>({
  name: '',
  email: '',
  phone: '',
  class: '',
})

const submitForm = async () => {
  try {
    // const api = useApi()
    // await api.post('/api-proxy/students', form)
    console.log('Student created:', form)
    await router.push('/students')
  }
  catch (error) {
    console.error('Error creating student:', error)
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

h1 {
  flex: 1;
  margin: 0;
  color: var(--color-foreground);
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

.student-form {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  border: 1px solid var(--color-border);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin-top: 0;
  color: var(--color-foreground);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-foreground);
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.875rem;
  background: var(--color-surface);
  color: var(--color-foreground);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 25%, transparent);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.form-actions .btn {
  flex: 1;
}
</style>
