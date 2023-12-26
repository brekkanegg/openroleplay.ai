import { Card, CardDescription, CardHeader, CardTitle } from ".";
import { AspectRatio } from "./aspect-ratio";

const CharacterCard = (props: {
  name: any;
  cardImageUrl?: string;
  description: any;
}) => {
  console.log("props::", props);
  return (
    <AspectRatio ratio={1 / 1.75}>
      <Card className="rounded-lg p-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] flex items-end ring ring-black/10 hover:shadow-lg duration-200">
        <CardHeader className="relative w-full">
          <div className="bg-gradient-to-b from-transparent to-black/75 absolute -left-2 -bottom-2 w-[calc(100%+16px)] h-[calc(100%+2rem)] rounded-b-lg" />
          <CardTitle className="text-white text-xl select-none line-clamp-1 z-[1]">
            {props.name}
          </CardTitle>
          <CardDescription className="text-white select-none line-clamp-3 z-[1]">
            {props.description}
          </CardDescription>
        </CardHeader>
        {props.cardImageUrl && (
          <img
            src={props.cardImageUrl}
            alt={""}
            className="object-cover absolute w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-lg left-0 top-0 pointer-events-none"
          />
        )}
      </Card>
    </AspectRatio>
  );
};

export default CharacterCard;
