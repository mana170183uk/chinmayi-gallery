import { getArtworks, getCollections, getTestimonials } from "@/lib/data";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allArtworks, collections, testimonials] = await Promise.all([
    getArtworks(),
    getCollections(),
    getTestimonials(),
  ]);

  // Public homepage: only artworks with real images, exclude unavailable.
  // Sold paintings are kept in the curated section so it doesn't look empty.
  const artworks = allArtworks.filter((a) => Boolean(a.imageUrl) && a.badge !== "unavailable");

  // Featured masterpiece should be a non-sold piece if possible
  const featured =
    artworks.find((a) => a.badge !== "sold" && (a.badge === "featured" || a.slug === "twilight-reverie")) ||
    artworks.find((a) => a.badge !== "sold") ||
    artworks[0];
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
