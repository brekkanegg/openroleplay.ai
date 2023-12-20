"use client";
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
        <TabsList className="w-full grid grid-cols-2 fixed bottom-0 mx-auto left-0 ">
          <TabsTrigger className="w-full" value="characters">
            Characters
          </TabsTrigger>
          <TabsTrigger className="w-full" value="chats">
            Chats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="characters">
          <Slider data={data} activeSlide={2} />
        </TabsContent>
        <TabsContent value="chats">
          <Slider data={data} activeSlide={2} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
