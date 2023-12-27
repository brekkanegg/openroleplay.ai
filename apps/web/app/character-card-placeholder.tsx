import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/src/components";
import { AspectRatio } from "@repo/ui/src/components/aspect-ratio";
import Image from "next/image";

const CharacterCardPlaceholder = (props: {}) => {
  return (
    <AspectRatio
      ratio={1 / 1.75}
      className="group w-full h-full hover:-translate-y-1 duration-200 shadow hover:shadow-lg place-content-center rounded-lg"
    >
      <Card className="rounded-lg p-2 w-full h-full flex items-end">
        <CardHeader className="relative w-full p-4">
          <div className="bg-gradient-to-b from-transparent to-black/75 absolute -left-2 -bottom-2 w-[calc(100%+16px)] h-[calc(100%+2rem)] rounded-b-lg" />
          <CardTitle className="bg-gray-300 rounded-md text-gray-300 text-xl select-none line-clamp-1 z-[1] group-hover:opacity-80 duration-200">
            Loading...
          </CardTitle>
          <CardDescription className="bg-gray-300 text-gray-300 rounded-md select-none line-clamp-3 z-[1] group-hover:opacity-80 duration-200">
            Loading...
          </CardDescription>
        </CardHeader>
        <div className="object-cover absolute w-full h-full rounded-lg left-0 top-0 pointer-events-none bg-gray-100" />
      </Card>
    </AspectRatio>
  );
};

export default CharacterCardPlaceholder;
