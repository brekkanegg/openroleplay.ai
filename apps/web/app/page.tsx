"use client";

import Discover from "../components/characters/discover";
import useStoreUserEffect from "./lib/hooks/use-store-user-effect";

export default function Page(): JSX.Element {
  useStoreUserEffect();
  return (
    <div className="w-full h-[100vh] max-w-screen-xl flex flex-col justify-self-start">
      <Discover />
    </div>
  );
}
