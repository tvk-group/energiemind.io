"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import { getPagePath } from "@/lib/routes";

interface LanguageSwitcherProps {
  locale: Locale;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const currentSlug = pathname
    ? pathname.replace(`/${locale}`, "").replace(/^\/|\/$/g, "")
    : "";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="lang-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>🌐</span>
        <span>{localeNames[locale]}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      <div className={`lang-dropdown ${open ? "open" : ""}`} role="listbox">
        {locales.map((loc) => (
          <Link
            key={loc}
            href={getPagePath(loc, currentSlug)}
            className={`lang-option ${loc === locale ? "active" : ""}`}
            role="option"
            aria-selected={loc === locale}
            onClick={() => setOpen(false)}
          >
            {localeNames[loc]}
          </Link>
        ))}
      </div>
    </div>
  );
}
