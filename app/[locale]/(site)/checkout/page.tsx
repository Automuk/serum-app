"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import ProductVisual from "@/app/components/ProductVisual";
import { LeafIcon, LockIcon, ShieldIcon, ArrowRightIcon, ArrowLeftIcon } from "@/app/components/icons";
import { createOrder, formatPrice, type Order } from "@/app/lib/api";

const EMPTY = {
  email: "",
  news: true,
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Poland",
};

export default function Checkout() {
  const t = useTranslations("CheckoutPage");
  const { lines, subtotal, clear } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState(EMPTY);
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const STEPS = [t("stepCart"), t("stepShipping"), t("stepPayment")];

  const update = (key: keyof typeof EMPTY, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const goToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const created = await createOrder({
        email: form.email,
        items: lines.map((l) => ({
          product_id: l.product._id,
          quantity: l.quantity,
        })),
        shipping_address: {
          full_name: form.full_name,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2 || undefined,
          city: form.city,
          state: form.state,
          postal_code: form.postal_code,
          country: form.country,
        },
      });
      setOrder(created);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("checkoutFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return (
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-4 text-4xl">✓</div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {t("orderConfirmedTitle")}
        </h1>
        <p className="mt-2 text-foreground/60">
          {t("orderConfirmedBody", {
            orderId: order._id,
            total: formatPrice(order.total),
          })}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-background hover:bg-primary"
        >
          {t("continueShoppingCta")}
        </Link>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center text-foreground/60">
        {t("cartEmpty")}{" "}
        <Link href="/shop" className="underline">
          {t("browseSerums")}
        </Link>
      </main>
    );
  }

  const field =
    "h-11 w-full rounded-lg border border-secondary bg-card px-3 text-sm outline-none focus:border-primary";

  return (
    <main className="mx-auto w-full max-w-[1420px] flex-1 px-6 py-10">
      <div className="mb-10 flex items-center justify-center gap-3 text-sm">
        {STEPS.map((label, i) => {
          const idx = i + 1;
          const current = idx === step + 1 || (idx === 1 && step === 1);
          return (
            <div key={label} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  idx === 1 || idx <= step
                    ? "bg-primary-dark text-background"
                    : current
                      ? "border border-primary-dark text-primary-dark"
                      : "border border-secondary text-foreground/40"
                }`}
              >
                {idx}
              </span>
              <span
                className={
                  idx === 1 || idx <= step ? "text-foreground" : "text-foreground/40"
                }
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px w-8 bg-secondary" />}
            </div>
          );
        })}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {step === 1 ? (
          <form onSubmit={goToPayment} className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading mb-3 text-lg font-semibold text-foreground">
                {t("contactInformation")}
              </h2>
              <input
                required
                type="email"
                placeholder={t("emailPlaceholder")}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={field}
              />
              <label className="mt-3 flex items-center gap-2 text-sm text-foreground/60">
                <input
                  type="checkbox"
                  checked={form.news}
                  onChange={(e) => update("news", e.target.checked)}
                  className="accent-[color:var(--sage-green)]"
                />
                {t("newsOptIn")}
              </label>
            </div>

            <div>
              <h2 className="font-heading mb-3 text-lg font-semibold text-foreground">
                {t("shippingAddress")}
              </h2>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder={t("fullNamePlaceholder")}
                    value={form.full_name}
                    onChange={(e) => update("full_name", e.target.value)}
                    className={field}
                  />
                  <input
                    placeholder={t("phonePlaceholder")}
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={field}
                  />
                </div>
                <input
                  required
                  placeholder={t("line1Placeholder")}
                  value={form.line1}
                  onChange={(e) => update("line1", e.target.value)}
                  className={field}
                />
                <input
                  placeholder={t("line2Placeholder")}
                  value={form.line2}
                  onChange={(e) => update("line2", e.target.value)}
                  className={field}
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    required
                    placeholder={t("cityPlaceholder")}
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={field}
                  />
                  <input
                    required
                    placeholder={t("statePlaceholder")}
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className={field}
                  />
                  <input
                    required
                    placeholder={t("postalCodePlaceholder")}
                    value={form.postal_code}
                    onChange={(e) => update("postal_code", e.target.value)}
                    className={field}
                  />
                </div>
                <input
                  required
                  placeholder={t("countryPlaceholder")}
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className={field}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-primary-dark py-3 text-sm font-semibold text-background transition-colors hover:bg-primary"
            >
              {t("continueToPayment")} <ArrowRightIcon aria-hidden className="h-3.5 w-3.5" />
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading mb-3 text-lg font-semibold text-foreground">
                {t("paymentMethod")}
              </h2>
              <div className="flex flex-col gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm ${
                    payment === "cod" ? "border-primary-dark bg-secondary/20" : "border-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                    className="accent-[color:var(--deep-forest)]"
                  />
                  {t("cashOnDelivery")}
                </label>
                <label className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-secondary p-4 text-sm text-foreground/40">
                  <input type="radio" disabled />
                  {t("payOnline")}
                </label>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 rounded-full border border-secondary px-6 py-3 text-sm font-semibold text-foreground/70 hover:border-primary"
              >
                <ArrowLeftIcon aria-hidden className="h-3.5 w-3.5" /> {t("back")}
              </button>
              <button
                onClick={placeOrder}
                disabled={submitting}
                className="flex-1 rounded-full bg-primary-dark py-3 text-sm font-semibold text-background transition-colors hover:bg-primary disabled:opacity-50"
              >
                {submitting ? t("placingOrder") : t("placeOrder", { price: formatPrice(subtotal) })}
              </button>
            </div>
          </div>
        )}

        <aside className="h-fit rounded-2xl border border-secondary/60 bg-secondary/20 p-6 lg:sticky lg:top-24">
          <h2 className="font-heading mb-4 text-lg font-semibold text-foreground">
            {t("orderSummary")}
          </h2>
          <ul className="flex flex-col gap-4">
            {lines.map((l) => (
              <li key={l.product._id} className="flex items-center gap-3">
                <ProductVisual
                  imageUrl={l.product.image_url}
                  alt={l.product.name}
                  className="h-12 w-10 shrink-0 rounded-md"
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-foreground">{l.product.name}</p>
                  <p className="text-xs text-foreground/50">
                    {l.product.size} × {l.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(l.product.price * l.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-secondary pt-4 text-sm">
            <div className="flex justify-between text-foreground/60">
              <span>{t("subtotal", { count: lines.length })}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>{t("shipping")}</span>
              <span className="text-primary-dark">{t("free")}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-foreground">
              <span>{t("total")}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-secondary pt-4 text-xs text-foreground/60">
            <span className="flex items-center gap-2">
              <LeafIcon className="h-4 w-4 text-primary-dark" /> {t("trustClean")}
            </span>
            <span className="flex items-center gap-2">
              <LockIcon className="h-4 w-4 text-primary-dark" /> {t("trustSecure")}
            </span>
            <span className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-primary-dark" /> {t("trustReturns")}
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}

