import { prisma } from "@/lib/prisma";
import ProductPage from "@/components/ProductPage";

export const dynamic = "force-dynamic";

export default async function JewelleryPage() {
  let products: Record<string, unknown>[] = [];
  try { products = await prisma.product.findMany({ where: { type: "jewellery" }, orderBy: { createdAt: "desc" } }); } catch {}
  return (
    <ProductPage
      title="Jewellery"
      subtitle="Handcrafted jewellery pieces inspired by art, nature and timeless elegance"
      label="Wearable Art"
      products={JSON.parse(JSON.stringify(products))}
      emptyMessage="No jewellery items yet"
    />
  );
}
