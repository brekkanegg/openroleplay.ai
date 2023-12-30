"use client";

import { useConvexAuth } from "convex/react";
import { SignIn } from "@clerk/nextjs";
import Chats from "../../components/chats/chats";

export default function Page(): JSX.Element {
  const { isAuthenticated } = useConvexAuth();
  return (
    <div className="w-full h-[100vh] max-w-screen-xl flex flex-col justify-self-start">
      {isAuthenticated ? (
        <Chats />
      ) : (
        <div className="w-full h-full items-start justify-center flex py-32">
          <SignIn />
        </div>
      )}
    </div>
  );
}
