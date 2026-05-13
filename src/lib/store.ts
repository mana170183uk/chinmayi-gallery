"use client";

import { Artwork } from "@/data/artworks";

// Simple global state (no external dependency needed)
type Listener = () => void;

export type CartItemKind = "artwork" | "product" | "book";

export interface CartLineItem {
  id: string;
  kind: CartItemKind;
  title: string;
  price: number;
  imageUrl?: string | null;
  slug?: string | null;
  subtitle?: string | null; // e.g. medium for artwork, material for product
}

interface CartItem {
  item: CartLineItem;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  theme: "dark" | "light";
  cartOpen: boolean;
  lightbox: Artwork | null;
}

const CART_STORAGE_KEY = "chinun-cart";
const WISHLIST_STORAGE_KEY = "chinun-wishlist";

let state: StoreState = {
  cart: [],
  wishlist: [],
  theme: "dark",
  cartOpen: false,
  lightbox: null,
};

const listeners: Set<Listener> = new Set();

function persistCart() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.wishlist));
  } catch {
    // ignore quota errors / private mode
  }
}

function notify() {
  persistCart();
  listeners.forEach((l) => l());
}

// Hydrate from localStorage on first import in the browser
if (typeof window !== "undefined") {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    state = {
      ...state,
      cart: savedCart ? JSON.parse(savedCart) : [],
      wishlist: savedWishlist ? JSON.parse(savedWishlist) : [],
    };
  } catch {
    // ignore parse errors
  }
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

// Accepts either an Artwork or a generic CartLineItem
export function addToCart(
  input: Artwork | CartLineItem,
  kind: CartItemKind = "artwork"
) {
  const item: CartLineItem =
    "kind" in input
      ? (input as CartLineItem)
      : {
          id: (input as Artwork).id,
          kind,
          title: (input as Artwork).title,
          price: (input as Artwork).price,
          imageUrl: (input as Artwork).imageUrl,
          slug: (input as Artwork).slug,
          subtitle: (input as Artwork).medium,
        };
  const existing = state.cart.find((i) => i.item.id === item.id && i.item.kind === item.kind);
  if (existing) {
    state = {
      ...state,
      cart: state.cart.map((i) =>
        i.item.id === item.id && i.item.kind === item.kind
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    };
  } else {
    state = { ...state, cart: [...state.cart, { item, quantity: 1 }] };
  }
  // Auto-open the cart drawer so customers see the item was added
  state = { ...state, cartOpen: true };
  notify();
}

export function removeFromCart(itemId: string, kind?: CartItemKind) {
  state = {
    ...state,
    cart: state.cart.filter((i) =>
      kind ? !(i.item.id === itemId && i.item.kind === kind) : i.item.id !== itemId
    ),
  };
  notify();
}

export function toggleWishlist(itemId: string) {
  const has = state.wishlist.includes(itemId);
  state = {
    ...state,
    wishlist: has
      ? state.wishlist.filter((id) => id !== itemId)
      : [...state.wishlist, itemId],
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
  return state.cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
}

export function initTheme() {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem("cg-theme") as "dark" | "light" | null;
  const theme = saved || "dark";
  state = { ...state, theme };
  document.documentElement.setAttribute("data-theme", theme);
}
