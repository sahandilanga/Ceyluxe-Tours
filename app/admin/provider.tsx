"use client";

import { ClerkProvider } from "@clerk/react";
import type { ReactNode } from "react";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  if (!publishableKey || publishableKey.includes("YOUR_KEY")) {
    return (
      <main className="admin-setup-message">
        <p>Admin setup</p>
        <h1>Clerk authentication is not configured yet.</h1>
        <span>
          Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to the frontend environment and
          restart the website.
        </span>
      </main>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      afterSignOutUrl="/"
      signInUrl="/admin"
      signInFallbackRedirectUrl="/admin"
    >
      {children}
    </ClerkProvider>
  );
}
