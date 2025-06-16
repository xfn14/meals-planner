"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Group Meals Organizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Plan, organize, and enjoy meals together with your group
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-12 grid gap-8">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader className="text-center">
                <Plus className="mx-auto mb-4 h-12 w-12 text-orange-500" />
                <CardTitle>Create New Group</CardTitle>
                <CardDescription>
                  Start a new meal planning group with friends or family
                </CardDescription>
              </CardHeader>
            </Card>

            {/* <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader className="text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-blue-500" />
                <CardTitle>Join Existing Group</CardTitle>
                <CardDescription>
                  Enter a group code to join an existing meal planning group
                </CardDescription>
              </CardHeader>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
}
