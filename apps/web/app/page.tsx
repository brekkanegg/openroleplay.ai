"use client";

import Discover from "../components/characters/discover";
import useStoreUserEffect from "./lib/hooks/use-store-user-effect";

export default function Page(): JSX.Element {
  useStoreUserEffect();
  return (
    <div className="w-full h-full pb-8 lg:pr-8">
      <Discover />
    </div>
  );
}
