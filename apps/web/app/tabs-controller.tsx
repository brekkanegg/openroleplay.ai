"use client";
import {
  CircleUserRound,
  Home,
  MessageSquare,
  Plus,
  Store,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import Link from "next/link";

function TabsController() {
  const pathname = usePathname();
  const getFirstDirectory = (urlString: string): string =>
    `/${new URL(urlString, "http://example.com").pathname.split("/")[1] || ""}`;

  return (
    <Tabs value={getFirstDirectory(pathname)}>
      <TabsList className="w-full lg:w-40 lg:rounded-none lg:justify-start h-16 lg:h-full right-0 flex lg:flex-col gap-2 fixed lg:static bottom-0 mx-auto left-0 z-20 rounded-none rounded-t-lg border lg:bg-transparent lg:shadow-none lg:border-none lg:items-start shadow-t-2xl bg-background/90 backdrop-blur-md backdrop-saturate-150">
        <Link href="/">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center lg:items-start lg:flex-row"
            value="/"
          >
            <Home className="w-5 h-5 p-1" />
            Discover
          </TabsTrigger>
        </Link>
        <Link href="/chats">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center lg:items-start lg:flex-row"
            value="/chats"
          >
            <MessageSquare className="w-5 h-5 p-1" />
            Chats
          </TabsTrigger>
        </Link>
        <Link href="/my-characters">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center lg:items-start lg:flex-row"
            value="/my-characters"
          >
            <Plus className="w-5 h-5 p-1" />
            <span className="hidden lg:inline">My </span>Characters
          </TabsTrigger>
        </Link>
        <Link href="/my-personas">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center lg:items-start lg:flex-row"
            value="/my-personas"
          >
            <CircleUserRound className="w-5 h-5 p-1" />
            <span className="hidden lg:inline">My </span>Personas
          </TabsTrigger>
        </Link>
        <Link href="/shop">
          <TabsTrigger
            className="w-full rounded-full lg:flex gap-0.5 flex-col items-center lg:items-start lg:flex-row hidden"
            value="/shop"
          >
            <Store className="w-5 h-5 p-1" />
            Shop
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}

export default TabsController;
