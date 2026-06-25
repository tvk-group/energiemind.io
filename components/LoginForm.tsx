"use client";

import { FormEvent } from "react";
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
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  const f = dict.login.form;

  return (
    <>
      <div className="notice-banner">{dict.login.notice}</div>
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
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
          {f.submit}
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
