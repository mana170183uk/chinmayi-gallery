import { getArtworks, getCollections, getTestimonials } from "@/lib/data";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [artworks, collections, testimonials] = await Promise.all([
    getArtworks(),
    getCollections(),
    getTestimonials(),
  ]);

  const featured = artworks.find((a) => a.badge === "featured" || a.slug === "twilight-reverie") || artworks[0];
  const featuredWorks = artworks.slice(0, 8);

  return (
    <HomeClient
      artworks={JSON.parse(JSON.stringify(artworks))}
      featuredWorks={JSON.parse(JSON.stringify(featuredWorks))}
      featured={JSON.parse(JSON.stringify(featured))}
      collections={JSON.parse(JSON.stringify(collections))}
      testimonials={JSON.parse(JSON.stringify(testimonials))}
    />
  );
}
