"use client";

import Link from "next/link";
import TextLogo from "@repo/ui/src/components/text-logo";
import { Badge } from "@repo/ui/src/components/badge";
import useScroll from "@repo/ui/src/hooks/use-scroll";
import UserDropdown from "./user-dropdown";
import { Button, Tooltip } from "@repo/ui/src/components";
import { SignedOut } from "@clerk/nextjs";

export default function NavBar({}: {}) {
  const scrolled = useScroll(50);

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
            <Tooltip content="Star openroleplay.ai on GitHub">
              <Link
                className="text-muted-foreground text-base sm:flex hidden hover:opacity-50 gap-2 items-center"
                href="/star"
              >
                opensource ai characters <Badge>alpha</Badge>
              </Link>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <UserDropdown />
            <SignedOut>
              <Link href="/sign-in">
                <Button className="rounded-full hidden md:block">Log in</Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </>
  );
}
