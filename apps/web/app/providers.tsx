"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
