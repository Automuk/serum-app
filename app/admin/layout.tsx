import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import AdminShell from "@/app/admin/AdminShell";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LUMERA Admin",
  description: "LUMERA store administration.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
