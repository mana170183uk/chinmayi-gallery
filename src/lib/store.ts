"use client";

import { Artwork } from "@/data/artworks";

// Simple global state (no external dependency needed)
type Listener = () => void;

interface CartItem {
  artwork: Artwork;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  theme: "dark" | "light";
  cartOpen: boolean;
  lightbox: Artwork | null;
}

let state: StoreState = {
  cart: [],
  wishlist: [],
  theme: "dark",
  cartOpen: false,
  lightbox: null,
};

const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState() {
  return state;
}

export function setTheme(theme: "dark" | "light") {
  state = { ...state, theme };
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cg-theme", theme);
  }
  notify();
}

export function toggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

export function addToCart(artwork: Artwork) {
  const existing = state.cart.find((i) => i.artwork.id === artwork.id);
  if (existing) return;
  state = { ...state, cart: [...state.cart, { artwork, quantity: 1 }] };
  notify();
}

export function removeFromCart(artworkId: string) {
  state = { ...state, cart: state.cart.filter((i) => i.artwork.id !== artworkId) };
  notify();
}

export function toggleWishlist(artworkId: string) {
  const has = state.wishlist.includes(artworkId);
  state = {
    ...state,
    wishlist: has
      ? state.wishlist.filter((id) => id !== artworkId)
      : [...state.wishlist, artworkId],
  };
  notify();
}

export function setCartOpen(open: boolean) {
  state = { ...state, cartOpen: open };
  notify();
}

export function setLightbox(artwork: Artwork | null) {
  state = { ...state, lightbox: artwork };
  notify();
}

export function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.artwork.price * item.quantity, 0);
}

export function initTheme() {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem("cg-theme") as "dark" | "light" | null;
  const theme = saved || "dark";
  state = { ...state, theme };
  document.documentElement.setAttribute("data-theme", theme);
}
