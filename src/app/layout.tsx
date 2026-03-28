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
  title: "Chinmayi Gallery — Fine Art Collection",
  description:
    "Discover breathtaking original paintings and fine art prints by Chinmayi. Explore landscapes, portraits, abstracts and more in our premium online gallery.",
  keywords: ["art gallery", "fine art", "paintings", "original artwork", "art prints", "Chinmayi"],
  openGraph: {
    title: "Chinmayi Gallery — Fine Art Collection",
    description: "Discover breathtaking original paintings and limited-edition fine art prints.",
    type: "website",
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
