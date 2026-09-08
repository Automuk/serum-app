import Image from "next/image";

/**
 * Renders a product's image when `imageUrl` is provided, otherwise falls back
 * to a themed placeholder so pages work before real photography is uploaded.
 */
export default function ProductVisual({
  imageUrl,
  alt,
  className = "",
}: {
  imageUrl?: string | null;
  alt: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={imageUrl} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-b from-secondary/60 via-secondary/20 to-card ${className}`}
    >
      <div className="flex h-2/3 w-1/3 flex-col items-center justify-end rounded-t-[40%] rounded-b-lg bg-gradient-to-b from-card to-secondary shadow-inner">
        <span className="font-heading mb-[12%] text-center text-[10px] font-semibold uppercase tracking-widest text-primary-dark">
          LUMERA
        </span>
      </div>
    </div>
  );
}
