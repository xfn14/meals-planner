# Meals Planner 🍽️

A full-stack meal tracking and planning application built with Next.js, TypeScript, Drizzle ORM, Clerk for authentication, and Vercel for deployment.

## 📝 Features

- ✅ **User Authentication** via Clerk
- ✅ **Organization Support** (for multiple user groups)
- ✅ **Meal Management** — create, list, and manage meals
- ✅ **Meal History Tracking** — mark meals as eaten by selected members
- ✅ **Meal Recommendations** — based on user preferences
- ✅ **Member Management** within organizations
- ✅ Responsive UI using **TailwindCSS** & **shadcn/ui components**
- ✅ API Routes with full type-safety using **Drizzle ORM**

## 🏗️ Tech Stack

| Technology      | Usage                                    |
| --------------- | ---------------------------------------- |
| **Next.js**     | React framework for SSR & App Router     |
| **TypeScript**  | Type-safe development                    |
| **Drizzle ORM** | Database schema & query building         |
| **PostgreSQL**  | Database (via Vercel or Neon)            |
| **Clerk**       | Authentication & Organization Management |
| **TailwindCSS** | Utility-first CSS styling                |
| **shadcn/ui**   | Pre-built, customizable UI components    |
| **Vercel**      | Deployment & DNS Management              |

## 📦 Installation

```bash
git clone https://github.com/yourusername/meals-planner.git
cd meals-planner
bun install
```

### Create a `.env.local` file with:

```dotenv
DATABASE_URL=your_postgres_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Populate the database:

```bash
bun run db:push
```

## 🚀 Running Locally

```bash
bun run dev
```

## 📦 Building for Production

```bash
bun run build
bun run start
```
