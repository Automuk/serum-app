"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getProduct, formatPrice, type Product } from "@/app/lib/api";
import { useCart } from "@/app/context/CartContext";
import ProductVisual from "@/app/components/ProductVisual";
import RelatedProducts from "@/app/components/RelatedProducts";
import { HeartIcon, LeafIcon, ShieldIcon } from "@/app/components/icons";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("ProductDetail");
  const tType = useTranslations("SerumTypes");
  const { id } = use(params);
  const { lines, add, setQty, remove } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getProduct(id)
      .then((data) => active && setProduct(data))
      .catch((err) => active && setError(err.message ?? t("notFound")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1420px] px-6 py-24">
        <div className="h-96 animate-pulse rounded-2xl bg-secondary/40" />
      </div>
    );
  }

  if (error === "Product not found") notFound();

  if (error || !product) {
    return (
      <div className="mx-auto max-w-[1420px] px-6 py-24 text-center text-foreground/60">
        {error ?? t("notFound")}{" "}
        <Link href="/shop" className="underline">
          {t("backToShop")}
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    add(product, 1);
  };

  const cartQty = lines.find((l) => l.product._id === product._id)?.quantity ?? 0;

  const decrement = () => {
    if (cartQty <= 1) remove(product._id);
    else setQty(product._id, cartQty - 1);
  };

  const increment = () => setQty(product._id, cartQty + 1);

  return (
    <div>
      <div className="mx-auto max-w-[1420px] px-6 pt-8 text-xs text-foreground/50">
        <Link href="/" className="hover:text-primary-dark">
          {t("home")}
        </Link>{" "}
        /{" "}
        <Link href="/shop" className="hover:text-primary-dark">
          {t("shop")}
        </Link>{" "}
        / <span className="text-foreground/70">{product.name}</span>
      </div>

      <div className="mx-auto max-w-[1420px] px-6 py-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative">
            {product.badge && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-highlight px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-dark shadow-sm">
                {product.badge}
              </span>
            )}
            <ProductVisual
              imageUrl={product.image_url}
              alt={product.name}
              className="aspect-square w-full rounded-3xl"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase tracking-wide text-foreground/40">
              {tType(product.serum_type)}
            </span>
            <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-foreground">
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <p className="mt-6 leading-7 text-foreground/70">{product.description}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground/70">
              <span className="flex items-center gap-2">
                <LeafIcon className="h-5 w-5 text-primary-dark" /> {t("cleanIngredients")}
              </span>
              <span className="flex items-center gap-2">
                <HeartIcon className="h-5 w-5 text-primary-dark" /> {t("crueltyFree")}
              </span>
              <span className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5 text-primary-dark" /> {t("dermatologistTested")}
              </span>
            </div>

            <div className="mt-6">
              <h3 className="font-heading text-sm font-semibold text-foreground">{t("size")}</h3>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full border border-primary-dark px-4 py-1.5 text-sm text-foreground">
                  {product.size}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-6 text-sm text-foreground/50">
              <span>
                {product.stock > 0 ? t("inStock", { count: product.stock }) : t("outOfStock")}
              </span>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {cartQty > 0 ? (
                <div className="flex flex-1 items-center justify-between rounded-full border border-secondary">
                  <button
                    onClick={decrement}
                    className="px-5 py-3 text-foreground/60 hover:text-foreground"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-foreground">{cartQty}</span>
                  <button
                    onClick={increment}
                    disabled={cartQty >= product.stock}
                    className="px-5 py-3 text-foreground/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-dark py-3 text-sm font-semibold text-background transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("addToCart", { price: formatPrice(product.price) })}
                </button>
              )}
            </div>

            <div className="mt-10 flex flex-col gap-8">
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {t("ingredients")}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.key_ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-secondary px-3 py-1 text-xs text-foreground/70"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {t("howToUse")}
                </h3>
                <p className="mt-3 leading-7 text-foreground/70">
                  {t("howToUseBody")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts serumType={product.serum_type} excludeId={product._id} />
    </div>
  );
}
