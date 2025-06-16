"use client";

import { useClerkAppearance } from "@/lib/useClerkApperance";
import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const appearance = useClerkAppearance();

  return (
    <ClerkProviderBase appearance={appearance}>{children}</ClerkProviderBase>
  );
}
