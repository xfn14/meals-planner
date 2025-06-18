import { db } from "@/server/db";
import { mealEatenBy, mealHistory, meals } from "@/server/db/schema";
import type { GroupedHistory } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await db
    .select()
    .from(mealHistory)
    .leftJoin(meals, eq(mealHistory.mealId, meals.id))
    .leftJoin(mealEatenBy, eq(mealEatenBy.mealHistoryId, mealHistory.id))
    .where(eq(meals.orgId, orgId));

  const grouped = history.reduce((acc: GroupedHistory, item) => {
    const id = item.meal_history.id;

    acc[id] ??= acc[id] = {
      id,
      meal: item.meals?.name,
      date: item.meal_history.createdAt,
      eaten: [],
    };

    if (item.meal_eaten_by) {
      acc[id].eaten.push(item.meal_eaten_by.userId);
    }
    return acc;
  }, {} as GroupedHistory);

  return NextResponse.json(Object.values(grouped));
}

export async function POST(req: Request) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mealId, userIds } = (await req.json()) as {
    mealId: number;
    userIds: string[];
  };

  const [meal] = await db
    .select()
    .from(meals)
    .where(eq(meals.id, mealId))
    .limit(1);

  if (!meal || meal.orgId !== orgId) {
    return NextResponse.json(
      { success: false, error: "Meal not found." },
      { status: 404 },
    );
  }

  const [historyRow] = await db
    .insert(mealHistory)
    .values({ mealId })
    .returning();

  if (!historyRow) {
    return NextResponse.json(
      { success: false, error: "Failed to create meal history." },
      { status: 500 },
    );
  }

  await db.insert(mealEatenBy).values(
    userIds.map((userId: string) => ({
      mealHistoryId: historyRow.id,
      userId,
    })),
  );

  return NextResponse.json({ success: true });
}
