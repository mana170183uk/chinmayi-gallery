import { getArtworks, getCollections, getTestimonials } from "@/lib/data";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allArtworks, collections, testimonials] = await Promise.all([
    getArtworks(),
    getCollections(),
    getTestimonials(),
  ]);

  // Public homepage: only artworks with real images, exclude NFS/Unavailable.
  // Sold paintings remain visible in their normal categories.
  const artworks = allArtworks.filter(
    (a) => Boolean(a.imageUrl) && a.badge !== "unavailable" && a.badge !== "nfs"
  );

  // Featured Masterpiece: admin selects via featured=true; falls back to first non-sold.
  const featured =
    artworks.find((a) => (a as { featured?: boolean }).featured === true && a.badge !== "sold") ||
    artworks.find((a) => a.badge !== "sold") ||
    artworks[0];

  // Curated Artworks: one per gallery category.
  // Order: Landscape, Portrait, Palm Leaf Etching, Indian Styled Art, Contemporary & Nature, Prints.
  const norm = (s: string | undefined) => (s || "").toLowerCase().trim();
  const isPrint = (a: typeof artworks[number]) => ["print", "prints"].includes(norm(a.category));
  const categoryOrder = ["landscape", "portrait", "palm-leaf-etching", "indian-styled-art", "contemporary"];
  const featuredWorks = categoryOrder
    .map((cat) => {
      const inCat = artworks.filter((a) => norm(a.category) === cat && a.badge !== "sold");
      // Prefer admin-picked
      return inCat.find((a) => (a as { homePick?: boolean }).homePick === true) || inCat[0];
    })
    .filter(Boolean);

  // Add one print as well
  const printsInCat = artworks.filter((a) => isPrint(a) && a.badge !== "sold");
  const printPick = printsInCat.find((a) => (a as { homePick?: boolean }).homePick === true) || printsInCat[0];
  if (printPick) featuredWorks.push(printPick);

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
