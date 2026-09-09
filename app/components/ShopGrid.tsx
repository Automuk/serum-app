"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getProducts, type Product } from "@/app/lib/api";
import { SERUM_TYPES } from "@/app/lib/constants";
import ProductCard from "@/app/components/ProductCard";
import ProductVisual from "@/app/components/ProductVisual";
import { GridIcon, ListIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@/app/components/icons";
import Select from "@/app/components/Select";
import { Link, useRouter } from "@/i18n/navigation";
import { formatPrice } from "@/app/lib/api";

const PAGE_SIZE = 8;

export default function ShopGrid() {
  const t = useTranslations("ShopGrid");
  const tType = useTranslations("SerumTypes");
  const router = useRouter();
  const searchParams = useSearchParams();

  const SORTS = [
    { label: t("sortFeatured"), value: "-created_at" },
    { label: t("sortPriceLowHigh"), value: "price" },
    { label: t("sortPriceHighLow"), value: "-price" },
    { label: t("sortNameAz"), value: "name" },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<"grid" | "list">("grid");

  const type = searchParams.get("type") ?? "All";
  const badge = searchParams.get("badge") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "-created_at";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  useEffect(() => {
    let active = true;
    startTransition(async () => {
      try {
        const data = await getProducts({
          sort,
          search: search || undefined,
          badge: badge || undefined,
        });
        if (active) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load products");
      }
    });
    return () => {
      active = false;
    };
  }, [sort, search, badge]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const goToPage = (n: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(n));
    router.push(`/shop?${params.toString()}`);
  };

  const filtered = useMemo(
    () => (type === "All" ? products : products.filter((p) => p.serum_type === type)),
    [products, type],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          <Select
            value={type}
            onChange={(v) => setFilter("type", v === "All" ? "" : v)}
            options={[{ label: t("category"), value: "All" }, ...SERUM_TYPES.map((st) => ({ label: tType(st), value: st }))]}
            className="h-10 rounded-full border border-secondary bg-card px-4 text-sm focus:border-primary"
          />
          <Select
            value={sort}
            onChange={(v) => setFilter("sort", v)}
            options={SORTS}
            className="h-10 rounded-full border border-secondary bg-card px-4 text-sm focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground/50">
            {t("results", { count: filtered.length })}
          </span>
          <div className="flex items-center gap-1 rounded-full border border-secondary p-1">
            <button
              onClick={() => setView("grid")}
              aria-label={t("gridView")}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                view === "grid" ? "bg-primary-dark text-background" : "text-foreground/50"
              }`}
            >
              <GridIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label={t("listView")}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                view === "list" ? "bg-primary-dark text-background" : "text-foreground/50"
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-secondary/40" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {t("loadError", {
            error,
            url: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
          })}
        </div>
      )}

      {!isPending && !error && view === "grid" && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {paged.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {!isPending && !error && view === "list" && (
        <div className="flex flex-col gap-4">
          {paged.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="flex items-center gap-5 rounded-2xl border border-secondary/60 bg-card p-4 transition-shadow hover:shadow-lg"
            >
              <ProductVisual
                imageUrl={product.image_url}
                alt={product.name}
                className="h-24 w-20 shrink-0 rounded-lg"
              />
              <div className="flex-1">
                <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/40">
                  {tType(product.serum_type)}
                </span>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-foreground/50">
                  {product.key_ingredients.join(" · ")}
                </p>
              </div>
              <span className="shrink-0 text-lg font-semibold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-dark text-background"
              >
                <PlusIcon className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      )}

      {!isPending && !error && filtered.length === 0 && (
        <p className="py-16 text-center text-foreground/50">{t("noResults")}</p>
      )}

      {!isPending && !error && totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label={t("previousPage")}
            className="flex h-9 w-9 items-center justify-center text-foreground/60 transition-colors hover:text-primary-dark disabled:opacity-40"
          >
            <ChevronLeftIcon aria-hidden className="h-3.5 w-3.5" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`h-9 w-9 rounded-full text-sm transition-colors ${
                page === i + 1
                  ? "bg-primary-dark text-background"
                  : "border border-secondary text-foreground/60 hover:border-primary"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            aria-label={t("nextPage")}
            className="flex h-9 w-9 items-center justify-center text-foreground/60 transition-colors hover:text-primary-dark disabled:opacity-40"
          >
            <ChevronRightIcon aria-hidden className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
