import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/src/components";
import { AspectRatio } from "@repo/ui/src/components/aspect-ratio";
import { Badge } from "@repo/ui/src/components/badge";
import Image from "next/image";

const PersonaCard = (props: {
  id: string;
  name: any;
  cardImageUrl?: string;
  description: any;
  onEdit?: any;
  isDefault?: boolean;
}) => {
  return (
    <AspectRatio
      ratio={1 / 1.75}
      className="group w-full h-full hover:-translate-y-1 duration-200 shadow hover:shadow-lg place-content-center rounded-lg"
    >
      <Card className="rounded-lg p-2 w-full h-full flex items-end">
        {props.onEdit && (
          <Button
            className="absolute z-[3] right-4 top-4 h-8 rounded-full"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              props.onEdit();
            }}
          >
            Edit
          </Button>
        )}
        <CardHeader className="relative w-full p-4 z-[2]">
          {props.cardImageUrl && (
            <div className="bg-gradient-to-b from-transparent via-black/60 to-black absolute -left-2 -bottom-2 w-[calc(100%+16px)] h-[calc(100%+2rem)] rounded-b-lg" />
          )}
          <CardTitle
            className={`${
              props.cardImageUrl ? "text-white" : "text-black"
            } text-lg line-clamp-1 select-none group-hover:opacity-80 duration-200 z-[3] flex justify-between`}
          >
            <div className="w-[80%] truncate">{props.name}</div>
            {props.isDefault && <Badge>Default</Badge>}
          </CardTitle>
          <CardDescription
            className={`${
              props.cardImageUrl ? "text-white" : "text-black"
            } select-none text-xs line-clamp-3 group-hover:opacity-80 duration-200 z-[3]`}
          >
            {props.description}
          </CardDescription>
        </CardHeader>
        {props.cardImageUrl && (
          <Image
            src={props.cardImageUrl}
            alt={""}
            width={300}
            height={525}
            quality={60}
            className="object-cover absolute w-full h-full rounded-lg left-0 top-0 pointer-events-none z-[1]"
          />
        )}
      </Card>
    </AspectRatio>
  );
};

export default PersonaCard;
