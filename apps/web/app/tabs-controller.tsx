"use client";
import { CircleUserRound, Home, MessageSquare, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@repo/ui/src/components/tabs";
import { useEffect, useState } from "react";
import Chats from "../components/chats/chats";
import Characters from "../components/characters/characters";
import { useConvexAuth } from "convex/react";
import { SignIn } from "@clerk/nextjs";
import { MyCharacters } from "../components/characters/my-characters";
import { MyPersonas } from "../components/personas/my-personas";

function TabsController() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  const initialTab =
    typeof searchParams.get("tab") === "string"
      ? searchParams.get("tab")
      : "discover";
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: any) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(pathname + "?" + params.toString());
  };

  useEffect(() => {
    setActiveTab(searchParams.get("tab") || initialTab);
  }, [searchParams.get("tab")]);

  return (
    <Tabs
      value={Array.isArray(activeTab) ? activeTab[0] : activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList className="w-[95%] lg:w-[50%] h-16 right-0 flex gap-2 fixed bottom-4 lg:bottom-12 mx-auto left-0 z-10 rounded-full border ring ring-muted">
        <TabsTrigger
          className="w-full rounded-full flex gap-0.5 flex-col items-center bg-muted"
          value="discover"
        >
          <Home className="w-5 h-5 p-1" />
          Discover
        </TabsTrigger>
        <TabsTrigger
          className="w-full rounded-full flex gap-0.5 flex-col items-center"
          value="chats"
        >
          <MessageSquare className="w-5 h-5 p-1" />
          Chats
        </TabsTrigger>
        <TabsTrigger
          className="w-full rounded-full flex gap-0.5 flex-col items-center"
          value="my-characters"
        >
          <Plus className="w-5 h-5 p-1" />
          My characters
        </TabsTrigger>
        <TabsTrigger
          className="w-full rounded-full flex gap-0.5 flex-col items-center"
          value="my-personas"
        >
          <CircleUserRound className="w-5 h-5 p-1" />
          My personas
        </TabsTrigger>
      </TabsList>
      <TabsContent value="discover" className="pb-32">
        <Characters />
      </TabsContent>
      <TabsContent
        value="my-characters"
        className="w-[100vw] min-h-fit lg:h-[100vh] max-w-screen-xl"
      >
        {isAuthenticated ? (
          <MyCharacters />
        ) : (
          <div className="w-full h-full items-start justify-center flex py-32">
            <SignIn />
          </div>
        )}
      </TabsContent>
      <TabsContent
        value="chats"
        className="w-[100vw] min-h-fit lg:h-[100vh] max-w-screen-xl"
      >
        {isAuthenticated ? (
          <Chats />
        ) : (
          <div className="w-full h-full items-start justify-center flex py-32">
            <SignIn />
          </div>
        )}
      </TabsContent>
      <TabsContent
        value="my-personas"
        className="w-[100vw] min-h-fit lg:h-[100vh] max-w-screen-xl"
      >
        {isAuthenticated ? (
          <MyPersonas />
        ) : (
          <div className="w-full h-full items-start justify-center flex py-32">
            <SignIn />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default TabsController;
