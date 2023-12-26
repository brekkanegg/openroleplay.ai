"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <ClerkProvider
        publishableKey={
          "pk_test_bmF0aW9uYWwtbW9zcXVpdG8tMjUuY2xlcmsuYWNjb3VudHMuZGV2JA"
        }
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Toaster />
          <TooltipProvider>{children}</TooltipProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ThemeProvider>
  );
}
