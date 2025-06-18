import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 400 },
      );
    }

    const client = await clerkClient();
    const members = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    const formatted = members.data.map((member) => ({
      id: member.publicUserData?.userId,
      name:
        member.publicUserData?.firstName || member.publicUserData?.lastName
          ? `${member.publicUserData?.firstName ?? ""} ${member.publicUserData?.lastName ?? ""}`.trim()
          : "Unknown",
      avatar: member.publicUserData?.imageUrl ?? "",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
};
