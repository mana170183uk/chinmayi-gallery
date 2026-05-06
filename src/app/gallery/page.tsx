import { getArtworks } from "@/lib/data";
import GalleryClient from "@/components/GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const all = await getArtworks();
  const artworks = all.filter((a) => Boolean(a.imageUrl));
  return <GalleryClient artworks={JSON.parse(JSON.stringify(artworks))} />;
}
