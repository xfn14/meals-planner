"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, Plus, Search, Calendar, Check } from "lucide-react";

const mockHistory = [
  { id: 1, meal: "Spaghetti Carbonara", date: "2024-01-15", eaten: [1, 2] },
  { id: 2, meal: "Chicken Tikka Masala", date: "2024-01-14", eaten: [2, 3] },
  { id: 3, meal: "Caesar Salad", date: "2024-01-13", eaten: [1, 3] },
  { id: 4, meal: "Beef Tacos", date: "2024-01-12", eaten: [1, 2, 4] },
  { id: 5, meal: "Grilled Salmon", date: "2024-01-11", eaten: [3, 4] },
  { id: 6, meal: "Pizza Margherita", date: "2024-01-10", eaten: [1, 2, 3] },
  { id: 7, meal: "Roast Chicken", date: "2024-01-09", eaten: [2, 4] },
  { id: 8, meal: "Pad Thai", date: "2024-01-08", eaten: [1, 3, 4] },
];

const mockMeals = [
  "Spaghetti Carbonara",
  "Chicken Tikka Masala",
  "Caesar Salad",
  "Beef Tacos",
  "Grilled Salmon",
  "Pizza Margherita",
  "Roast Chicken",
  "Pad Thai",
  "Greek Salad",
  "Mushroom Risotto",
];

const mockMembers = [
  { id: 1, name: "Alice", avatar: "A" },
  { id: 2, name: "Bob", avatar: "B" },
  { id: 3, name: "Charlie", avatar: "C" },
  { id: 4, name: "Diana", avatar: "D" },
];

export default function HistoryPage() {
  const [history, setHistory] = useState(mockHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredHistory = history.filter((item) =>
    item.meal.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleMember = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const addMealToHistory = () => {
    if (selectedMeal && selectedMembers.length > 0) {
      const newEntry = {
        id: history.length + 1,
        meal: selectedMeal,
        date: new Date().toISOString().split("T")[0] ?? "",
        eaten: selectedMembers,
      };
      setHistory([newEntry, ...history]);
      setSelectedMeal("");
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
          <p>Track what you've eaten and when</p>
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
                Add a meal to today's history
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a meal" />
                </SelectTrigger>
                <SelectContent>
                  {mockMeals.map((meal) => (
                    <SelectItem key={meal} value={meal}>
                      {meal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <p className="mb-2 font-medium">Select Members:</p>
                <div className="flex flex-wrap gap-2">
                  {mockMembers.map((member) => {
                    const isSelected = selectedMembers.includes(member.id);
                    return (
                      <Button
                        key={member.id}
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => toggleMember(member.id)}
                        className="h-8 w-8 rounded-full p-0"
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          member.avatar
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  addMealToHistory();
                  setIsDialogOpen(false);
                }}
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
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{item.meal}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(item.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.eaten.length > 0 ? (
                    item.eaten.map((memberId) => {
                      const member = mockMembers.find((m) => m.id === memberId);
                      return (
                        <Button
                          key={memberId}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 rounded-full p-0"
                        >
                          {member?.avatar}
                        </Button>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-400">No members</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
