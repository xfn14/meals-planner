import { db } from "@/server/db";
import { likes, meals } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { mealId: string };
  const { mealId } = body;
  const parsedMealId = parseInt(mealId, 10);

  const { userId, orgId } = await auth();

  if (!userId || !orgId || isNaN(parsedMealId)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const [meal] = await db
    .select()
    .from(meals)
    .where(eq(meals.id, parsedMealId))
    .limit(1);

  if (!meal || meal.orgId !== orgId) {
    return NextResponse.json(
      { success: false, error: "Meal not found." },
      { status: 404 },
    );
  }

  const existingLikes = await db
    .select()
    .from(likes)
    .where(and(eq(likes.mealId, parsedMealId), eq(likes.userId, userId)))
    .limit(1);

  const existingLike = existingLikes[0];

  if (existingLike) {
    await db.delete(likes).where(eq(likes.id, existingLike.id));
  } else {
    await db.insert(likes).values({ mealId: parsedMealId, userId });
  }

  return NextResponse.json({ success: !existingLike });
}
