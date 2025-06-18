import { db } from "@/server/db";
import { likes } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { mealId: string } },
) {
  const { userId } = await auth();
  const mealId = parseInt(await params.mealId, 10);

  if (!userId || isNaN(mealId)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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
