import { getArtworks, getCollections, getTestimonials } from "@/lib/data";
import HomeClient from "@/components/HomeClient";
import type { Artwork } from "@/data/artworks";

export const dynamic = "force-dynamic";

interface ArtworkWithFlags extends Artwork {
  featured?: boolean;
  homePick?: boolean;
  heroPick?: boolean;
}

export default async function HomePage() {
  const [allArtworks, collections, testimonials] = await Promise.all([
    getArtworks(),
    getCollections(),
    getTestimonials(),
  ]);

  // Public homepage: only artworks with real images, exclude NFS/Unavailable.
  // Sold paintings remain visible in their normal categories.
  const artworks = (allArtworks as ArtworkWithFlags[]).filter(
    (a) => Boolean(a.imageUrl) && a.badge !== "unavailable" && a.badge !== "nfs"
  );

  // ── Featured Masterpiece: admin selects via featured=true ──
  const featured =
    artworks.find((a) => a.featured === true && a.badge !== "sold") ||
    artworks.find((a) => a.badge !== "sold") ||
    artworks[0];

  // ── Hero (top-right 4 panel): admin picks via heroPick=true ──
  // Honour the admin's explicit pick whether the painting is sold or not — the
  // hero strip is a portfolio showcase; sold pieces belong there too. Fillers
  // (only used when fewer than 4 are picked) still skip sold so the auto-fill
  // doesn't quietly surface unavailable works.
  const heroPicked = artworks.filter((a) => a.heroPick === true);
  const heroFillers = artworks.filter(
    (a) => a.badge !== "sold" && !heroPicked.some((h) => h.id === a.id)
  );
  const heroArtworks = [...heroPicked, ...heroFillers].slice(0, 4);

  // ── Curated Artworks section: admin picks via homePick=true ──
  // If ANY artwork is homePick=true site-wide, show ONLY those (gives the artist
  // full control: untick the checkbox to remove from the section). Sold pieces
  // are kept when explicitly picked — the card shows "Already purchased" so
  // visitors know it's not buyable. If NONE are picked, fall back to one per
  // category (skipping sold) so the page isn't empty.
  const anyHomePicked = artworks.some((a) => a.homePick === true);
  let featuredWorks: ArtworkWithFlags[];
  if (anyHomePicked) {
    featuredWorks = artworks.filter((a) => a.homePick === true);
  } else {
    const norm = (s: string | undefined) => (s || "").toLowerCase().trim();
    const isPrint = (a: ArtworkWithFlags) => ["print", "prints"].includes(norm(a.category));
    const categoryOrder = ["landscape", "portrait", "palm-leaf-etching", "indian-styled-art", "contemporary"];
    featuredWorks = categoryOrder
      .map((cat) => artworks.find((a) => norm(a.category) === cat && a.badge !== "sold"))
      .filter((a): a is ArtworkWithFlags => Boolean(a));
    const firstPrint = artworks.find((a) => isPrint(a) && a.badge !== "sold");
    if (firstPrint) featuredWorks.push(firstPrint);
  }

  return (
    <HomeClient
      artworks={JSON.parse(JSON.stringify(heroArtworks))}
      featuredWorks={JSON.parse(JSON.stringify(featuredWorks))}
      featured={JSON.parse(JSON.stringify(featured))}
      collections={JSON.parse(JSON.stringify(collections))}
      testimonials={JSON.parse(JSON.stringify(testimonials))}
    />
  );
}
