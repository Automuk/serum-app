import { Suspense } from "react";
import ShopGrid from "@/app/components/ShopGrid";

export default function ShopPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div
        className="flex h-64 items-center border-b border-secondary/60 bg-cover bg-center sm:h-120"
        style={{ backgroundImage: "url('https://cdn.animhaus.com/serum/shop_banner.png')" }}
      >
        <div className="mx-auto w-full max-w-[1420px] px-6">
          <div className="max-w-lg pl-6 xl:pl-0">
            <span className="text-xs text-foreground/50">Home / Shop</span>
            <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-foreground">
              Shop All Serums
            </h1>
            <p className="mt-3 max-w-lg text-foreground/60">
              Clean, effective formulas made with intentional ingredients to
              support your skin&apos;s natural glow.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1420px] px-6 py-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-secondary/40" />
              ))}
            </div>
          }
        >
          <ShopGrid />
        </Suspense>
      </div>
    </main>
  );
}
