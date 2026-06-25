# Supabase Setup for EnergieMIND

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **anon key** from Settings → API

## 2. Run the Database Migration

Open the SQL Editor in your Supabase dashboard and run:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, RLS policies, triggers, and seed demo data (sites, miners, metrics, alerts).

## 3. Configure Environment Variables

Copy from the Supabase dashboard **Connect** dialog into `.env.local` and Vercel:

```bash
# @supabase/server SDK (server-side)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json

# Browser clients
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_APP_URL=https://energiemind.io

# Direct Postgres (migrations, Supabase CLI, SQL tools)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
```

### Direct database connection

For this project (`ahlfixcfgibmtpppxtgg`):

| Setting  | Value |
|----------|-------|
| Host     | `db.ahlfixcfgibmtpppxtgg.supabase.co` |
| Port     | `5432` |
| Database | `postgres` |
| User     | `postgres` |

Connection string (replace `[YOUR-PASSWORD]` with your database password from **Project Settings → Database**):

```
postgresql://postgres:[YOUR-PASSWORD]@db.ahlfixcfgibmtpppxtgg.supabase.co:5432/postgres
```

The Next.js app uses the Supabase REST client (`@supabase/ssr`) for runtime queries — `DATABASE_URL` is only needed for local migrations, the Supabase CLI, or direct SQL tooling.

## 3b. API routes with `withSupabase`

Route handlers use `@/lib/supabase/with-supabase` — a Next.js adapter that composes `@supabase/ssr` (cookies) with `@supabase/server/core` (JWT verify + RLS clients):

```ts
import { withSupabase } from "@/lib/supabase/with-supabase";

export const GET = withSupabase({ auth: "user" }, async (_req, ctx) => {
  const { data } = await ctx.supabase.from("sites").select();
  return Response.json({ sites: data });
});
```

Auth modes: `"user"`, `"publishable"`, `"secret"`, `"none"`.

## 4. Configure Auth

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL:** `https://energiemind.io`
- **Redirect URLs:** `https://energiemind.io/api/auth/callback/`

Enable Email provider under Authentication → Providers.

## 5. Create Admin User

1. Sign up via `/en/login/` or create user in Supabase Auth dashboard
2. In SQL Editor, promote to admin:

```sql
UPDATE public.profiles
SET role = 'admin', is_active = true
WHERE email = 'your@email.com';
```

## 6. Platform Routes

| Route | Description |
|-------|-------------|
| `/panel/` | Operations dashboard (authenticated) |
| `/panel/miners/` | Miner fleet monitoring |
| `/panel/energy/` | Energy analytics |
| `/panel/heat/` | Heat recovery metrics |
| `/panel/alerts/` | Alert management |
| `/admin/` | Admin console (admin role only) |
| `/api/v1/metrics` | REST API — energy metrics |
| `/api/v1/sites` | REST API — sites list |
| `/api/v1/alerts` | REST API — alerts |

## Database Schema

- `profiles` — user accounts (extends auth.users)
- `access_requests` — platform access applications
- `sites` — infrastructure facilities
- `miners` — ASIC miner fleet
- `energy_metrics` — power/consumption time-series
- `heat_metrics` — thermal recovery time-series
- `alerts` — system alerts
- `api_keys` — developer API credentials
