import { prisma } from "@/lib/prisma";
import ProductPage from "@/components/ProductPage";

export const dynamic = "force-dynamic";

export default async function ClothingPage() {
  let products: Record<string, unknown>[] = [];
  try { products = await prisma.product.findMany({ where: { type: "clothing" }, include: { images: { orderBy: { sortOrder: "asc" } } }, orderBy: { createdAt: "desc" } }); } catch {}
  return (
    <ProductPage
      title="Clothing"
      subtitle="Art-inspired clothing that lets you wear creativity every day"
      label="Art You Wear"
      products={JSON.parse(JSON.stringify(products))}
      emptyMessage="No clothing items yet"
    />
  );
}
