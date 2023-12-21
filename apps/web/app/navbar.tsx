"use client";

import Link from "next/link";
import TextLogo from "@repo/ui/src/components/text-logo";
import useScroll from "@repo/ui/src/hooks/use-scroll";
import { UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import UserDropdown from "./user-dropdown";
import { useAuth } from "@clerk/nextjs";

export default function NavBar({}: {}) {
  const scrolled = useScroll(50);
  const { isAuthenticated } = useConvexAuth();
  const { isSignedIn } = useAuth();

  console.log("isAuthenticated::", isAuthenticated);
  console.log("isSignedIn::", isSignedIn);

  return (
    <>
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-opacity`}
      >
        <div
          className={`mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between `}
        >
          <div className="flex text-2xl font-display gap-4 items-center">
            <Link href="/">
              <TextLogo />
            </Link>
            <a
              className="text-muted-foreground text-base sm:block hidden hover:opacity-50"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/Open-Roleplay-AI/OpenRoleplay/stargazers"
            >
              opensource ai characters
            </a>
          </div>

          <div>
            <UserDropdown />
          </div>
        </div>
      </div>
    </>
  );
}
