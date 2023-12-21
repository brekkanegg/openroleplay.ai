"use client";
import { CircleUserRound, Home, MessageSquare, Plus } from "lucide-react";
import Slider from "@repo/ui/src/components/slider";
import data from "@repo/ui/src/components/data";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@repo/ui/src/components/tabs";
import { useEffect, useState } from "react";
import Chats from "./chats";
import Create from "./create";
import Persona from "./persona";

export default function Page(): JSX.Element {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialTab =
    typeof searchParams.get("tab") === "string"
      ? searchParams.get("tab")
      : "characters";
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
    <div>
      <Tabs
        value={Array.isArray(activeTab) ? activeTab[0] : activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="w-[85%] lg:w-[50%] h-16 right-0 flex gap-2 fixed bottom-12 mx-auto left-0 z-10 rounded-full">
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center"
            value="characters"
          >
            <Home className="w-5 h-5 p-1" />
            Discover
          </TabsTrigger>
          <TabsTrigger
            className="w-full rounded-full flex gap-0.5 flex-col items-center"
            value="create"
          >
            <Plus className="w-5 h-5 p-1" />
            Create
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
            value="persona"
          >
            <CircleUserRound className="w-5 h-5 p-1" />
            Persona
          </TabsTrigger>
        </TabsList>
        <TabsContent value="characters">
          <Slider data={data} activeSlide={2} />
        </TabsContent>
        <TabsContent
          value="create"
          className="w-[100vw] h-60vh max-w-screen-xl"
        >
          <Create />
        </TabsContent>
        <TabsContent
          value="chats"
          className="w-[100vw] h-[60vh] max-w-screen-xl"
        >
          <Chats />
        </TabsContent>
        <TabsContent
          value="persona"
          className="w-[100vw] h-60vh max-w-screen-xl"
        >
          <Persona />
        </TabsContent>
      </Tabs>
    </div>
  );
}
