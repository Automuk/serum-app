"use client";

import { useEffect, useState } from "react";
import { getProducts, type Product } from "@/app/lib/api";
import ProductCard from "@/app/components/ProductCard";

export default function RelatedProducts({
  serumType,
  excludeId,
}: {
  serumType: string;
  excludeId: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    getProducts({ serum_type: serumType })
      .then((data) => {
        if (active) setProducts(data.filter((p) => p._id !== excludeId).slice(0, 4));
      })
      .catch(() => {
        // silently skip related products if the request fails
      });
    return () => {
      active = false;
    };
  }, [serumType, excludeId]);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1420px] px-6 py-16">
      <h2 className="font-heading mb-8 text-center text-2xl font-semibold tracking-tight text-foreground">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
