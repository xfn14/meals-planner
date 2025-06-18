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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { HistoryEntry, Meal, Member } from "@/types";
import { useOrganization } from "@clerk/nextjs";
import { Check, History, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const { organization, isLoaded } = useOrganization();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  const filteredHistory = history.filter((item) =>
    item.meal.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (organization && isLoaded) {
      const fetchData = async () => {
        const historyRes = await fetch("/api/history");
        const historyData = (await historyRes.json()) as HistoryEntry[];

        const mealsRes = await fetch("/api/meals");
        const mealsData = (await mealsRes.json()) as Meal[];

        const membersRes = await fetch("/api/members");
        const membersData = (await membersRes.json()) as Member[];

        setHistory(historyData);
        setMeals(mealsData);
        setMembers(membersData);
      };

      void fetchData();
    }
  }, [organization, isLoaded]);

  const addMealToHistory = async () => {
    if (selectedMealId && selectedMembers.length > 0) {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealId: selectedMealId,
          userIds: selectedMembers,
        }),
      });

      const historyRes = await fetch("/api/history");
      const historyData = (await historyRes.json()) as HistoryEntry[];

      setHistory(historyData);
      setIsDialogOpen(false);
      setSelectedMealId(null);
      setSelectedMembers([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meal History</h1>
          <p>Track what you&apos;ve eaten and when</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Mark as Eaten
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Meal as Eaten</DialogTitle>
              <DialogDescription>
                Add a meal to today&apos;s history
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                onValueChange={(value) => setSelectedMealId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a meal" />
                </SelectTrigger>
                <SelectContent>
                  {meals.map((meal) => (
                    <SelectItem key={meal.id} value={meal.id.toString()}>
                      {meal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <p className="mb-2 font-medium">Select Members:</p>
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => {
                    const selected = selectedMembers.includes(member.id);
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() =>
                          setSelectedMembers((prev) =>
                            prev.includes(member.id)
                              ? prev.filter((id) => id !== member.id)
                              : [...prev, member.id],
                          )
                        }
                        className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-transparent transition-colors"
                      >
                        <Avatar className="h-full w-full">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {selected && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => void addMealToHistory()}
              >
                Add to History
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Meals
          </CardTitle>
          <CardDescription>
            {filteredHistory.length} meal
            {filteredHistory.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div key={item.id} className="flex justify-between border p-4">
                <div>
                  <div>{item.meal}</div>
                  <div>{formatDate(item.date)}</div>
                </div>

                <div className="flex gap-2">
                  {item.eaten.map((uid: string) => {
                    const member = members.find((m) => m.id === uid);
                    if (!member) return null;

                    console.log("Member:", member);

                    return (
                      <TooltipProvider key={uid}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{member.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
