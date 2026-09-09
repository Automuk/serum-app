"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { GlobeIcon } from "@/app/components/icons";

const LABELS: Record<string, string> = { pl: "PL", en: "EN" };

export default function LocaleSwitcher() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const switchTo = (loc: string) => {
    router.replace(
      { pathname, query: Object.fromEntries(searchParams.entries()) },
      { locale: loc },
    );
    setOpen(false);
  };

  return (
    <>
      {/* mobile: compact globe icon with dropdown */}
      <div ref={menuRef} className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={t("language")}
          aria-expanded={open}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary/40"
        >
          <GlobeIcon className="h-5 w-5" />
        </button>
        {open && (
          <div
            role="group"
            aria-label={t("language")}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 flex flex-col overflow-hidden rounded-xl border border-secondary/60 bg-card p-1 text-sm font-semibold shadow-lg"
          >
            {routing.locales.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => switchTo(loc)}
                aria-pressed={locale === loc}
                className={`rounded-lg px-3 py-1.5 text-left transition-colors ${
                  locale === loc
                    ? "bg-primary-dark text-background"
                    : "text-foreground/60 hover:bg-secondary/40"
                }`}
              >
                {LABELS[loc]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* desktop: full tab switcher */}
      <div
        role="group"
        aria-label={t("language")}
        className="hidden items-center gap-0.5 rounded-full border border-secondary/60 p-0.5 text-xs font-semibold sm:flex"
      >
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-pressed={locale === loc}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              locale === loc
                ? "bg-primary-dark text-background"
                : "text-foreground/60 hover:bg-secondary/40"
            }`}
          >
            {LABELS[loc]}
          </button>
        ))}
      </div>
    </>
  );
}
