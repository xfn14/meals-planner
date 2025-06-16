"use client";

import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function useClerkAppearance() {
  const { theme } = useTheme();

  return {
    baseTheme: theme === "dark" ? dark : undefined,
  };
}
