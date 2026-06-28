import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js uses .env.local; Prisma CLI reads from here.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Supabase: use session-mode pooler (port 5432) for migrations/introspection.
    url: env("DIRECT_URL"),
  },
});
