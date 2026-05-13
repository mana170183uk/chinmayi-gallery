import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, DM_Sans, Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SmoothScroll from "@/components/SmoothScroll";
import Particles from "@/components/Particles";
import ThemeInit from "@/components/ThemeInit";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  // %s gets replaced by per-page title; pages without their own use the default
  title: {
    default: "ChinuN — Fine Art by Chinmayi Nath",
    template: "%s | ChinuN",
  },
  description:
    "Original paintings and fine art prints by artist Chinmayi Nath. Landscapes, portraits, palm leaf etching, Indian styled art and contemporary works from her Essex studio.",
  keywords: ["ChinuN", "Chinmayi Nath", "fine art", "paintings", "palm leaf etching", "Indian art", "Essex artist"],
  metadataBase: new URL("https://chinun.uk"),
  openGraph: {
    title: "ChinuN — Fine Art by Chinmayi Nath",
    description: "Original paintings, prints and handmade pieces by artist Chinmayi Nath.",
    type: "website",
    url: "https://chinun.uk",
    siteName: "ChinuN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${cormorant.variable} ${playfair.variable} ${dmSans.variable} ${inter.variable} ${cinzel.variable}`}
    >
      <body className={dmSans.className}>
        <ThemeInit />
        <SmoothScroll />
        <Particles />
        <Navbar />
        <CartDrawer />
        <main className="relative z-[1]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
