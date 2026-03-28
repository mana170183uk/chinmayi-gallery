import { prisma } from "@/lib/prisma";
import ProductPage from "@/components/ProductPage";

export const dynamic = "force-dynamic";

export default async function HomeDecorPage() {
  let products: Record<string, unknown>[] = [];
  try { products = await prisma.product.findMany({ where: { type: "home-decor" }, orderBy: { createdAt: "desc" } }); } catch {}
  return (
    <ProductPage
      title="Home Decor"
      subtitle="Transform your space with artistically crafted home decor pieces"
      label="Living Art"
      products={JSON.parse(JSON.stringify(products))}
      emptyMessage="No home decor items yet"
    />
  );
}
