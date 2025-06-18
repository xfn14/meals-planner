import { db } from "@/server/db";
import { likes, meals } from "@/server/db/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select({
      id: meals.id,
      name: meals.name,
      authorId: meals.authorId,
      createdAt: meals.createdAt,
    })
    .from(meals)
    .where(eq(meals.orgId, orgId));

  const mealIds = data.map((meal) => meal.id);
  const authorIds = [...new Set(data.map((meal) => meal.authorId))];

  const likesData = await db
    .select({
      mealId: likes.mealId,
      userId: likes.userId,
    })
    .from(likes)
    .where(inArray(likes.mealId, mealIds));

  const likeUserIds = [...new Set(likesData.map((like) => like.userId))];

  const userIdsToFetch = [...new Set([...authorIds, ...likeUserIds])];

  const client = await clerkClient();
  const usersResponse = await client.users.getUserList({
    userId: userIdsToFetch,
  });

  const users = usersResponse.data ?? [];

  const userMap = new Map(
    users.map((user) => [
      user.id,
      {
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
      },
    ]),
  );

  const mealsWithLikes = data.map((meal) => ({
    ...meal,
    authorName: userMap.get(meal.authorId)?.name ?? "Unknown",
    authorAvatar: userMap.get(meal.authorId)?.imageUrl ?? "Unknown",
    likes: likesData
      .filter((like) => like.mealId === meal.id)
      .map((like) => ({
        userId: like.userId,
        userName: userMap.get(like.userId)?.name ?? "Unknown",
        userAvatar: userMap.get(like.userId)?.imageUrl ?? "Unknown",
      })),
  }));

  return NextResponse.json(mealsWithLikes);
}

export async function POST(req: Request) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { name: string };
  const { name } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const existingMeal = await db
    .select()
    .from(meals)
    .where(and(eq(meals.name, name), eq(meals.orgId, orgId)))
    .limit(1);
  if (existingMeal.length > 0) {
    return NextResponse.json(
      { error: "Meal with this name already exists." },
      { status: 409 },
    );
  }

  const [newMeal] = await db
    .insert(meals)
    .values({
      name,
      authorId: userId,
      orgId,
    })
    .returning();

  return NextResponse.json(newMeal);
}
