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

export default function Page({ params }: { params: { id: string } }) {
  const data = useQuery(api.characters.get, {
    id: params.id as Id<"characters">,
  });
  return (
    <div className="w-full h-[80vh] max-w-screen-xl flex flex-col justify-self-start">
      <Card className="w-full shadow-none lg:shadow-xl border-transparent lg:border-border flex lg:flex-row flex-col">
        <CardHeader className="lg:border-r border-b lg:w-96">
          <CardTitle>{data?.name}</CardTitle>
          <p className="text-lg">{data?.description}</p>
        </CardHeader>
        <CardContent className="p-6">asdf</CardContent>
      </Card>
    </div>
  );
}
