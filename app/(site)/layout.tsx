import type { ReactNode } from "react";
import { CartProvider } from "@/app/context/CartContext";
import AnnouncementBar from "@/app/components/AnnouncementBar";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBar />
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </CartProvider>
  );
}
