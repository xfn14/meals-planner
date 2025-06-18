"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface Meal {
  id: number;
  name: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes: {
    userId: string;
    userName: string;
    userAvatar: string;
  }[];
}

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

      console.log("Fetched meals:", data);

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

      await fetchMeals();
      setNewMealName("");
    } catch (error) {
      console.error("Error adding meal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (mealId: number) => {
    try {
      await fetch(`/api/meals/${mealId}/like`, { method: "POST" });
      await fetchMeals();
    } catch (error) {
      console.error("Error liking meal:", error);
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
              <CardDescription>Added by {meal.authorName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLike(meal.id)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                  {meal.likes.map((like) => (
                    <Avatar key={like.userId}>
                      <AvatarImage src={like.userAvatar} />
                      <AvatarFallback>{like.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
              <div className="flex -space-x-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
