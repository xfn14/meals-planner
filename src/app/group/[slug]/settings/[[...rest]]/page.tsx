"use client";

import { useClerkAppearance } from "@/lib/useClerkApperance";
import { OrganizationProfile } from "@clerk/nextjs";

export default function UserButton() {
  const appearance = useClerkAppearance();

  return (
    <div className="flex w-full items-center justify-center">
      <OrganizationProfile appearance={appearance} />
    </div>
  );
}
