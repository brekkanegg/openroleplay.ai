import { Card, CardDescription, CardHeader, CardTitle } from ".";
import { AspectRatio } from "./aspect-ratio";

const CharacterCardPlaceholder = () => {
  return (
    <AspectRatio ratio={1 / 1.75}>
      <Card className="rounded-lg p-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] shadow-lg flex items-end ring ring-black/10">
        <CardHeader className="relative w-full">
          <div className="bg-gradient-to-b from-transparent to-black/75 absolute -left-2 -bottom-2 w-[calc(100%+16px)] h-[calc(100%+2rem)] rounded-b-lg" />
          <CardTitle className="text-white select-none line-clamp-1 z-[1]">
            Loading...
          </CardTitle>
          <CardDescription className="text-white select-none line-clamp-3 z-[1]">
            Loading...
          </CardDescription>
        </CardHeader>
      </Card>
    </AspectRatio>
  );
};

export default CharacterCardPlaceholder;
