# YEMS API Documentation

**Title:** YEMS API  
**Description:** Yeshua Education Management System API  
**Version:** 1.0.0  
**Base URL:** `/api` (relative to server, adjust in production)

## Authentication

Two methods are supported:

- **Session Cookie** – `yems_session` cookie (set after login)
- **Session Token** – `x-session-token` header (fallback when cookies are unavailable)

Most endpoints require an authenticated session. Rate limiting may apply (e.g., 10 req/min for login).

---

## Tags & Endpoints

### Health
| Method | Path | Summary |
|--------|------|---------|
| GET | `/health/` | System health status |
| GET | `/health/cache` | Redis cache health & statistics |

### Auth
| Method | Path | Summary |
|--------|------|---------|
| POST | `/auth/login` | Authenticate and create session (rate limited) |
| POST | `/auth/logout` | Destroy current session |
| GET | `/auth/me` | Get current user profile |
| POST | `/auth/reset-password` | Consume reset token and set new password (unauthenticated) |

### Users (admin only)
| Method | Path | Summary |
|--------|------|---------|
| GET | `/users/` | Paginated list of users |
| POST | `/users/` | Create a new user with roles |
| GET | `/users/{id}` | Get user by ID |
| PATCH | `/users/{id}` | Update user details |
| DELETE | `/users/{id}` | Soft delete (set inactive) |
| POST | `/users/{id}/roles` | Replace user roles (valid stacks only) |
| POST | `/users/{id}/reset-password` | Generate a password reset token (admin delivers) |

### Admin
| Method | Path | Summary |
|--------|------|---------|
| GET | `/admin/stats` | System statistics (student, teacher, class counts, revenue, etc.) |

### Questions
| Method | Path | Summary |
|--------|------|---------|
| POST | `/questions/` | Create a new question (MCQ or theory) |
| GET | `/questions/` | List questions (admin: all; teachers: own) |
| GET | `/questions/{id}` | Get question details |
| PATCH | `/questions/{id}` | Update question text, marks, difficulty |
| DELETE | `/questions/{id}` | Delete question |
| POST | `/questions/{id}/options` | Add option to MCQ question |
| PATCH | `/questions/options/{optionId}` | Update an MCQ option |
| DELETE | `/questions/options/{optionId}` | Delete an MCQ option |

### Exams
| Method | Path | Summary |
|--------|------|---------|
| POST | `/exams/` | Create a new exam with selected questions |
| GET | `/exams/` | List exams (admin: all; teachers: own) |
| GET | `/exams/{id}` | Get exam details |
| PATCH | `/exams/{id}` | Update exam details or questions |
| DELETE | `/exams/{id}` | Delete exam |
| PATCH | `/exams/{id}/publish` | Make exam visible to students |
| PATCH | `/exams/{id}/unpublish` | Hide exam from students |
| GET | `/exams/published` | List published exams visible to current user |
| GET | `/exams/published/{id}` | Get published exam details |
| POST | `/exams/submissions` | Create a new exam submission (student) |
| GET | `/exams/submissions/me` | Get current student's submissions |
| GET | `/exams/submissions/{id}` | Get submission by ID |
| PATCH | `/exams/submissions/{id}` | Update answers before final submit |
| DELETE | `/exams/submissions/{id}` | Delete submission (before submit) |
| GET | `/exams/by-exam/{examId}/submissions` | Get all submissions for an exam (teacher/admin) |
| POST | `/exams/submissions/{id}/submit` | Finalise and submit exam |

### Assignments
| Method | Path | Summary |
|--------|------|---------|
| POST | `/assignments/` | Create a new assignment |
| GET | `/assignments/` | List assignments (role‑scoped) |
| GET | `/assignments/{id}` | Get assignment by ID |
| PATCH | `/assignments/{id}` | Update assignment details |
| DELETE | `/assignments/{id}` | Delete assignment |
| PATCH | `/assignments/{id}/publish` | Make assignment visible to students |
| PATCH | `/assignments/{id}/unpublish` | Hide assignment from students |
| POST | `/assignments/{id}/submit` | Submit an assignment (student) |
| GET | `/assignments/{id}/submissions` | List all submissions for an assignment |
| PATCH | `/assignments/submissions/{submissionId}/grade` | Grade a submission |

### Academic
| Method | Path | Summary |
|--------|------|---------|
| **Academic Years** | | |
| GET | `/academic/academic-years/` | List academic years |
| POST | `/academic/academic-years/` | Create a new academic year |
| GET | `/academic/academic-years/current` | Get current academic year |
| GET | `/academic/academic-years/{id}` | Get academic year by ID |
| PATCH | `/academic/academic-years/{id}` | Update academic year |
| DELETE | `/academic/academic-years/{id}` | Delete if no terms attached |
| GET | `/academic/academic-years/{id}/terms` | Get all terms for a year |
| GET | `/academic/academic-years/{id}/current-term` | Get current term for a year |
| POST | `/academic/academic-years/{id}/set-current` | Set as current academic year |
| **Terms** | | |
| GET | `/academic/terms/` | List terms |
| POST | `/academic/terms/` | Create a term within a year |
| GET | `/academic/terms/{id}` | Get term by ID |
| PATCH | `/academic/terms/{id}` | Update term |
| DELETE | `/academic/terms/{id}` | Delete term |
| POST | `/academic/terms/{id}/set-current` | Set as current term (within its year) |
| **Class Levels** | | |
| GET | `/academic/class-levels/` | Get all class levels (JS1‑JS3, SS1‑SS3) |
| **Departments** | | |
| GET | `/academic/departments/` | Get all departments (Science, Commercial, Arts) |
| **Classes** | | |
| GET | `/academic/classes/` | List classes (paginated) |
| POST | `/academic/classes/` | Create a class (auto‑generated name fallback) |
| GET | `/academic/classes/{id}` | Get class by ID |
| PATCH | `/academic/classes/{id}` | Update class name, arm, capacity, active status |
| DELETE | `/academic/classes/{id}` | Delete class |
| GET | `/academic/classes/{id}/students` | List students enrolled in class |
| GET | `/academic/classes/{id}/subjects` | List subjects taught in class |
| GET | `/academic/classes/{id}/timetable` | Get class schedule |
| GET | `/academic/classes/{id}/details` | Detailed class information |
| GET | `/academic/classes/{id}/enrollments` | Enrollment records for class |
| GET | `/academic/classes/{id}/academic-summary` | Academic performance summary for class |
| GET | `/academic/classes/{id}/students/{studentId}/academic` | Per‑student academic performance in class |
| GET | `/academic/classes/{id}/students/academic` | Bulk academic data for all students in class |
| GET | `/academic/classes/{id}/history` | Student movement history for class |
| **Subjects** | | |
| GET | `/academic/subjects/` | List subjects |
| POST | `/academic/subjects/` | Create a new subject |
| GET | `/academic/subjects/{id}` | Get subject by ID |
| PATCH | `/academic/subjects/{id}` | Update subject |
| DELETE | `/academic/subjects/{id}` | Delete subject |
| **Teacher Subject Assignments** | | |
| GET | `/academic/teacher-subject-assignments/` | List teacher‑to‑class‑subject assignments |
| POST | `/academic/teacher-subject-assignments/` | Assign teacher to teach a subject in a class for a year |
| GET | `/academic/teacher-subject-assignments/{id}` | Get assignment by ID |
| DELETE | `/academic/teacher-subject-assignments/{id}` | Remove assignment |
| **Class Teacher (Form Teacher) Assignments** | | |
| GET | `/academic/class-teacher-assignments/` | List class teacher assignments |
| POST | `/academic/class-teacher-assignments/` | Assign a form teacher to a class |
| GET | `/academic/class-teacher-assignments/{id}` | Get assignment by ID |
| DELETE | `/academic/class-teacher-assignments/{id}` | Remove assignment |

### Students
| Method | Path | Summary |
|--------|------|---------|
| GET | `/students/` | List students (paginated) |
| POST | `/students/` | Create student with profile + initial enrollment |
| GET | `/students/{id}` | Get student by ID |
| GET | `/students/{id}/history` | Get class transfer history |
| POST | `/students/{id}/enroll` | Enroll into a class (deactivates previous) |
| POST | `/students/{id}/transfer` | Transfer to a different class (same level only) |
| POST | `/students/promote` | Bulk promote students to next level |

### Notes
| Method | Path | Summary |
|--------|------|---------|
| POST | `/notes/` | Upload a note (PDF/Word) |
| GET | `/notes/` | List notes (role‑scoped) |
| GET | `/notes/archived` | Get archived notes for a student |
| GET | `/notes/{id}` | Get note metadata |
| PATCH | `/notes/{id}` | Update note title/description |
| DELETE | `/notes/{id}` | Delete note and file |
| GET | `/notes/{id}/file` | Download the file |
| PATCH | `/notes/{id}/publish` | Make visible to students |
| PATCH | `/notes/{id}/unpublish` | Hide from students |
| PATCH | `/note-archive-flags/{id}/revoke` | Revoke a student’s archived note access |

### Storage
| Method | Path | Summary |
|--------|------|---------|
| POST | `/storage/profile-picture` | Upload profile picture (max 5MB, JPEG/PNG/GIF/WebP) |
| DELETE | `/storage/profile-picture` | Delete profile picture |

### Finance
| Method | Path | Summary |
|--------|------|---------|
| POST | `/finance/fee-records` | Create a fee record for a student |
| GET | `/finance/fee-records` | List fee records (filters available) |
| POST | `/finance/fee-records/bulk` | Generate fee records for all active students in a term |
| GET | `/finance/stats/term/{termId}` | Aggregate financial metrics for a term |
| GET | `/finance/fee-records/{id}` | Get fee record by ID |
| PATCH | `/finance/fee-records/{id}` | Update amount due / due date |
| GET | `/finance/fee-records/{id}/payments` | Get all payment transactions for a fee record |
| POST | `/finance/payments` | Record a payment |
| POST | `/finance/payments/{id}/reverse` | Reverse a payment (with reason) |
| GET | `/finance/students/{studentId}/fee-status` | Complete fee status for a student |

### Services (technician)
| Method | Path | Summary |
|--------|------|---------|
| GET | `/services/health` | Health of all system services |
| GET | `/services/health/{service}` | Health of a specific service |
| POST | `/services/restart/{service}` | Restart a service (app_server, db_pool, file_storage, queue_system) |

### Audit (admin only)
| Method | Path | Summary |
|--------|------|---------|
| GET | `/audit/` | Paginated audit logs with filters (actor, action, entity, date range) |
| GET | `/audit/export` | Export filtered logs as CSV |

### Announcements
| Method | Path | Summary |
|--------|------|---------|
| GET | `/announcements/banner` | Get active banner announcements for current user |
| GET | `/announcements/` | List announcements (admin/technician) |
| POST | `/announcements/` | Create announcement (targeted to everyone, teachers, roles, classes, or users) |
| PATCH | `/announcements/{id}` | Update announcement and retarget audience |
| DELETE | `/announcements/{id}` | Delete announcement |

### Attendance
| Method | Path | Summary |
|--------|------|---------|
| POST | `/attendance/sessions` | Create a class attendance session for a date (admin/class teacher) |
| POST | `/attendance/sessions/{id}/records` | Mark/update student attendance statuses |
| GET | `/attendance/sessions/{id}` | Get session details |
| GET | `/attendance/classes/{classId}/sessions` | List attendance sessions for a class |
| GET | `/attendance/me` | Current student’s attendance history & summary |

### Schedules
| Method | Path | Summary |
|--------|------|---------|
| GET | `/schedules/me` | Get schedule context for student/teacher/admin |

### Status (public)
| Method | Path | Summary |
|--------|------|---------|
| GET | `/status/` | Public status page (HTML) |
| GET | `/status/api` | Current system status as JSON (cached) |
| GET | `/status/api/components` | Health of all components (cached) |
| GET | `/status/api/uptime` | 15‑day uptime history (cached) |
| GET | `/status/api/incidents` | Currently active incidents (cached) |
| POST | `/status/api/incidents` | Create a new incident (admin/technician) |
| POST | `/status/api/observer/gatus` | Receive external Gatus webhooks (secret protected) |
| POST | `/status/api/incidents/{id}/update` | Add an update to an incident |
| POST | `/status/api/incidents/{id}/resolve` | Mark incident as resolved |

### Metrics
| Method | Path | Summary |
|--------|------|---------|
| GET | `/metrics/` | Prometheus metrics (admin/technician or bearer token for scraping) |

### Test (development only)
| Method | Path | Summary |
|--------|------|---------|
| GET | `/test/` | Minimal UI for E2E testing |

---

## Additional Information

- **Rate Limiting:** Login endpoint `/api/auth/login` allows 10 requests per minute.
- **Pagination:** Many `GET` list endpoints support `page`, `limit`, and filter parameters as shown in the spec.
- **File Uploads:** Notes and profile pictures use `multipart/form-data`.
- **Soft Delete:** Users are soft‑deleted (`isActive=false`).

For detailed request/response schemas, refer to the full OpenAPI document.