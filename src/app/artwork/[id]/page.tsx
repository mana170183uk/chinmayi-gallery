import { getArtworkBySlug, getRelatedArtworks } from "@/lib/data";
import ArtworkDetailClient from "@/components/ArtworkDetailClient";

export const dynamic = "force-dynamic";

export default async function ArtworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artwork = await getArtworkBySlug(id);

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Artwork Not Found</h1>
          <a href="/gallery" className="underline" style={{ color: "var(--gold)" }}>Back to Gallery</a>
        </div>
      </div>
    );
  }

  const related = await getRelatedArtworks(artwork.category, artwork.id);

  return (
    <ArtworkDetailClient
      artwork={JSON.parse(JSON.stringify(artwork))}
      related={JSON.parse(JSON.stringify(related))}
    />
  );
}
