"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function AppLoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="app-login-card">
      <h1>Sign in</h1>
      <p>Access your EnergieMIND operations dashboard.</p>
      {error && <div className="form-error">{error}</div>}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required autoComplete="email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="form-notice" style={{ textAlign: "center", marginTop: 16 }}>
          No account?{" "}
          <Link href="https://energiemind.io/en/request-access/">Request access</Link>
        </p>
      </form>
    </div>
  );
}

export default function AppLoginPage() {
  return (
    <main className="app-login-wrap">
      <Suspense fallback={<div className="app-login-card">Loading...</div>}>
        <AppLoginFormInner />
      </Suspense>
    </main>
  );
}
