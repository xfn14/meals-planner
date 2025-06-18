import { db } from "@/server/db";
import { likes, meals } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { mealId: string } },
) {
  const { userId, orgId } = await auth();
  const mealId = parseInt(await params.mealId, 10);

  if (!userId || !orgId || isNaN(mealId)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

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

  const existingLikes = await db
    .select()
    .from(likes)
    .where(and(eq(likes.mealId, mealId), eq(likes.userId, userId)))
    .limit(1);

  const existingLike = existingLikes[0];

  if (existingLike) {
    await db.delete(likes).where(eq(likes.id, existingLike.id));
  } else {
    await db.insert(likes).values({ mealId, userId });
  }

  return NextResponse.json({ success: !existingLike });
}
