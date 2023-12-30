"use client";
import { CircleUserRound, Home, MessageSquare, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import Link from "next/link";

function TabsController() {
  const pathname = usePathname();
  const getFirstDirectory = (urlString: string): string =>
    `/${new URL(urlString, "http://example.com").pathname.split("/")[1] || ""}`;

  return (
    <Tabs value={getFirstDirectory(pathname)}>
      <TabsList className="w-full lg:w-[50%] h-16 right-0 flex gap-2 fixed bottom-0 lg:bottom-12 mx-auto left-0 z-10 rounded-none rounded-t-lg lg:rounded-full border lg:ring ring-muted">
        <Link href="/">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center"
            value="/"
          >
            <Home className="w-5 h-5 p-1" />
            Discover
          </TabsTrigger>
        </Link>
        <Link href="/chats">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center"
            value="/chats"
          >
            <MessageSquare className="w-5 h-5 p-1" />
            Chats
          </TabsTrigger>
        </Link>
        <Link href="/my-characters">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center"
            value="/my-characters"
          >
            <Plus className="w-5 h-5 p-1" />
            My characters
          </TabsTrigger>
        </Link>
        <Link href="/my-personas">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center"
            value="/my-personas"
          >
            <CircleUserRound className="w-5 h-5 p-1" />
            My personas
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}

export default TabsController;
