"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getPagePath } from "@/lib/routes";

export default function LoginForm({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
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

    const redirect = searchParams.get("redirect") || "/panel/";
    router.push(redirect);
    router.refresh();
  }

  const f = dict.login.form;

  return (
    <>
      <div className="notice-banner">{dict.login.notice}</div>
      {error && <div className="form-error">{error}</div>}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{f.email}</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">{f.password}</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" id="remember" name="remember" />
          <label htmlFor="remember" style={{ margin: 0 }}>{f.remember}</label>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? dict.common.submitting : f.submit}
        </button>
        <p className="form-notice" style={{ textAlign: "center", marginTop: 16 }}>
          {f.noAccount}{" "}
          <Link href={getPagePath(locale, "request-access")}>
            {f.requestAccess}
          </Link>
        </p>
      </form>
    </>
  );
}
