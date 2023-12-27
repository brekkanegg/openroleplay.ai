"use client";

import useStoreUserEffect from "./lib/hooks/use-store-user-effect";
import TabsController from "./tabs-controller";

export default function Page(): JSX.Element {
  useStoreUserEffect();
  return (
    <div className="w-full h-[80vh] max-w-screen-xl flex flex-col justify-self-start">
      <TabsController />
    </div>
  );
}
