"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { adminLogout, adminMe } from "@/app/lib/api";

const NAV = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    if (isLoginPage) return;
    let active = true;
    adminMe()
      .then(() => {
        if (active) setStatus("ok");
      })
      .catch(() => {
        if (active) {
          setStatus("denied");
          router.replace("/admin/login");
        }
      });
    return () => {
      active = false;
    };
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) return <>{children}</>;

  if (status !== "ok") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-foreground/50">
        {status === "checking" ? "Checking session…" : "Redirecting…"}
      </div>
    );
  }

  const logout = async () => {
    await adminLogout();
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-56 shrink-0 flex-col border-r border-secondary bg-card px-4 py-6">
        <span className="font-heading px-2 text-lg font-semibold">LUMERA Admin</span>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-primary-dark text-background"
                  : "text-foreground/70 hover:bg-secondary/40"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-auto rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground/60 hover:bg-secondary/40"
        >
          Log out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
