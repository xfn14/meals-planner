"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Heart, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type Meal = {
  id: number;
  name: string;
  authorId: string;
  createdAt: string;
};

export default function GroupPage() {
  const { organization, isLoaded } = useOrganization();
  const { user } = useUser();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMealName, setNewMealName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organization) {
      fetchMeals();
    }
  }, [organization]);

  const fetchMeals = async () => {
    try {
      const res = await fetch("/api/meals");
      const data = await res.json();
      setMeals(data);
    } catch (error) {
      console.error("Failed to fetch meals:", error);
    }
  };

  const handleAddMeal = async (mealName: string) => {
    if (!mealName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: mealName }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error creating meal:", error);
        return;
      }

      const newMeal: Meal = await res.json();
      newMeal.authorId = user?.fullName ?? "Unknown";
      setMeals((prev) => [...prev, newMeal]);
      setNewMealName("");
    } catch (error) {
      console.error("Error adding meal:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-8">No organization found</div>
    );
  }

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{organization.name}</h1>
          <p>Manage your group's meal collection</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
              <DialogDescription>
                Add a meal that your group might enjoy
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mealName">Meal Name</Label>
                <Input
                  id="mealName"
                  placeholder="e.g., Chicken Parmesan"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={async () => {
                  await handleAddMeal(newMealName);
                  setIsDialogOpen(false);
                }}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Meal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal) => (
          <Card key={meal.id}>
            <CardHeader>
              <CardTitle className="text-lg">{meal.name}</CardTitle>
              <CardDescription>Added by {meal.authorId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Likes feature coming soon
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
