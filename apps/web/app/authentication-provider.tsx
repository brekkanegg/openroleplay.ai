import { Toaster } from "@repo/ui/src/components/toaster";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export function AuthenticationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={
        process.env.NODE_ENV === "development"
          ? "pk_test_bmF0aW9uYWwtbW9zcXVpdG8tMjUuY2xlcmsuYWNjb3VudHMuZGV2JA"
          : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      }
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
