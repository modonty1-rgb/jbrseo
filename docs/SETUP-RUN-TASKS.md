# Setup and run — clean task list

Run these in order from the project root. Use **pnpm** for all commands.

---

## 1. Install dependencies

```bash
pnpm install
```

---

## 2. Environment

- Ensure `.env` has:
  - `DATABASE_URL` — MongoDB connection string (already set)
  - `ADMIN_PASSWORD` — strong password for admin login (add if missing)
- Copy from `.env.example` if needed (no real secrets in example).

---

## 3. Database (Prisma)

**Option A — one command:**

```bash
pnpm db:setup
```

**Option B — step by step:**

```bash
pnpm exec prisma generate
pnpm db:push
pnpm db:seed
```

- **generate** — generates Prisma client from `prisma/schema.prisma`
- **db:push** — syncs schema to MongoDB (no migrations)
- **db:seed** — fills DB with current content for **SA** and **EG** from `app/content/landing.ts`, `landing-images.ts`, and `app/components/texts.ts`

---

## 4. Dev server

```bash
pnpm dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (login with `ADMIN_PASSWORD`)
- Content is chosen by geo header (Vercel/Cloudflare) or defaults to **SA**

---

## 5. Build (optional)

```bash
pnpm build
pnpm start
```

---

## Quick one-liner (after `.env` is set)

```bash
pnpm install && pnpm db:setup && pnpm dev
```

---

## Task checklist

| # | Task                    | Command / check                          |
|---|-------------------------|------------------------------------------|
| 1 | Install deps            | `pnpm install`                           |
| 2 | Set ADMIN_PASSWORD in .env | (manual)                             |
| 3 | DB: generate + push + seed | `pnpm db:setup`                     |
| 4 | Run dev server          | `pnpm dev`                               |
| 5 | (Optional) Production build | `pnpm build && pnpm start`        |
