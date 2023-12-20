"use client";

import Link from "next/link";
import TextLogo from "@repo/ui/src/components/text-logo";
import useScroll from "@repo/ui/src/hooks/use-scroll";

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
          <Link
            href="/"
            className="flex text-2xl font-display gap-4 items-center"
          >
            <TextLogo />
            <div className="text-muted-foreground text-base sm:block hidden">
              opensource ai characters
            </div>
          </Link>
          {/* <div>
            <UserDropdown />
          </div> */}
        </div>
      </div>
    </>
  );
}
