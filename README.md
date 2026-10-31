# EduPath — Student Course Management System

An enterprise-style Learning Management System skeleton with a fully
working authentication module. Built in phases:

- **Phase 1** — Project foundation (React/Vite + Bootstrap 5 frontend,
  Express backend, layouts, routing, reusable UI kit, no business logic)
- **Phase 2** — Authentication & Authorization (this document's focus)

## Structure

```
client/   React (Vite) + Bootstrap 5 frontend
server/   Node.js + Express backend
```

## Quick Start

```bash
# Backend
cd server
cp .env.example .env      # then edit JWT_SECRET, MONGO_URI, etc.
npm install
npm run seed:admin        # creates the default admin account
npm run dev                # http://localhost:5000

# Frontend (separate terminal)
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

---

# Phase 2 Documentation

## 1. Phase 2 Features

- Student registration with hashed passwords (bcryptjs)
- Student login and separate Admin login, each restricted to their own role
- Stateless JWT authentication delivered via a single **httpOnly cookie**
  (no Authorization header, no token in localStorage/JS-readable storage)
- Role-based authorization on the backend (`authenticateUser` + `authorizeRoles`)
- Frontend route guards (`ProtectedRoute`, `StudentRoute`, `AdminRoute`) that
  redirect unauthenticated or wrong-role users appropriately
- `AuthContext` restoring the session automatically on page refresh, and
  auto-logging out when any request comes back `401`
- Profile view and update (full name, phone, profile image URL)
- Centralized validation (`express-validator`), consistent JSON error
  shape, and a global error handler that normalizes Mongoose/JWT/ApiError
  failures
- Rate limiting on auth endpoints
- Forms built with React Hook Form: client-side validation, password
  confirmation, show/hide password, loading buttons, success/error toasts

## 2. Folder Structure

```
server/
├── config/            env.js, corsOptions.js
├── controllers/        auth.controller.js
├── database/           connectDB.js
├── middleware/          authenticateUser.js, authorizeRoles.js,
│                        validateRequest.js, asyncHandler.js,
│                        notFoundHandler.js, globalErrorHandler.js,
│                        rateLimiter.js
├── models/              User.model.js
├── routes/              auth.routes.js, index.js
├── scripts/             seedAdmin.js
├── services/            auth.service.js, jwt.service.js
├── uploads/             (reserved for future file uploads)
├── utils/               ApiError.js, ApiResponse.js
├── validators/           auth.validator.js
├── app.js, server.js, package.json, .env.example

client/
└── src/
    ├── components/
    │   ├── dashboard/    ProfileCard.jsx
    │   ├── layout/       Navbar.jsx, Footer.jsx, PageContainer.jsx
    │   └── ui/            Button, Input (forwardRef), PasswordInput
    │                       (forwardRef), Card, SectionTitle, Loader,
    │                       SkeletonLoader, Container, EmptyState
    ├── context/            AuthContext.jsx
    ├── layouts/            PublicLayout.jsx, MainLayout.jsx
    ├── pages/
    │   ├── admin/          AdminLogin.jsx, AdminDashboard.jsx
    │   ├── public/          Home, About, Courses, CourseDetails,
    │   │                     Contact, FAQ, NotFound
    │   └── student/         StudentLogin.jsx, StudentRegister.jsx,
    │                         StudentDashboard.jsx
    ├── routes/              AppRoutes.jsx, ProtectedRoute.jsx,
    │                         StudentRoute.jsx, AdminRoute.jsx,
    │                         ScrollToTop.jsx
    ├── services/             apiClient.js, authService.js
    ├── styles/                theme.css, bootstrap-overrides.css, global.css
    └── App.jsx, main.jsx
```

## 3. Authentication Flow

**Student**
```
Register → bcrypt-hash password → issue JWT → set httpOnly cookie
  → redirect to Student Dashboard
Login → verify credentials + role === student → set cookie → redirect
Every request → authenticateUser reads cookie → verifies JWT → loads user
Logout → clear cookie
Refresh → AuthContext calls GET /auth/profile (cookie sent automatically)
  → session restored if the cookie is still valid
```

**Admin**
```
Login (separate page/endpoint) → verify credentials + role === admin
  → set cookie → redirect to Admin Dashboard
```

Students can never authenticate through the admin endpoint and vice versa,
even with technically-valid credentials, because `login()` filters by
`{ email, role: expectedRole }`.

## 4. API Endpoints

| Method | Route | Access | Body / Notes |
|---|---|---|---|
| POST | `/api/auth/register` | Public | `{ fullName, email, password, confirmPassword, phone }` → 201 |
| POST | `/api/auth/login` | Public | `{ email, password }` → student only, 200 |
| POST | `/api/auth/admin/login` | Public | `{ email, password }` → admin only, 200 |
| POST | `/api/auth/logout` | Public | Clears the auth cookie |
| GET | `/api/auth/profile` | Cookie required | Returns the current user |
| PUT | `/api/auth/profile` | Cookie required | `{ fullName?, phone?, profileImage? }` |
| GET | `/api/health` | Public | Liveness check |

All responses follow `{ success, statusCode, message, data }`; validation/
error responses follow `{ success, statusCode, message, errors? }`.

## 5. Environment Variables

**server/.env**
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/student_course_management

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
AUTH_COOKIE_NAME=token
AUTH_COOKIE_MAX_AGE_MS=86400000

# Used only by scripts/seedAdmin.js
ADMIN_FULL_NAME=System Administrator
ADMIN_EMAIL=admin@edupath.com
ADMIN_PASSWORD=Admin@12345
ADMIN_PHONE=0000000000
```

**client/.env**
```
VITE_API_URL=/api
VITE_APP_NAME=EduPath
```

## 6. Installation Steps

```bash
cd server && npm install
cd ../client && npm install
```

No new packages were required beyond what Phase 1 already listed
(`bcryptjs`, `jsonwebtoken`, `cookie-parser`, `express-validator` were
already in `server/package.json`; `react-hook-form`, `react-icons` were
already in `client/package.json`).

## 7. Run Commands

```bash
# Terminal 1
cd server
npm run seed:admin   # one-time, creates the default admin account
npm run dev           # http://localhost:5000

# Terminal 2
cd client
npm run dev            # http://localhost:5173
```

## 8. Testing Guide

1. `GET http://localhost:5000/api/health` → `{ success: true }`
2. Register a student at `/student/register` → redirected to
   `/student/dashboard`, welcome message shows your name
3. Refresh the page → still logged in (session restored via cookie)
4. Logout → redirected to `/student/login`
5. Visit `/student/dashboard` directly while logged out → redirected to
   `/student/login`
6. Log in as the seeded admin at `/admin/login` → redirected to
   `/admin/dashboard`
7. While logged in as admin, visit `/student/dashboard` → redirected to `/`
   (wrong role)
8. On the Student Dashboard, edit and save the Profile card → toast
   confirms, refresh → changes persisted
9. Try registering with an already-used email → inline/toast error,
   no duplicate created
10. Try logging in with the wrong password → toast error, no cookie set

## 9. Default Admin Account (seeded)

Created by `npm run seed:admin` using the `ADMIN_*` env vars above:
- **Email:** `admin@edupath.com`
- **Password:** `Admin@12345`

Change these in `server/.env` before seeding in any shared/deployed
environment.

## 10. Known Limitations

- No email verification flow yet (`isEmailVerified` field exists on the
  User model but is never set to `true` by any endpoint)
- "Forgot Password" and "Remember Me" are UI-only, not functional
- No refresh-token rotation — a single JWT is issued with a fixed
  expiry (`JWT_EXPIRES_IN`); once it expires, the user must log in again
- No admin self-registration endpoint by design — admins are bootstrapped
  via `scripts/seedAdmin.js` only
- No course, enrollment, or analytics data — dashboards are placeholders
  by design, deferred to a later phase
- Profile image is a URL field only; no file upload (`multer` is
  installed but unused until an upload endpoint is built)
- This sandbox environment had no network access, so `npm install` /
  production build / live server boot could not be executed end-to-end
  here — code was verified via static syntax checking
  (`node --check` on all backend files, `tsc --noEmit` on all frontend
  files, zero errors). Run the install/build/start commands above on a
  machine with network access to do a full live verification.

## 11. Technologies Used

**Frontend:** React 18, Vite, Bootstrap 5, React Router DOM, Axios,
React Hook Form, Framer Motion, React Icons, React Hot Toast

**Backend:** Node.js, Express, MongoDB, Mongoose, bcryptjs, jsonwebtoken,
cookie-parser, express-validator, express-rate-limit, helmet, morgan,
cors, dotenv, multer (installed, unused until file uploads are needed)

## 12. Security Features

- Passwords hashed with bcrypt (12 salt rounds), never returned in any
  API response (`select: false` on the schema field + `toSafeObject()`)
- JWT stored in an **httpOnly** cookie — inaccessible to JavaScript,
  mitigating XSS token theft; `secure` flag enabled in production;
  `sameSite: 'lax'`
- Helmet sets standard security headers
- CORS restricted to the configured client origin, with credentials enabled
- Rate limiting: a general API limiter plus a stricter limiter on
  login/register/admin-login to slow brute-force attempts
- Centralized input validation (`express-validator`) rejecting malformed
  requests before they reach business logic
- Role-based authorization enforced server-side on every protected route
  (frontend route guards are a UX convenience, not the security boundary)
- Profile updates use an explicit field whitelist (`fullName`, `phone`,
  `profileImage`) — role/email/password can never be changed via that endpoint
- Consistent error responses that never leak stack traces outside development

## 13. Commit Summary

```
feat(phase-2): implement enterprise authentication & authorization

- Add User model (fullName, email, password, phone, profileImage,
  role, isActive, isEmailVerified) with bcrypt hashing and indexes
- Implement register/login/adminLogin/logout/profile endpoints with
  express-validator validation and a single httpOnly-cookie JWT
- Add authenticateUser + authorizeRoles middleware for role-based
  access control; rename/enhance notFoundHandler + globalErrorHandler
  to normalize Mongoose/JWT/ApiError failures consistently
- Add AuthContext with automatic session restore on refresh and
  auto-logout on 401; add ProtectedRoute/StudentRoute/AdminRoute
  guarding the dashboards
- Wire StudentLogin, StudentRegister, AdminLogin to real auth; add
  show/hide PasswordInput and a ProfileCard for profile view/update
- Simplify Student Registration fields to match the actual User model
- Fix: Input.jsx and PasswordInput.jsx wrapped in React.forwardRef so
  React Hook Form's ref reaches the underlying DOM node without warnings
- Fix: AuthContext skips the guaranteed-401 profile fetch for visitors
  with no prior session hint, avoiding console noise on first load
  without weakening server-side auth verification
- No course, enrollment, dashboard analytics, or admin management
  features included - reserved for later phases
```
