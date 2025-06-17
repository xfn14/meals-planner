"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { History, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function GroupsTable() {
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: true,
  });

  if (!userMemberships) {
    return null;
  }

  console.log("User memberships:", userMemberships.data);

  return (
    <div>
      {isLoaded && userMemberships.data?.length !== 0 && (
        <h2 className="mb-6 text-2xl font-semibold">Your Groups</h2>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userMemberships.data?.map((membership) => (
          <Card
            key={membership.id}
            className="transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* <Users className="h-5 w-5" /> */}
                <Avatar>
                  <AvatarImage src={membership.organization.imageUrl} />
                  <AvatarFallback>
                    {membership.organization.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <Link
                  href={`/group/${membership.organization.slug}`}
                  className="hover:underline"
                >
                  {membership.organization.name}
                </Link>
              </CardTitle>
              <CardDescription>
                {membership.organization.membersCount} members • 0 meals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link
                    href={`/group/${membership.organization.slug}/recommend`}
                  >
                    <Lightbulb className="mr-1 h-4 w-4" />
                    Recommend
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/group/${membership.organization.slug}/history`}>
                    <History className="mr-1 h-4 w-4" />
                    History
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
