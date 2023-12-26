"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/src/components";
import Image from "next/image";

export default function Page({ params }: { params: { id: string } }) {
  const data = useQuery(api.characters.get, {
    id: params.id as Id<"characters">,
  });
  return (
    <div className="w-full h-[80vh] max-w-screen-xl flex flex-col justify-self-start">
      <Card className="w-full shadow-none lg:shadow-xl border-transparent lg:border-border flex lg:flex-row flex-col">
        <CardHeader className="border-b lg:border-b-0 lg:border-r lg:w-96 lg:h-[42rem] relative justify-end">
          {data?.cardImageUrl && (
            <Image
              src={data.cardImageUrl}
              alt={`Character card of ${data?.name}`}
              width={300}
              height={525}
              quality={75}
              className="object-cover absolute w-full h-full lg:rounded-l-lg left-0 top-0 pointer-events-none"
            />
          )}
          <div className="bg-gradient-to-b from-transparent to-black/75 absolute -left-0 -bottom-0 w-full h-full lg:rounded-b-lg" />
          <CardTitle className="text-white text-xl z-[1]">
            {data?.name}
          </CardTitle>
          <p className="text-white z-[1] line-clamp-5">{data?.description}</p>
        </CardHeader>
        <CardContent className="p-6">asdf</CardContent>
      </Card>
    </div>
  );
}
