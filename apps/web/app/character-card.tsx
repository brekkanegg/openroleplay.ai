import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/src/components";
import { AspectRatio } from "@repo/ui/src/components/aspect-ratio";
import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { nFormatter } from "./lib/utils";

const CharacterCard = (props: {
  id: string;
  name: any;
  numChats: number;
  cardImageUrl?: string;
  description: any;
}) => {
  return (
    <AspectRatio
      ratio={1 / 1.75}
      className="group w-full h-full hover:-translate-y-1 duration-200 shadow hover:shadow-lg place-content-center rounded-lg"
    >
      <Link href={`/character/${props?.id}`}>
        <Card className="rounded-lg p-2 w-full h-full flex items-end">
          <CardHeader className="relative w-full p-4 z-[2]">
            <div className="bg-gradient-to-b from-transparent via-black/60 to-black absolute -left-2 -bottom-2 w-[calc(100%+16px)] h-[calc(100%+2rem)] rounded-b-lg z-0" />
            <CardTitle className="text-white text-lg line-clamp-1 select-none group-hover:opacity-80 duration-200 z-[3] flex justify-between">
              <div className="w-[80%] truncate">{props.name}</div>
              <div className="text-white text-xs rounded-full group-hover:opacity-80 duration-200 z-[3] flex gap-1 items-center">
                <MessagesSquare className="w-4 h-4 aspect-square" />
                {nFormatter(props.numChats)}
              </div>
            </CardTitle>

            <CardDescription className="text-white select-none text-xs line-clamp-3 group-hover:opacity-80 duration-200 z-[3]">
              {props.description}
            </CardDescription>
          </CardHeader>
          {props.cardImageUrl && (
            <Image
              src={props.cardImageUrl}
              alt={""}
              width={300}
              height={525}
              quality={75}
              className="object-cover absolute w-full h-full rounded-lg left-0 top-0 pointer-events-none z-[1]"
            />
          )}
        </Card>
      </Link>
    </AspectRatio>
  );
};

export default CharacterCard;
