# Prisma Database Setup — Collaborative Workflow

This guide explains how to set up your local database and stay in sync with your teammates when schema changes are pushed.

---

## Database Connection

Copy `.env.example` to `.env` and update with your local MySQL credentials:

```bash
copy .env.example .env
```

Then edit `.env`:

```
DATABASE_URL="mysql://root:password@localhost:3306/skillsproject"
```

> **Important:** The `.env` file is in `.gitignore` so it will never be committed. Each developer has their own local `.env`.

---

## First-Time Setup (when you clone the project)

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Apply all migrations to your local database

```bash
npx prisma migrate dev
```

This will replay all migration files in `prisma/migrations/` against your local MySQL database, creating all tables.

### 4. Seed the database with sample data

```bash
npm run db:seed
```

### 5. (Optional) Open Prisma Studio to view data

```bash
npm run db:studio
```

---

## Daily Workflow — Staying in Sync

### Pulling latest changes from teammates

When a teammate pushes schema changes:

```bash
git pull origin main          # get latest code + new migration files
npm install                   # update dependencies if package.json changed
npx prisma generate           # regenerate Prisma client
npx prisma migrate dev        # apply any new migrations to your local DB
npm run db:seed               # re-seed if seed data changed
```

### Making and pushing your own schema changes

1. Edit `prisma/schema.prisma`
2. Create a migration:

```bash
npx prisma migrate dev --name describe_your_change
```

3. Update the seed file (`prisma/seed.ts`) if needed
4. Test locally:

```bash
npm run db:seed
npm run db:generate
```

5. Commit everything:

```bash
git add prisma/schema.prisma prisma/seed.ts prisma/migrations/
git commit -m "feat: add new table / update schema"
git push
```

Your teammates can now run steps from **"Pulling latest changes"** to sync.

---

## Resetting Your Local Database

If things get messed up:

```bash
npm run db:reset
```

This drops all tables, re-applies all migrations, and runs the seed script.

---

## Available Commands

| Command | Description |
|---|---|
| `npm run prisma:generate` | Generate Prisma Client from schema |
| `npm run prisma:migrate` | Create a new migration |
| `npm run db:push` | Push schema directly (no migration file, use for prototyping) |
| `npm run db:seed` | Run the seed script |
| `npm run db:reset` | Drop DB, re-apply migrations, and seed |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:generate` | Alias for `prisma generate` |

---

## Troubleshooting

### "Cannot find module 'tsx'"
Run `npm install` to install dependencies.

### Migration failed — "already exists"
Run `npx prisma migrate dev` to reconcile.

### Seed fails with "SyntaxError: Cannot use import statement"
The seed script now uses `tsx` (ESM-compatible runner). Ensure you have run `npm install`.

### Access denied for MySQL user
Check your `.env` `DATABASE_URL` — correct username, password, and host.

---

## Important Notes

- ✅ Migration files live in version control (`prisma/migrations/`) and are shared with the team.
- ✅ Prisma Client is generated locally — it's in `.gitignore` and never committed.
- ✅ Each developer has their own `.env` — database credentials stay private.
- ✅ Always run `npx prisma migrate dev` after pulling new migrations from teammates.

