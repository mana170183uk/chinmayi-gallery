export interface Artwork {
  id: string;
  title: string;
  slug: string;
  category: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number;
  originalPrice?: number;
  description: string;
  gradient: string;
  aspectRatio: string;
  badge?: "new" | "sold" | "featured";
  collection?: string;
}

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Emerald Dreams",
    slug: "emerald-dreams",
    category: "landscape",
    medium: "Oil on Canvas",
    dimensions: '24 × 36 in (61 × 91 cm)',
    year: 2025,
    price: 1850,
    description:
      "A luminous landscape that captures the moment when morning light breaks through an emerald canopy. The interplay of deep violet shadows and vibrant green creates a sense of depth that draws the viewer into an enchanted forest clearing.",
    gradient: "linear-gradient(160deg, #1a0a2e, #2d1b69 30%, #11998e 60%, #38ef7d 90%)",
    aspectRatio: "3/4",
    collection: "landscapes",
  },
  {
    id: "2",
    title: "Rosewood Bloom",
    slug: "rosewood-bloom",
    category: "floral",
    medium: "Acrylic on Canvas",
    dimensions: '20 × 30 in (51 × 76 cm)',
    year: 2026,
    price: 1200,
    description:
      "Delicate petals unfurl in a symphony of rose and coral, each brushstroke capturing the ephemeral beauty of a garden in full bloom. The warm undertones create a sense of golden-hour intimacy.",
    gradient: "linear-gradient(145deg, #2c003e, #f093fb 35%, #f5576c 65%, #ff6b35)",
    aspectRatio: "4/5",
    badge: "new",
    collection: "floral",
  },
  {
    id: "3",
    title: "Azure Horizon",
    slug: "azure-horizon",
    category: "landscape",
    medium: "Oil on Linen",
    dimensions: '30 × 30 in (76 × 76 cm)',
    year: 2025,
    price: 2100,
    description:
      "Where sky meets sea in an endless expanse of cerulean and turquoise. This square-format piece explores the horizon line as a meditation point, with subtle tonal shifts that reward prolonged viewing.",
    gradient: "linear-gradient(135deg, #0c2340, #4facfe 40%, #00f2fe 80%, #e0f7fa)",
    aspectRatio: "1/1",
    collection: "landscapes",
  },
  {
    id: "4",
    title: "Golden Hour",
    slug: "golden-hour",
    category: "landscape",
    medium: "Oil on Canvas",
    dimensions: '24 × 36 in (61 × 91 cm)',
    year: 2025,
    price: 1650,
    description:
      "The last moments of daylight paint the world in warm amber and soft pink. This piece captures that magical transition between day and night when everything glows with an inner light.",
    gradient: "linear-gradient(150deg, #5c1018, #fa709a 30%, #fee140 70%, #fffde4)",
    aspectRatio: "3/4",
    collection: "landscapes",
  },
  {
    id: "5",
    title: "Lavender Mist",
    slug: "lavender-mist",
    category: "abstract",
    medium: "Mixed Media on Canvas",
    dimensions: '28 × 40 in (71 × 102 cm)',
    year: 2025,
    price: 1950,
    description:
      "An ethereal exploration of texture and colour, where layers of lavender and blush pink create a dreamlike atmosphere. The mixed-media technique adds dimensional interest visible from every angle.",
    gradient: "linear-gradient(140deg, #1a0533, #a18cd1 35%, #fbc2eb 70%, #fff5f5)",
    aspectRatio: "4/3",
    collection: "abstract",
  },
  {
    id: "6",
    title: "Autumn Whisper",
    slug: "autumn-whisper",
    category: "floral",
    medium: "Watercolour on Arches",
    dimensions: '18 × 24 in (46 × 61 cm)',
    year: 2026,
    price: 890,
    description:
      "Soft whispers of burnt sienna and warm cream evoke the quiet beauty of autumn leaves caught mid-fall. The translucent watercolour layers create a luminosity unique to this medium.",
    gradient: "linear-gradient(155deg, #6b2c0f, #ffecd2 30%, #fcb69f 60%, #ff7e5f)",
    aspectRatio: "4/5",
    badge: "new",
    collection: "floral",
  },
  {
    id: "7",
    title: "Indigo Reverie",
    slug: "indigo-reverie",
    category: "abstract",
    medium: "Oil on Canvas",
    dimensions: '36 × 48 in (91 × 122 cm)',
    year: 2024,
    price: 2800,
    description:
      "A bold exploration of the blue spectrum, from deepest indigo to electric violet. The palette knife technique creates dynamic ridges that catch light differently throughout the day.",
    gradient: "linear-gradient(130deg, #0d1b3e, #667eea 30%, #764ba2 70%, #f093fb)",
    aspectRatio: "3/4",
    badge: "featured",
    collection: "abstract",
  },
  {
    id: "8",
    title: "Crimson Sunset",
    slug: "crimson-sunset",
    category: "landscape",
    medium: "Oil on Canvas",
    dimensions: '30 × 40 in (76 × 102 cm)',
    year: 2025,
    price: 2200,
    description:
      "Fire meets earth in this dramatic landscape where a crimson sun descends behind mountain silhouettes. The impasto technique creates a textured surface that glows with warm intensity.",
    gradient: "linear-gradient(145deg, #3d0c02, #f5af19 30%, #f12711 65%, #ffcf48)",
    aspectRatio: "5/4",
    collection: "landscapes",
  },
  {
    id: "9",
    title: "Twilight Reverie",
    slug: "twilight-reverie",
    category: "contemporary",
    medium: "Oil on Linen",
    dimensions: '36 × 48 in (91 × 122 cm)',
    year: 2024,
    price: 2450,
    originalPrice: 3200,
    description:
      "A mesmerising interplay of warm amber and deep crimson, this painting captures the fleeting beauty of twilight over rolling hills. The impasto technique creates a luminous texture that shifts with the viewer's angle.",
    gradient: "linear-gradient(220deg, #1a2a6c 0%, #b21f1f 45%, #fdbb2d 100%)",
    aspectRatio: "3/4",
    badge: "featured",
    collection: "contemporary",
  },
  {
    id: "10",
    title: "Mauve Soliloquy",
    slug: "mauve-soliloquy",
    category: "portrait",
    medium: "Oil on Canvas",
    dimensions: '24 × 30 in (61 × 76 cm)',
    year: 2025,
    price: 1750,
    description:
      "A contemplative portrait study in muted mauves and dusty pinks. The subject's gaze invites introspection, while the soft colour palette creates an atmosphere of quiet intimacy.",
    gradient: "linear-gradient(170deg, #0c3483 0%, #6b6b83 40%, #aa4b6b 70%, #e8a4c4)",
    aspectRatio: "5/6",
    collection: "portraits",
  },
  {
    id: "11",
    title: "Velvet Night",
    slug: "velvet-night",
    category: "abstract",
    medium: "Acrylic on Canvas",
    dimensions: '30 × 40 in (76 × 102 cm)',
    year: 2024,
    price: 1900,
    description:
      "Deep crimson dissolves into midnight purple in this moody abstract. The velvet-smooth surface belies the expressive energy of its creation — completed in a single inspired session.",
    gradient: "linear-gradient(135deg, #0d0221, #c94b4b 40%, #4b134f 80%)",
    aspectRatio: "3/4",
    badge: "sold",
    collection: "abstract",
  },
  {
    id: "12",
    title: "Ocean Breath",
    slug: "ocean-breath",
    category: "landscape",
    medium: "Oil on Canvas",
    dimensions: '40 × 60 in (102 × 152 cm)',
    year: 2025,
    price: 3200,
    description:
      "The vast, breathing ocean rendered at monumental scale. From the deep navy of the abyss to the sparkling cerulean of the shallows, this piece brings the calming rhythm of the sea into any space.",
    gradient: "linear-gradient(145deg, #000428, #004e92 50%, #6dd5ed)",
    aspectRatio: "4/3",
    collection: "landscapes",
  },
  {
    id: "13",
    title: "Petal Storm",
    slug: "petal-storm",
    category: "floral",
    medium: "Watercolour on Paper",
    dimensions: '20 × 28 in (51 × 71 cm)',
    year: 2026,
    price: 980,
    description:
      "A whirlwind of petals caught in motion — pinks, corals, and warm yellows swirl across the paper in a dynamic composition that balances chaos with delicate beauty.",
    gradient: "linear-gradient(150deg, #5c1018, #fa709a 30%, #fee140 70%, #fffde4)",
    aspectRatio: "3/4",
    badge: "new",
    collection: "floral",
  },
  {
    id: "14",
    title: "Still Echoes",
    slug: "still-echoes",
    category: "portrait",
    medium: "Oil on Canvas",
    dimensions: '24 × 36 in (61 × 91 cm)',
    year: 2025,
    price: 1650,
    description:
      "A figure caught between movement and stillness, rendered in soft focus with a palette of dusty rose and warm mauve. The echoes of gesture create a sense of quiet narrative.",
    gradient: "linear-gradient(145deg, #2c003e, #f093fb 35%, #f5576c 65%, #ff6b35)",
    aspectRatio: "4/5",
    collection: "portraits",
  },
  {
    id: "15",
    title: "Neon Dusk",
    slug: "neon-dusk",
    category: "contemporary",
    medium: "Mixed Media on Canvas",
    dimensions: '36 × 36 in (91 × 91 cm)',
    year: 2026,
    price: 2600,
    description:
      "Urban energy meets natural beauty in this contemporary piece. Amber and crimson tones evoke the electric glow of city lights against a fading sky, with metallic leaf accents catching real light.",
    gradient: "linear-gradient(145deg, #3d0c02, #f5af19 30%, #f12711 65%, #ffcf48)",
    aspectRatio: "1/1",
    collection: "contemporary",
  },
  {
    id: "16",
    title: "Silk & Stone",
    slug: "silk-and-stone",
    category: "abstract",
    medium: "Acrylic on Linen",
    dimensions: '28 × 40 in (71 × 102 cm)',
    year: 2025,
    price: 2050,
    description:
      "The tension between soft and hard, fluid and rigid — this abstract piece explores materiality through contrasting textures. Smooth washes meet bold impasto in a dialogue of surfaces.",
    gradient: "linear-gradient(140deg, #1a0533, #a18cd1 35%, #fbc2eb 70%, #fff5f5)",
    aspectRatio: "4/5",
    collection: "abstract",
  },
];

export const collections = [
  { id: "landscapes", title: "Landscapes", count: 5, description: "Sweeping vistas and serene natural scenes", gradient: "linear-gradient(160deg, #1a0a2e, #2d1b69 30%, #11998e 60%, #38ef7d 90%)" },
  { id: "abstract", title: "Abstract", count: 5, description: "Bold colours and expressive forms", gradient: "linear-gradient(130deg, #0d1b3e, #667eea 30%, #764ba2 70%, #f093fb)" },
  { id: "floral", title: "Floral & Nature", count: 3, description: "Delicate blooms and organic beauty", gradient: "linear-gradient(150deg, #5c1018, #fa709a 30%, #fee140 70%, #fffde4)" },
  { id: "portraits", title: "Portraits", count: 2, description: "Intimate studies of the human form", gradient: "linear-gradient(170deg, #0c3483 0%, #6b6b83 40%, #aa4b6b 70%, #e8a4c4)" },
  { id: "contemporary", title: "Contemporary", count: 3, description: "Modern visions and urban energy", gradient: "linear-gradient(220deg, #1a2a6c 0%, #b21f1f 45%, #fdbb2d 100%)" },
];

export const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Art Collector, London",
    text: "The painting arrived beautifully packaged and looks even more stunning in person. The colours seem to glow against our living room wall. Absolutely mesmerised every time I walk past it.",
    avatar: "S",
    avatarGradient: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  {
    name: "James Patel",
    role: "Private Collector, Mumbai",
    text: "I commissioned a custom piece for our anniversary and Chinmayi captured exactly what I envisioned. The process was collaborative, professional and the result brought tears to my wife's eyes.",
    avatar: "J",
    avatarGradient: "linear-gradient(135deg, #f093fb, #f5576c)",
  },
  {
    name: "Amelia Chen",
    role: "Interior Designer, Singapore",
    text: "We purchased three pieces for our boutique hotel lobby. Guests constantly ask about the artwork. Chinmayi's use of colour and light transforms the entire space into something magical.",
    avatar: "A",
    avatarGradient: "linear-gradient(135deg, #11998e, #38ef7d)",
  },
];

export const categories = ["all", "landscape", "abstract", "floral", "portrait", "contemporary"];
