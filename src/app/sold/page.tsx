import { getArtworks } from "@/lib/data";
import SoldClient from "@/components/SoldClient";

export const dynamic = "force-dynamic";

export default async function SoldPage() {
  const all = await getArtworks();
  const sold = all.filter((a) => a.badge === "sold" && Boolean(a.imageUrl));
  return <SoldClient artworks={JSON.parse(JSON.stringify(sold))} />;
}
