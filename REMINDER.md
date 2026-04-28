# Auth Middleware Restoration Reminder

The auth middleware was temporarily removed to view pages without login. Restore `middleware: 'auth'` to these files:

## Files to restore:

1. `app/pages/index.vue` - line 3
   - Current: `middleware: ['auth']`

2. `app/pages/dashboard.vue` - line 40
   - Current: `middleware: 'auth'`

3. `app/pages/admin/index.vue` - line 35
   - Current: `middleware: 'auth'`

4. `app/pages/attendance/index.vue` - line 30
   - Current: `middleware: 'auth'`

5. `app/pages/students/index.vue` - line 64
   - Current: `middleware: 'auth'`

6. `app/pages/students/[id].vue` - line 75
   - Current: `middleware: 'auth'`

7. `app/pages/students/create.vue` - line 74
   - Current: `middleware: 'auth'`

8. `app/pages/exams/index.vue` - line 35
   - Current: `middleware: 'auth'`

9. `app/pages/finance/index.vue` - line 34
   - Current: `middleware: 'auth'`

## How to restore:

Replace each `middleware: 'auth'` (or `middleware: ['auth']`) with the original value.