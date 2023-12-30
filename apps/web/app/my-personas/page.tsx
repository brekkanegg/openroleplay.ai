"use client";

import { useConvexAuth } from "convex/react";
import { SignIn } from "@clerk/nextjs";
import { MyPersonas } from "../../components/personas/my-personas";

export default function Page(): JSX.Element {
  const { isAuthenticated } = useConvexAuth();
  return (
    <div className="w-full h-[100vh] max-w-screen-xl flex flex-col justify-self-start">
      {isAuthenticated ? (
        <MyPersonas />
      ) : (
        <div className="w-full h-full items-start justify-center flex py-32">
          <SignIn />
        </div>
      )}
    </div>
  );
}
