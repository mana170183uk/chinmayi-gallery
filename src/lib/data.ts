import { prisma } from "@/lib/prisma";
import { artworks as staticArtworks, collections as staticCollections, testimonials as staticTestimonials } from "@/data/artworks";

// Server-side data fetching with fallback to static data

export async function getArtworks(opts?: { category?: string; collection?: string; limit?: number; featured?: boolean }) {
  try {
    const where: Record<string, unknown> = {};
    if (opts?.category && opts.category !== "all") where.category = opts.category;
    if (opts?.collection) where.collection = opts.collection;
    if (opts?.featured) where.featured = true;

    const artworks = await prisma.artwork.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: opts?.limit,
    });

    return artworks.length > 0 ? artworks : staticArtworks;
  } catch {
    return staticArtworks;
  }
}

export async function getArtworkBySlug(slug: string) {
  try {
    const artwork = await prisma.artwork.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });
    if (artwork) return artwork;
    return staticArtworks.find((a) => a.slug === slug) || null;
  } catch {
    return staticArtworks.find((a) => a.slug === slug) || null;
  }
}

export async function getCollections() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (collections.length === 0) return staticCollections;

    // Add artwork counts
    const withCounts = await Promise.all(
      collections.map(async (col) => {
        const count = await prisma.artwork.count({ where: { collection: col.slug } });
        return { ...col, count };
      })
    );
    return withCounts;
  } catch {
    return staticCollections;
  }
}

export async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return testimonials.length > 0 ? testimonials : staticTestimonials;
  } catch {
    return staticTestimonials;
  }
}

export async function getRelatedArtworks(category: string, excludeId: string, limit = 4) {
  try {
    const artworks = await prisma.artwork.findMany({
      where: { category, NOT: { id: excludeId } },
      take: limit,
    });
    if (artworks.length > 0) return artworks;
    return staticArtworks.filter((a) => a.category === category && a.id !== excludeId).slice(0, limit);
  } catch {
    return staticArtworks.filter((a) => a.category === category && a.id !== excludeId).slice(0, limit);
  }
}
