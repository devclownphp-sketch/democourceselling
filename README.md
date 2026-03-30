# Course Selling Platform

This project is a Next.js + PostgreSQL + Prisma application with:

- Public front page with database-driven courses
- WhatsApp enroll button with enroll click tracking
- Contact page with DB storage
- Admin login (username + password)
- Admin panel with left sidebar pages:
  - Dashboard metrics
  - Course management (create/update/delete)
  - Contact submissions
  - Admin management (create new admins)
  - Password change

## 1) Environment

Create `.env` from `.env.example` and update values:

```bash
cp .env.example .env
```

## 2) Database Setup

Use PostgreSQL and run:

```bash
bun run prisma:generate
bun run prisma:migrate --name init
bun run prisma:seed
```

## 3) Run Application

```bash
bun run dev
```

Open:

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Default Admin (if seeded)

- Username: value of `ADMIN_USERNAME` (default: `admin`)
- Password: value of `ADMIN_PASSWORD` (default: `admin123`)

Change password immediately from Admin Settings.
