"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FaInstagram, FaTiktok, FaPinterest, FaEnvelope } from "react-icons/fa";
import { SERUM_TYPES } from "@/app/lib/constants";
import { ArrowRightIcon } from "@/app/components/icons";

const socialLinks = [
  { label: "Instagram", icon: FaInstagram },
  { label: "TikTok", icon: FaTiktok },
  { label: "Pinterest", icon: FaPinterest },
  { label: "Email", icon: FaEnvelope },
];

export default function Footer() {
  const t = useTranslations("Footer");
  const tType = useTranslations("SerumTypes");

  const shopLinks = [
    { label: t("allProducts"), href: "/shop" },
    { label: t("bestSellers"), href: "/shop?badge=Bestseller" },
    { label: t("newArrivals"), href: "/shop?badge=New" },
    { label: t("trending"), href: "/shop?badge=Trending" },
  ];

  const aboutLinks = [
    t("ourStory"),
    t("ingredients"),
    t("sustainability"),
    t("press"),
    t("careers"),
  ];

  return (
    <footer className="border-t border-secondary/60 bg-secondary/20">
      <div className="mx-auto grid max-w-[1420px] gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <span className="font-heading text-2xl font-semibold tracking-tight text-primary-dark">
            LUMERA
          </span>
          <p className="mt-3 max-w-[22ch] text-sm text-foreground/60">
            {t("tagline")}
          </p>
          <div className="mt-5 flex gap-3 text-foreground/50">
            {socialLinks.map(({ label, icon: Icon }) => (
              <span
                key={label}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">{t("shop")}</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-foreground/60">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-primary-dark">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">{t("skincare")}</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-foreground/60">
            {SERUM_TYPES.slice(0, 5).map((type) => (
              <li key={type}>
                <Link
                  href={`/shop?type=${encodeURIComponent(type)}`}
                  className="transition-colors hover:text-primary-dark"
                >
                  {tType(type)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">{t("about")}</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-foreground/60">
            {aboutLinks.map((label) => (
              <li key={label}>
                <span className="cursor-default">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">
            {t("newsletterTitle")}
          </h3>
          <p className="mt-4 text-sm text-foreground/60">
            {t("newsletterBody")}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-3 flex overflow-hidden rounded-full border border-secondary bg-card"
          >
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="h-11 w-full bg-transparent px-4 text-sm outline-none placeholder:text-foreground/40"
            />
            <button
              type="submit"
              aria-label={t("subscribe")}
              className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary-dark text-background"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-secondary/60">
        <div className="mx-auto flex max-w-[1420px] flex-col gap-2 px-6 py-6 text-xs text-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <span>{t("copyright")}</span>
          <div className="flex gap-4">
            <span className="cursor-default">{t("privacyPolicy")}</span>
            <span className="cursor-default">{t("termsOfService")}</span>
            <span className="cursor-default">{t("shippingReturns")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
