"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { History, Lightbulb, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "./clerk/user-button";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/theme-button";

export default function Navbar({ slug }: { slug?: string }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Group", href: `/group/${slug}`, icon: Users },
    { name: "History", href: `/group/${slug}/history`, icon: History },
    { name: "Recommend", href: `/group/${slug}/recommend`, icon: Lightbulb },
    { name: "Settings", href: `/group/${slug}/settings`, icon: Settings },
  ];

  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-primary text-lg font-bold">
          <span className="hidden md:flex">Meals Planner</span>
          <span className="md:hidden">MP</span>
        </Link>

        {slug && (
          <div className="flex gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:flex">{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />

        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
