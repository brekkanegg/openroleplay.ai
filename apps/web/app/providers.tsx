"use client";
import { ThemeProvider } from "next-themes";
import { AuthenticationProvider } from "./authentication-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem={true} attribute="class">
      <AuthenticationProvider>{children}</AuthenticationProvider>
    </ThemeProvider>
  );
}
