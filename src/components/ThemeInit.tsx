"use client";

import { useEffect } from "react";
import { initTheme } from "@/lib/store";

export default function ThemeInit() {
  useEffect(() => {
    initTheme();
  }, []);
  return null;
}
