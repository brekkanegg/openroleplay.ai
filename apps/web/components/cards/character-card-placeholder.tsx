import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/src/components";
import { AspectRatio } from "@repo/ui/src/components/aspect-ratio";

const CharacterCardPlaceholder = (props: {}) => {
  return (
    <AspectRatio
      ratio={1 / 1.75}
      className="group w-full h-full hover:-translate-y-1 duration-200 shadow hover:shadow-lg place-content-center rounded-lg"
    >
      <Card className="rounded-lg p-2 w-full h-full flex items-end">
        <div className="object-cover absolute w-full h-full rounded-lg left-0 top-0 pointer-events-none bg-muted" />
      </Card>
    </AspectRatio>
  );
};

export default CharacterCardPlaceholder;
