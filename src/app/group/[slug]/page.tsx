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
import { useState } from "react";

const mockMeals = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    addedBy: "Alice",
    likes: ["Alice", "Bob", "Charlie"],
  },
  {
    id: 2,
    name: "Chicken Tikka Masala",
    addedBy: "Bob",
    likes: ["Bob", "Diana"],
  },
  {
    id: 3,
    name: "Caesar Salad",
    addedBy: "Charlie",
    likes: ["Alice", "Charlie", "Diana"],
  },
  {
    id: 4,
    name: "Beef Tacos",
    addedBy: "Diana",
    likes: ["Bob", "Charlie", "Diana"],
  },
];

const mockMembers = [
  { id: 1, name: "Alice", avatar: "A" },
  { id: 2, name: "Bob", avatar: "B" },
  { id: 3, name: "Charlie", avatar: "C" },
  { id: 4, name: "Diana", avatar: "D" },
];

export default function GroupPage() {
  const { organization, isLoaded } = useOrganization();
  const { user } = useUser();

  const [meals, setMeals] = useState(mockMeals);
  const [newMealName, setNewMealName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!isLoaded || !user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-8">No organization found</div>
    );
  }

  const handleAddMeal = (mealName: string) => {
    if (!mealName.trim()) return;
    const newMeal = {
      id: meals.length + 1,
      name: mealName,
      addedBy: user.fullName ?? "Unknown",
      likes: [],
    };
    setMeals([...meals, newMeal]);
    setNewMealName("");
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{organization.name}</h1>
          <p>Manage your group's meal collection</p>
        </div>

        <div className="flex gap-2">
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
                  />{" "}
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    handleAddMeal(newMealName);
                    setIsDialogOpen(false);
                  }}
                >
                  Add Meal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal) => (
          <Card key={meal.id}>
            <CardHeader>
              <CardTitle className="text-lg">{meal.name}</CardTitle>
              <CardDescription>Added by {meal.addedBy}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Liked by {meal.likes.length} member
                    {meal.likes.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-1">
                  {mockMembers.map((member) => (
                    <Button
                      key={member.id}
                      size="sm"
                      variant={
                        meal.likes.includes(member.name) ? "default" : "outline"
                      }
                    >
                      {member.avatar}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
