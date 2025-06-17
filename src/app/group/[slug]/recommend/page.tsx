"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Lightbulb, Users } from "lucide-react";
import { useState } from "react";

const mockMeals = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    likes: ["Alice", "Bob", "Charlie"],
    lastEaten: "2024-01-15",
  },
  {
    id: 2,
    name: "Chicken Tikka Masala",
    likes: ["Bob", "Diana"],
    lastEaten: "2024-01-14",
  },
  {
    id: 3,
    name: "Greek Salad",
    likes: ["Alice", "Charlie", "Diana"],
    lastEaten: "2024-01-05",
  },
  {
    id: 4,
    name: "Mushroom Risotto",
    likes: ["Alice", "Bob", "Charlie", "Diana"],
    lastEaten: "2024-01-03",
  },
  {
    id: 5,
    name: "Thai Green Curry",
    likes: ["Bob", "Charlie", "Diana"],
    lastEaten: "2023-12-28",
  },
];

const mockMembers = [
  { id: 1, name: "Alice", avatar: "A" },
  { id: 2, name: "Bob", avatar: "B" },
  { id: 3, name: "Charlie", avatar: "C" },
  { id: 4, name: "Diana", avatar: "D" },
];

export default function RecommendPage() {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const toggleMember = (memberName: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberName)
        ? prev.filter((name) => name !== memberName)
        : [...prev, memberName],
    );
  };

  const generateRecommendations = () => {
    if (selectedMembers.length === 0) return;

    const likedByAll = mockMeals.filter((meal) =>
      selectedMembers.every((member) => meal.likes.includes(member)),
    );

    const sorted = likedByAll.sort((a, b) => {
      const dateA = new Date(a.lastEaten).getTime();
      const dateB = new Date(b.lastEaten).getTime();
      return dateA - dateB;
    });

    setRecommendations(sorted.slice(0, 3));
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meal Recommendations</h1>
          <p>Get personalized meal suggestions for your group</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Members
          </CardTitle>
          <CardDescription>
            Choose who you're planning to cook for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {mockMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-2">
                <Checkbox
                  id={member.name}
                  checked={selectedMembers.includes(member.name)}
                  onCheckedChange={() => toggleMember(member.name)}
                />
                <label
                  htmlFor={member.name}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{member.name}</span>
                </label>
              </div>
            ))}
          </div>
          <Button
            className="mt-4"
            onClick={generateRecommendations}
            disabled={selectedMembers.length === 0}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Get Recommendations
          </Button>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recommended Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.map((meal, index) => (
              <div key={meal.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <h3 className="text-lg font-semibold">{meal.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>
                        Last eaten {getDaysAgo(meal.lastEaten)} days ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
