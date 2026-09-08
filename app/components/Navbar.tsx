"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { SERUM_TYPES } from "@/app/lib/constants";
import { getProducts, formatPrice, type Product } from "@/app/lib/api";
import ProductVisual from "@/app/components/ProductVisual";
import {
  ArrowRightIcon,
  CartIcon,
  ChevronDownIcon,
  CloseIcon,
  LeafIcon,
  SearchIcon,
} from "@/app/components/icons";

export default function Navbar() {
  const { count } = useCart();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const goToProduct = (id: string) => {
    router.push(`/products/${id}`);
    setSearchOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const term = query.trim();
    let active = true;
    const timeout = setTimeout(() => {
      if (!term) {
        if (active) setSuggestions([]);
        return;
      }
      getProducts({ search: term })
        .then((data) => active && setSuggestions(data.slice(0, 6)))
        .catch(() => active && setSuggestions([]));
    }, 250);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    if (!searchOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-secondary/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1420px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-semibold tracking-tight text-primary-dark">
            LUMERA
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/70 sm:flex">
          <Link href="/shop" className="transition-colors hover:text-primary-dark">
            Shop
          </Link>
          <div className="group relative">
            <button className="flex items-center gap-1.5 transition-colors hover:text-primary-dark">
              Skincare
              <ChevronDownIcon className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-secondary/60 bg-card shadow-xl pt-2">
                <div className="grid grid-cols-2 gap-0.5 px-2 pb-2">
                  {SERUM_TYPES.map((type) => (
                    <Link
                      key={type}
                      href={`/shop?type=${encodeURIComponent(type)}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground/70 transition-colors hover:bg-secondary/40 hover:text-primary-dark"
                    >
                      <LeafIcon className="h-3 w-3 shrink-0 text-primary" />
                      {type}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/shop"
                  className="flex items-center justify-between border-t border-secondary/60 bg-secondary/20 px-5 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-secondary/30"
                >
                  View all serums <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <div
            ref={searchRef}
            className="relative"
          >
            <div
              className={`flex items-center overflow-hidden rounded-full transition-all duration-300 ${
                searchOpen ? "w-56 bg-secondary/40 pl-3 pr-1 sm:w-72" : "w-10"
              }`}
            >
              {searchOpen ? (
                <form onSubmit={submitSearch} className="flex w-full items-center gap-2">
                  <SearchIcon className="h-4 w-4 shrink-0 text-foreground/40" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                    placeholder="Search serums, ingredients…"
                    className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-secondary/60 hover:text-foreground"
                  >
                    <CloseIcon className="h-3.5 w-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary/40"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {searchOpen && query.trim() && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-2xl border border-secondary/60 bg-card shadow-lg sm:w-80">
                {suggestions.length > 0 ? (
                  <ul className="max-h-80 divide-y divide-secondary/50 overflow-y-auto">
                    {suggestions.map((product) => (
                      <li key={product._id}>
                        <button
                          type="button"
                          onClick={() => goToProduct(product._id)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary/30"
                        >
                          <ProductVisual
                            imageUrl={product.image_url}
                            alt={product.name}
                            className="h-11 w-11 shrink-0 rounded-lg"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-foreground">
                              {product.name}
                            </span>
                            <span className="block text-xs text-foreground/50">
                              {product.serum_type}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-medium text-foreground/70">
                            {formatPrice(product.price)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm text-foreground/50">
                    No serums match &ldquo;{query}&rdquo;.
                  </p>
                )}
              </div>
            )}
          </div>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary/40"
          >
            <CartIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-dark px-1 text-[10px] font-semibold text-background">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

