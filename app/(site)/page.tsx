import Hero from "@/app/components/Hero";
import FeaturedProducts from "@/app/components/FeaturedProducts";
import StorySection from "@/app/components/StorySection";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <FeaturedProducts />
      <StorySection />
    </main>
  );
}