"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import ProductVisual from "@/app/components/ProductVisual";
import { CloseIcon, LeafIcon, LockIcon, ShieldIcon, ArrowLeftIcon } from "@/app/components/icons";
import { formatPrice } from "@/app/lib/api";

const TRUST_ITEMS = [
  { icon: LeafIcon, title: "Clean & Conscious", subtitle: "Thoughtfully made" },
  { icon: ShieldIcon, title: "Dermatologist Tested", subtitle: "Safe for your skin" },
  { icon: LockIcon, title: "Secure Checkout", subtitle: "Your data is protected" },
];

export default function CartPage() {
  const { lines, subtotal, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <main className="mx-auto flex max-w-[1420px] flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Your Cart
        </h1>
        <p className="mt-3 text-foreground/60">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-background hover:bg-primary"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1420px] flex-1 px-6 py-12">
      <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Your Cart
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Review your items and proceed to checkout.
          </p>
        </div>
        <Link href="/shop" className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-primary-dark">
          <ArrowLeftIcon aria-hidden className="h-3 w-3" /> Continue Shopping
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          {lines.map((line) => (
            <div
              key={line.product._id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-secondary/60 bg-card p-4 sm:flex-nowrap"
            >
              <ProductVisual
                imageUrl={line.product.image_url}
                alt={line.product.name}
                className="h-20 w-16 shrink-0 rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${line.product._id}`}
                  className="font-heading text-sm font-medium text-foreground hover:underline"
                >
                  {line.product.name}
                </Link>
                <p className="text-xs text-foreground/50">
                  {line.product.size} · {line.product.serum_type}
                </p>
              </div>
              <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-normal">
                <div className="flex items-center rounded-full border border-secondary">
                  <button
                    onClick={() => setQty(line.product._id, line.quantity - 1)}
                    className="px-3 py-1.5 text-sm text-foreground/60 hover:text-foreground"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{line.quantity}</span>
                  <button
                    onClick={() => setQty(line.product._id, line.quantity + 1)}
                    className="px-3 py-1.5 text-sm text-foreground/60 hover:text-foreground"
                  >
                    +
                  </button>
                </div>
                <span className="shrink-0 text-right text-sm font-semibold text-foreground sm:w-20">
                  {formatPrice(line.product.price * line.quantity)}
                </span>
                <button
                  onClick={() => remove(line.product._id)}
                  aria-label={`Remove ${line.product.name}`}
                  className="shrink-0 text-foreground/40 hover:text-highlight"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-center gap-3 text-sm">
                <Icon className="h-6 w-6 shrink-0 text-primary-dark" />
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-xs text-foreground/50">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-secondary/60 bg-secondary/20 p-6">
          <h2 className="font-heading mb-4 text-lg font-semibold text-foreground">
            Order Summary
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">
                Subtotal ({lines.reduce((n, l) => n + l.quantity, 0)} items)
              </span>
              <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Shipping</span>
              <span className="font-medium text-primary-dark">Free</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-secondary pt-4 text-base font-semibold text-foreground">
            <span>Estimated Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex gap-2">
            <input
              placeholder="Enter promo code"
              className="h-10 w-full rounded-lg border border-secondary bg-card px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-primary-dark px-4 text-sm font-semibold text-background hover:bg-primary"
            >
              Apply
            </button>
          </form>

          <Link
            href="/checkout"
            className="mt-5 block w-full rounded-full bg-primary-dark py-3 text-center text-sm font-semibold text-background transition-colors hover:bg-primary"
          >
            Checkout · {formatPrice(subtotal)}
          </Link>
        </aside>
      </div>
    </main>
  );
}
