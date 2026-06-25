"use client";

import { useState, FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n";

export default function RequestAccessForm({ dict }: { dict: Dictionary }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  if (submitted) {
    return (
      <div className="form-card form-success">
        <p>{dict.common.successMessage}</p>
      </div>
    );
  }

  const f = dict.requestAccess.form;

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullName">{f.fullName}</label>
        <input type="text" id="fullName" name="fullName" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">{f.email}</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="company">{f.company}</label>
        <input type="text" id="company" name="company" required />
      </div>
      <div className="form-group">
        <label htmlFor="phone">{f.phone}</label>
        <input type="tel" id="phone" name="phone" />
      </div>
      <div className="form-group">
        <label htmlFor="useCase">{f.useCase}</label>
        <select id="useCase" name="useCase" required>
          <option value="">{dict.common.selectOption}</option>
          <option value="operator">{f.useCases.operator}</option>
          <option value="partner">{f.useCases.partner}</option>
          <option value="developer">{f.useCases.developer}</option>
          <option value="energy">{f.useCases.energy}</option>
          <option value="other">{f.useCases.other}</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="message">{f.message}</label>
        <textarea id="message" name="message" required />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
        {loading ? dict.common.submitting : f.submit}
      </button>
      <p className="form-notice">{f.privacy}</p>
    </form>
  );
}
