"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SetActiveOrg({ slug }: { slug: string }) {
  const { setActive, isLoaded } = useOrganizationList();

  useEffect(() => {
    if (!isLoaded) return;

    setActive({ organization: slug }).catch((err) => {
      console.error("Failed to set active organization:", err);
    });
  }, [isLoaded, setActive, slug]);

  return null;
}
