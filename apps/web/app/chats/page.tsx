"use client";

import { useConvexAuth } from "convex/react";
import { SignIn, useUser } from "@clerk/nextjs";
import Chats from "../../components/chats/chats";

export default function Page(): JSX.Element {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  return (
    <div className="w-full h-[100vh] flex flex-col justify-self-start lg:pr-8">
      {isAuthenticated ? (
        <Chats />
      ) : (
        <div className="w-full h-full items-start justify-center flex py-32">
          {!user && <SignIn />}
        </div>
      )}
    </div>
  );
}
