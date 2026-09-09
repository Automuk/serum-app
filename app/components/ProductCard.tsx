"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/app/context/CartContext";
import ProductVisual from "@/app/components/ProductVisual";
import { PlusIcon } from "@/app/components/icons";
import { formatPrice, type Product } from "@/app/lib/api";
import { Link } from "@/i18n/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("ProductCard");
  const { lines, add, setQty, remove } = useCart();

  const cartQty = lines.find((l) => l.product._id === product._id)?.quantity ?? 0;

  const increment = () =>
    cartQty === 0 ? add(product, 1) : setQty(product._id, cartQty + 1);

  const decrement = () => {
    if (cartQty <= 1) remove(product._id);
    else setQty(product._id, cartQty - 1);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-secondary/60 bg-card transition-shadow hover:shadow-lg">
      <Link href={`/products/${product._id}`} className="relative block">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-highlight px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-dark shadow-sm">
            {product.badge}
          </span>
        )}
        <ProductVisual
          imageUrl={product.image_url}
          alt={product.name}
          className="aspect-[4/5] w-full"
        />
      </Link>

      <div className="relative flex flex-1 flex-col p-5">
        <button
          onClick={increment}
          aria-label={t("addToCart", { name: product.name })}
          className="absolute -top-6 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary-dark text-background shadow-md transition-colors hover:bg-primary"
        >
          <PlusIcon className="h-4.5 w-4.5" />
        </button>

        <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/40">
          {product.serum_type}
        </span>
        <Link
          href={`/products/${product._id}`}
          className="font-heading mt-1 text-base font-semibold text-foreground hover:underline"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-xs text-foreground/50">
          {product.key_ingredients.join(" · ")}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {cartQty > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-secondary">
              <button
                onClick={decrement}
                className="px-2.5 py-1 text-foreground/60 hover:text-foreground"
              >
                −
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-semibold text-foreground">
                {cartQty}
              </span>
              <button
                onClick={increment}
                disabled={cartQty >= product.stock}
                className="px-2.5 py-1 text-foreground/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
