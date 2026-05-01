import { prisma } from "@/lib/prisma";
import AboutClient from "@/components/AboutClient";

export const dynamic = "force-dynamic";

const fallbackExhibitions = [
  { id: "1", year: "2026", title: "Colours of the Soul — Solo Exhibition", venue: "The Gallery, London", description: null, imageUrl: null, sortOrder: 0 },
  { id: "2", year: "2025", title: "Contemporary Visions", venue: "Mumbai Art Fair", description: null, imageUrl: null, sortOrder: 1 },
  { id: "3", year: "2025", title: "Nature's Palette — Group Show", venue: "Singapore Art Space", description: null, imageUrl: null, sortOrder: 2 },
  { id: "4", year: "2024", title: "Emerging Voices in Fine Art", venue: "Saatchi Gallery, London", description: null, imageUrl: null, sortOrder: 3 },
  { id: "5", year: "2024", title: "Light & Shadow", venue: "Delhi Art Summit", description: null, imageUrl: null, sortOrder: 4 },
  { id: "6", year: "2023", title: "First Light — Debut Exhibition", venue: "The Nehru Centre, London", description: null, imageUrl: null, sortOrder: 5 },
];

const fallbackWorkshops = [
  { id: "1", title: "Palm Leaf Etching Masterclass", date: "Coming 2026", description: "Learn the ancient Indian art of palm leaf etching in a hands-on weekend workshop. Suitable for all skill levels.", imageUrl: null, location: null, sortOrder: 0 },
  { id: "2", title: "Introduction to Oil Painting", date: "Monthly Sessions", description: "Discover the joy of working with oils — from preparing your canvas to blending luminous colours like a professional.", imageUrl: null, location: null, sortOrder: 1 },
  { id: "3", title: "Indian Folk Art Series", date: "Quarterly Workshops", description: "Explore traditional Indian art styles including Madhubani, Warli, and Pattachitra in immersive sessions.", imageUrl: null, location: null, sortOrder: 2 },
];

export default async function AboutPage() {
  let exhibitions = fallbackExhibitions;
  let workshops = fallbackWorkshops;

  try {
    const dbExhibitions = await prisma.exhibition.findMany({ orderBy: [{ sortOrder: "asc" }, { year: "desc" }] });
    if (dbExhibitions.length > 0) exhibitions = JSON.parse(JSON.stringify(dbExhibitions));
  } catch {}

  try {
    const dbWorkshops = await prisma.workshop.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    if (dbWorkshops.length > 0) workshops = JSON.parse(JSON.stringify(dbWorkshops));
  } catch {}

  return <AboutClient exhibitions={exhibitions} workshops={workshops} />;
}
