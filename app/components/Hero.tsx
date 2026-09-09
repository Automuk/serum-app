import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@/app/components/icons";

export default function Hero() {
  const t = useTranslations("Hero");
  return (
    <section
      className="flex min-h-[calc(100dvh-4.5rem-1px)] items-end border-b border-secondary/60 bg-cover pb-16 [background-position:75%_center] sm:items-center sm:pb-0 sm:[background-position:center]"
      style={{ backgroundImage: "url('https://cdn.animhaus.com/serum/serum_hero.png')" }}
    >
      <div className="mx-auto w-full max-w-[1420px] px-6">
        <div className="max-w-lg pl-6 2xl:pl-0">
          <h1 className="font-heading mt-4 text-4xl font-medium leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-8xl sm:text-foreground sm:drop-shadow-none">
            {t("titleStart")}{" "}
            <em className="italic text-primary-dark sm:text-[var(--sage-green)]">{t("titleEmphasis")}</em>
          </h1>
          <p className="mt-5 max-w-md text-sm sm:text-lg text-white/90 drop-shadow-sm sm:text-foreground/70 sm:drop-shadow-none">
            {t("subtitle")}
          </p>
          <Link
            href="/shop"
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-primary-dark px-7 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary"
          >
            {t("cta")} <ArrowRightIcon aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}