import { notFound } from "next/navigation";
import { getProduct } from "@/app/lib/api";
import ProductForm from "@/app/admin/products/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Edit product</h1>
      <ProductForm product={product} />
    </div>
  );
}
