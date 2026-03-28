// Client-side API helpers

const BASE = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL || "";

export async function fetchArtworks(params?: Record<string, string>) {
  const url = new URL(`${BASE}/api/artworks`, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch artworks");
  return res.json();
}

export async function fetchArtwork(slugOrId: string) {
  const res = await fetch(`/api/artworks/${slugOrId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createArtwork(data: Record<string, unknown>) {
  const res = await fetch("/api/artworks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create artwork");
  return res.json();
}

export async function updateArtwork(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/artworks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update artwork");
  return res.json();
}

export async function deleteArtwork(id: string) {
  const res = await fetch(`/api/artworks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete artwork");
  return res.json();
}

export async function fetchCollections() {
  const res = await fetch("/api/collections");
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function createCollection(data: Record<string, unknown>) {
  const res = await fetch("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create collection");
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function submitContact(data: Record<string, string>) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit contact form");
  return res.json();
}

export async function fetchTestimonials() {
  const res = await fetch("/api/testimonials");
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
}
