"use client";

import { useClerkAppearance } from "@/lib/useClerkApperance";
import { OrganizationProfile } from "@clerk/nextjs";

export default function UserButton() {
  const appearance = useClerkAppearance();

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p>Manage your organization settings, members, and more.</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <OrganizationProfile appearance={appearance} />
      </div>
    </>
  );
}
