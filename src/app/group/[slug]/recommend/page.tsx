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
import type { Member } from "@/types";

export default function RecommendPage() {
  const { organization, isLoaded } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [membersRes, mealsRes, historyRes] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/meals"),
        fetch("/api/history"),
      ]);

      const [membersData, mealsData, historyData] = await Promise.all([
        membersRes.json(),
        mealsRes.json(),
        historyRes.json(),
      ]);

      setMembers(membersData);
      setMeals(mealsData);
      setHistory(historyData);
    };

    if (organization && isLoaded) {
      fetchData();
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
        meal.likes.some((like: any) => like.userId === memberId),
      );
    });

    const enrichedMeals = mealsLikedByAll.map((meal) => {
      const mealHistories = history.filter((h: any) => h.mealId === meal.id);
      const lastEaten = mealHistories.length
        ? new Date(
            Math.max(
              ...mealHistories.map((h: any) => new Date(h.date).getTime()),
            ),
          )
        : null;

      return {
        ...meal,
        lastEaten,
      };
    });

    // Sort: meals least recently eaten first
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
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
                        {meal.lastEaten
                          ? `${getDaysAgo(meal.lastEaten)} days ago`
                          : "Never"}
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
