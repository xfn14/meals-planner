"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function CreateGroupButton() {
  const { user } = useUser();
  const clerk = useClerk();

  const handleClick = async () => {
    if (user) {
      await clerk.redirectToCreateOrganization();
    } else {
      await clerk.redirectToSignIn();
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer transition-shadow hover:shadow-lg"
    >
      <CardHeader className="text-center">
        <Plus className="text-primary mx-auto mb-4 h-12 w-12" />
        <CardTitle>Create New Group</CardTitle>
        <CardDescription>
          Start a new meal planning group with friends or family
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
