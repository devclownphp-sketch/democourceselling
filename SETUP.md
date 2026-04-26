# 🚀 STP Computer Education — Setup Guide

Complete beginner-friendly guide to run this project on your machine.

---

## Step 1: Install Required Software

### 1.1 Install Node.js
Download and install Node.js (LTS version):
- Go to: https://nodejs.org
- Download the **LTS** version (green button)
- Run the installer → click Next → Finish

### 1.2 Install Bun (Package Manager)
Open **PowerShell** or **Terminal** and run:
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```
After installation, **close and reopen** your terminal.

Verify it works:
```bash
bun --version
```

### 1.3 Install Git
- Go to: https://git-scm.com/downloads
- Download and install (use all default settings)

---

## Step 2: Set Up PostgreSQL Database

You have **two options**:

### Option A: Free Cloud Database (Recommended — Easiest)
1. Go to https://neon.tech
2. Sign up for free
3. Create a new project → give it any name
4. Copy the **connection string** that looks like:
   ```
   postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```
5. Save this — you'll need it in Step 4

### Option B: Local PostgreSQL
1. Download PostgreSQL: https://www.postgresql.org/download/
2. Install it (remember the password you set!)
3. Open **pgAdmin** or **psql** and create a database:
   ```sql
   CREATE DATABASE course_selling;
   ```
4. Your connection string will be:
   ```
   postgresql://postgres:YOUR_PASSWORD@localhost:5432/course_selling
   ```

---

## Step 3: Download the Project

Open your terminal and run:
```bash
git clone https://github.com/YOUR_USERNAME/course_selling.git
cd course_selling
```

---

## Step 4: Configure Environment Variables

1. Copy the example env file:
   ```bash
   copy .env.example .env
   ```
   (On Mac/Linux: `cp .env.example .env`)

2. Open `.env` in any text editor and fill in:

   ```env
   # Paste your database URL from Step 2
   DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require

   # Generate a random secret (any long random string)
   NEXTAUTH_SECRET=paste-a-random-32-character-string-here

   # Keep as is for local development
   NEXTAUTH_URL=http://localhost:3000

   # Your admin login credentials (choose any username/password)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password

   # File storage (keep as local for development)
   STORAGE_PROVIDER=local
   ```

---

## Step 5: Install Dependencies

```bash
bun install
```

This downloads all required packages. Wait for it to finish.

---

## Step 6: Set Up the Database

Push the database schema to your PostgreSQL:
```bash
bunx prisma db push
```

Generate the Prisma client:
```bash
bunx prisma generate
```

---

## Step 7: Run the Project

```bash
bun run dev
```

Open your browser and go to:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

Login with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you set in `.env`.

---

## 📋 Quick Commands Reference

| Command | What it does |
|---------|-------------|
| `bun install` | Install all dependencies |
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bunx prisma db push` | Sync database schema |
| `bunx prisma generate` | Generate Prisma client |
| `bunx prisma studio` | Open database GUI viewer |
| `node linecount.js` | Count all source code lines |

---

## 🔧 Troubleshooting

### "EPERM: operation not permitted" during Prisma generate
This is a Windows file lock issue. Just stop the dev server (`Ctrl+C`), run the command again, then restart dev.

### "Module not found" errors
Run `bun install` again, then restart the dev server.

### Database connection refused
- Make sure your DATABASE_URL is correct
- If using Neon, check your project is active at https://neon.tech
- If using local PostgreSQL, make sure the service is running

### Port 3000 already in use
Kill the existing process:
```bash
npx kill-port 3000
```
Then run `bun run dev` again.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Vanilla CSS (Brutalist Design System)
- **Auth**: Custom session-based admin auth
- **Storage**: Local / AWS S3 / Cloudflare R2
- **Package Manager**: Bun
