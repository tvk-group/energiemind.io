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

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://energiemind.io
```

For Vercel, add these in Project Settings → Environment Variables.

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
