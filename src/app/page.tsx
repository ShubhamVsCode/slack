"use client";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import UserButton from "@/features/auth/components/user-button";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      {isAuthenticated ? <h1>Authenticated</h1> : <h1>Not Authenticated</h1>}
      <UserButton />
    </main>
  );
}
