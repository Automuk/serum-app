import Link from "next/link";
import { getProducts } from "@/app/lib/api";
import ProductCard from "@/app/components/ProductCard";
import { ArrowRightIcon } from "@/app/components/icons";

export default async function FeaturedProducts() {
  const products = await getProducts({ sort: "-created_at" }).catch(() => []);
  const featured = products.slice(0, 12);

  return (
    <section className="mx-auto w-full max-w-[1420px] px-6 py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Featured Products
          </h2>
          <p className="mt-2 text-foreground/60">
            Targeted serums formulated for visible results.
          </p>
        </div>
        <Link
          href="/shop"
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary-dark hover:underline sm:flex"
        >
          View all <ArrowRightIcon aria-hidden className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <Link
        href="/shop"
        className="mt-8 flex items-center justify-center gap-1 text-sm font-semibold text-primary-dark hover:underline sm:hidden"
      >
        View all <ArrowRightIcon aria-hidden className="h-3 w-3" />
      </Link>
    </section>
  );
}
