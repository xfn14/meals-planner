"use client";

import Navbar from "@/components/navbar";
import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setActive, isLoaded } = useOrganizationList();
  const { orgSlug } = useAuth();
  const { slug } = useParams() as { slug: string };

  useEffect(() => {
    if (!isLoaded) return;

    if (slug !== orgSlug) {
      void setActive({ organization: slug });
    }
  }, [orgSlug, isLoaded, setActive, slug]);

  return (
    <>
      <Navbar slug={slug} />

      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
