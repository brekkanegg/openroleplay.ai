"use client";

import { ReactElement, useState } from "react";
import Image from "next/image";
import { LogIn, LogOut, Menu, Star } from "lucide-react";
import { Discord } from "@repo/ui/src/components/social-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/src/components/popover";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";

type StyledLinkProps = {
  href: string;
  text: string;
  Icon: ReactElement; // This allows passing any React element as an icon
  onClick?: any;
};

type StyledButtonProps = {
  text: string;
  Icon: ReactElement; // This allows passing any React element as an icon
  onClick?: any;
};

const StyledLink: React.FC<StyledLinkProps> = ({
  href,
  text,
  Icon,
  onClick,
}) => {
  return (
    <Link
      href={href}
      className="relative flex w-full items-center justify-start space-x-2 rounded-md p-4 text-left text-sm transition-all duration-75 hover:bg-gray-100 sm:p-1"
      onClick={onClick}
    >
      {Icon}
      <p className="text-sm">{text}</p>
    </Link>
  );
};

export const StyledButton: React.FC<StyledButtonProps> = ({
  text,
  Icon,
  onClick,
}) => {
  return (
    <button
      className="relative flex w-full items-center justify-start space-x-2 rounded-md p-4 text-left text-sm transition-all duration-75 hover:bg-gray-100 sm:p-1"
      onClick={onClick}
    >
      {Icon}
      <p className="text-sm">{text}</p>
    </button>
  );
};

export default function UserDropdown() {
  const { user } = useUser();

  const [openPopover, setOpenPopover] = useState(false);
  const { signOut } = useClerk();

  return (
    <div className="relative inline-block text-left">
      <Popover
        open={openPopover}
        onOpenChange={() => setOpenPopover(!openPopover)}
      >
        <PopoverContent asChild>
          <div className="w-full rounded-lg bg-white p-4 sm:w-40 sm:p-1">
            {user && (
              <div className="p-2">
                {user?.firstName && (
                  <p className="truncate text-sm font-medium text-gray-900">
                    {`${user?.firstName} ${
                      user?.lastName ? user?.lastName : ""
                    }`}
                  </p>
                )}
                <p className="text-muted-foreground truncate text-sm">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            )}
            {user ? (
              <StyledButton
                text="Logout"
                Icon={<LogOut className="h-4 w-4 text-muted-foreground" />}
                onClick={() => {
                  setOpenPopover(false);
                  signOut();
                }}
              />
            ) : (
              <>
                <StyledLink
                  text="Login"
                  Icon={<LogIn className="h-4 w-4 text-muted-foreground" />}
                  onClick={() => {
                    setOpenPopover(false);
                  }}
                  href="/sign-in"
                />
              </>
            )}
            <StyledLink
              href="/star"
              text="Star on GitHub"
              Icon={<Star className="h-4 w-4 text-muted-foreground" />}
              onClick={() => setOpenPopover(false)}
            />
            <StyledLink
              href="/discord"
              text="Join Discord"
              Icon={<Discord className="h-4 w-4 text-muted-foreground" />}
              onClick={() => setOpenPopover(false)}
            />
          </div>
        </PopoverContent>
        <PopoverTrigger
          onClick={() => setOpenPopover(!openPopover)}
          className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-none outline-none transition-all duration-75 active:scale-95 sm:h-9 sm:w-9 ${
            user ? "border border-gray-300" : ""
          }`}
        >
          {user ? (
            <button
              onClick={() => setOpenPopover(!openPopover)}
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
            >
              <Image
                alt={user?.primaryEmailAddress?.emailAddress as string}
                src={
                  user?.imageUrl ||
                  `https://avatars.dicebear.com/api/micah/${
                    user?.primaryEmailAddress?.emailAddress as string
                  }.svg`
                }
                width={40}
                height={40}
              />
            </button>
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </PopoverTrigger>
      </Popover>
    </div>
  );
}
