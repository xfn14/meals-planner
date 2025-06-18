"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import type { HistoryEntry, Member } from "@/types";

type MealLike = {
  userId: string;
};

type Meal = {
  id: string;
  name: string;
  likes: MealLike[];
};

type RecommendedMeal = Meal & {
  lastEaten: Date | null;
};

export default function RecommendPage() {
  const { organization, isLoaded } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedMeal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [membersRes, mealsRes, historyRes] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/meals"),
        fetch("/api/history"),
      ]);

      const membersData = (await membersRes.json()) as Member[];
      const mealsData = (await mealsRes.json()) as Meal[];
      const historyData = (await historyRes.json()) as HistoryEntry[];

      setMembers(membersData);
      setMeals(mealsData);
      setHistory(historyData);
    };

    if (organization && isLoaded) {
      void fetchData();
    }
  }, [organization, isLoaded]);

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const generateRecommendations = () => {
    if (selectedMembers.length === 0) return;

    const mealsLikedByAll = meals.filter((meal) => {
      if (!meal.likes) return false;
      return selectedMembers.every((memberId) =>
        meal.likes.some((like) => like.userId === memberId),
      );
    });

    const enrichedMeals: RecommendedMeal[] = mealsLikedByAll.map((meal) => {
      const mealHistories = history.filter((h) => h.meal === meal.name);
      const lastEaten = mealHistories.length
        ? new Date(
            Math.max(...mealHistories.map((h) => new Date(h.date).getTime())),
          )
        : null;

      return {
        ...meal,
        lastEaten,
      };
    });

    const sorted = enrichedMeals.sort((a, b) => {
      const timeA = a.lastEaten ? a.lastEaten.getTime() : 0;
      const timeB = b.lastEaten ? b.lastEaten.getTime() : 0;
      return timeA - timeB;
    });

    setRecommendations(sorted);
  };

  const getDaysAgo = (date: Date | null) => {
    if (!date) return "Never";

    const today = new Date();
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const dateMidnight = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const diffTime = todayMidnight.getTime() - dateMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 0 ? "Today" : `${diffDays} days ago`;
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
          <CardDescription>Who will be eating the meal?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center space-x-2">
                <Checkbox
                  id={member.id}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => toggleMember(member.id)}
                />
                <label
                  htmlFor={member.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
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
                        Last eaten:{" "}
                        {meal.lastEaten ? getDaysAgo(meal.lastEaten) : "Never"}
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
