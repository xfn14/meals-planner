import { db } from "@/server/db";
import { meals } from "@/server/db/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
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

  const authorIds = [...new Set(data.map((meal) => meal.authorId))];

  const client = await clerkClient();
  const usersResponse = await client.users.getUserList({
    userId: authorIds,
  });

  const users = usersResponse.data ?? [];

  const userMap = new Map(
    users.map((user) => [user.id, `${user.firstName} ${user.lastName}`]),
  );

  const mealsWithAuthorNames = data.map((meal) => ({
    ...meal,
    authorId: userMap.get(meal.authorId) ?? "Unknown",
  }));

  return NextResponse.json(mealsWithAuthorNames);
}

export async function POST(req: Request) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
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
