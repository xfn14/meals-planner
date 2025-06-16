"use client";

import { useClerkAppearance } from "@/lib/useClerkApperance";
import { UserButton as ClerkUserButton } from "@clerk/nextjs";

export default function UserButton() {
  const appearance = useClerkAppearance();

  return (
    <ClerkUserButton
      appearance={appearance}
      userProfileProps={{
        appearance,
      }}
    />
  );
}
