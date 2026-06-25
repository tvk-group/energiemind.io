# energiemind.io

Energy intelligence platform and future dashboard for TVK Infrastructure & Energy Systems.

## Platform

EnergieMIND is the technology platform for:

- Energy Dashboard
- Miner Monitoring
- Energy Analytics
- Heat Recovery Metrics
- AI Optimization
- API / Developers

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Supabase (Auth, PostgreSQL, RLS)
- 25 fully localized languages (no Google Translate)

## Platform Application

| Route | Description |
|-------|-------------|
| `/panel/` | Operations dashboard (authenticated) |
| `/panel/miners/` | ASIC fleet monitoring |
| `/panel/energy/` | Energy analytics |
| `/panel/heat/` | Heat recovery metrics |
| `/panel/alerts/` | Alert management |
| `/admin/` | Admin console (admin role) |
| `/api/v1/*` | REST API endpoints |

See [supabase/README.md](supabase/README.md) for database setup.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial_schema.sql` in SQL Editor
3. Copy `.env.example` → `.env.local` and add your keys
4. Add env vars to Vercel
5. Create admin user and run: `UPDATE profiles SET role = 'admin', is_active = true WHERE email = 'you@email.com';`

## Languages

`en` `tr` `de` `fr` `es` `it` `pt` `nl` `ar` `ru` `zh-cn` `zh-tw` `ja` `ko` `hi` `ur` `pl` `ro` `el` `sv` `no` `da` `fi` `he` `id`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Static output is generated in `out/`. Language-specific sitemaps are in `out/sitemaps/`.

## SEO

- Unique title, meta description, Open Graph, and Twitter cards per page per language
- hreflang and canonical tags on every page
- JSON-LD: Organization, WebSite, Breadcrumb, Article, FAQ schemas
- Sitemap index + per-language sitemaps
- robots.txt targeting Google, Bing, Yandex, and Baidu

## License

MIT — TVK Group / TVK Labs & Technologies LTD
