import { Badge } from "@repo/ui/src/components/badge";
import { useQuery } from "convex/react";
import { Sparkles } from "lucide-react";
import { Crystal } from "@repo/ui/src/components/icons";
import Image from "next/image";
import { api } from "../../convex/_generated/api";

const ModelBadge = ({
  modelName,
  showCredits,
}: {
  modelName: string;
  showCredits?: boolean;
}) => {
  const model = modelName
    ? modelName.replace("accounts/fireworks/models/", "")
    : "gpt-3.5-turbo-1106";
  const price = useQuery(api.crystals.price, { modelName: model });
  const crystalUnit = showCredits && price && (
    <div className="flex gap-[0.5]">
      /<Crystal className="w-4 h-4 p-0.5" />
      {`x ${price}`}
    </div>
  );
  switch (model) {
    case "mixtral-8x7b-instruct":
    case "mistral-7b-instruct":
      return (
        <Badge className="flex gap-1 w-fit" variant="model">
          <Image
            src="/models/mistral.png"
            width={32}
            height={32}
            className="w-4 h-4 p-0.5"
            alt="Company logo of Mistral AI"
          />
          {model}
          {crystalUnit}
        </Badge>
      );
    case "pplx-7b-online":
      return (
        <Badge className="flex gap-1 w-fit" variant="model">
          <Image
            src="/models/perplexity.png"
            width={32}
            height={32}
            className="w-4 h-4 p-0.5"
            alt="Company logo of Perplexity AI"
          />
          {model}
          {crystalUnit}
        </Badge>
      );
    case "gpt-3.5-turbo-1106":
    case "gpt-4-1106-preview":
      return (
        <Badge className="flex gap-1 w-fit" variant="model">
          <Image
            src="/models/openai.png"
            width={32}
            height={32}
            className="w-4 h-4 p-0.5"
            alt="Company logo of Open AI"
          />
          {model}
          {crystalUnit}
        </Badge>
      );
    default:
      return (
        <Badge className="flex gap-1 w-fit" variant="model">
          <Sparkles className="w-4 h-4 p-0.5 text-primary-foreground" />
          {model}
          {crystalUnit}
        </Badge>
      );
  }
};

export default ModelBadge;
