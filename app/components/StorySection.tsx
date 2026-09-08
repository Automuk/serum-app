import { ArrowRightIcon } from "@/app/components/icons";

export default function StorySection() {
  return (
    <section
      id="story"
      className="flex items-center border-b border-secondary/60 bg-cover bg-center py-16 sm:py-24"
      style={{ backgroundImage: "url('https://cdn.animhaus.com/serum/our_story_banner.png')" }}
    >
      <div className="mx-auto w-full max-w-[1420px] px-6">
        <div className="max-w-lg pl-6 2xl:pl-0">
          <h2 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Beauty in simplicity.
          </h2>
          <p className="mt-5 max-w-md text-foreground/70">
            LUMERA was created with a simple belief: less is more. We craft
            minimalist skincare using clean, high-quality ingredients that
            support your skin&apos;s natural glow — no fillers, no fuss.
          </p>
          <span className="mt-8 inline-flex cursor-default items-center gap-2 rounded-full bg-primary-dark px-7 py-3 text-sm font-semibold text-background">
            Learn More <ArrowRightIcon aria-hidden className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
}

