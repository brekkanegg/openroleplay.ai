"use client";

import { useConvexAuth } from "convex/react";
import { MyCharacters } from "../../components/characters/my-characters";
import { SignIn } from "@clerk/nextjs";

export default function Page(): JSX.Element {
  const { isAuthenticated } = useConvexAuth();
  return (
    <div className="w-full h-[100vh] max-w-screen-xl flex flex-col justify-self-start">
      {isAuthenticated ? (
        <MyCharacters />
      ) : (
        <div className="w-full h-full items-start justify-center flex py-32">
          <SignIn />
        </div>
      )}
    </div>
  );
}
