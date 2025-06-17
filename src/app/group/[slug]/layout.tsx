"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import SetActiveOrg from "./_components/set-active-org";

export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = await params;
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const userOrgs = await (
    await clerkClient()
  ).users.getOrganizationMembershipList({ userId });

  const org = userOrgs.data.find((o) => o.organization?.slug === slug);

  if (!org) {
    notFound();
  }

  return (
    <>
      <Navbar slug={slug} />
      <SetActiveOrg slug={slug} />
      <main className="container mx-auto flex flex-col gap-4 px-4">
        {children}
      </main>
    </>
  );
}
