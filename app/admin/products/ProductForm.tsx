"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SERUM_TYPES } from "@/app/lib/constants";
import { createProduct, updateProduct, type Product, type ProductInput } from "@/app/lib/api";
import Select from "@/app/components/Select";

const EMPTY: ProductInput = {
  name: "",
  serum_type: SERUM_TYPES[0],
  key_ingredients: [],
  size: "",
  price: 0,
  badge: "",
  description: "",
  image_url: "",
  stock: 0,
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(
    product
      ? {
          name: product.name,
          serum_type: product.serum_type,
          key_ingredients: product.key_ingredients,
          size: product.size,
          price: product.price,
          badge: product.badge ?? "",
          description: product.description ?? "",
          image_url: product.image_url ?? "",
          stock: product.stock,
        }
      : EMPTY,
  );
  const [ingredientsText, setIngredientsText] = useState(form.key_ingredients.join(", "));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload: ProductInput = {
      ...form,
      key_ingredients: ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      badge: form.badge || null,
      description: form.description || null,
      image_url: form.image_url || null,
    };
    try {
      if (product) {
        await updateProduct(product._id, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "h-11 w-full rounded-lg border border-secondary bg-card px-3 text-sm outline-none focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={field}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Serum type
        <Select
          value={form.serum_type}
          onChange={(v) => update("serum_type", v)}
          options={SERUM_TYPES.map((t) => ({ label: t, value: t }))}
          className="h-11 w-full rounded-lg border border-secondary bg-card px-3 text-sm focus:border-primary"
          containerClassName="block w-full"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Key ingredients (comma separated)
        <input
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          className={field}
          placeholder="Vitamin C, Niacinamide"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Size
          <input
            required
            value={form.size}
            onChange={(e) => update("size", e.target.value)}
            className={field}
            placeholder="30 ml"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Price (PLN)
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
            className={field}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Stock
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Badge (optional)
          <input
            value={form.badge ?? ""}
            onChange={(e) => update("badge", e.target.value)}
            className={field}
            placeholder="Bestseller"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Image URL (optional)
        <input
          value={form.image_url ?? ""}
          onChange={(e) => update("image_url", e.target.value)}
          className={field}
          placeholder="https://…"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          value={form.description ?? ""}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className="rounded-lg border border-secondary bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-2 flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary disabled:opacity-50"
        >
          {submitting ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}
