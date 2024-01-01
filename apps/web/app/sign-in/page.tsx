"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-self-start">
      <div className="w-full h-full items-start justify-center flex py-32">
        <SignIn />
      </div>
    </div>
  );
}
