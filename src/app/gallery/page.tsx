import { getArtworks } from "@/lib/data";
import GalleryClient from "@/components/GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const artworks = await getArtworks();
  return <GalleryClient artworks={JSON.parse(JSON.stringify(artworks))} />;
}
