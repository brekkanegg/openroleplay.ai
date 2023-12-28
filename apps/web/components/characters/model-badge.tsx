import { Badge } from "@repo/ui/src/components/badge";
import Image from "next/image";

const ModelBadge = ({ modelName }: { modelName: string }) => {
  const defaultModelName = modelName ? modelName : "gpt-3.5-turbo-1106";
  switch (modelName) {
    case "mixtral-8x7b-instruct":
    case "mistral-7b-instruct":
      return (
        <Badge className="flex gap-2 w-fit" variant="model">
          <Image
            src="/models/mistral.png"
            width={32}
            height={32}
            className="w-4 h-4"
            alt="Company logo of Mistral AI"
          />
          {modelName}
        </Badge>
      );
    case "pplx-7b-online":
      return (
        <Badge className="flex gap-2 w-fit" variant="model">
          <Image
            src="/models/perplexity.png"
            width={32}
            height={32}
            className="w-4 h-4"
            alt="Company logo of Perplexity AI"
          />
          {modelName}
        </Badge>
      );
    default:
      return (
        <Badge className="flex gap-2 w-fit" variant="model">
          <Image
            src="/models/openai.png"
            width={32}
            height={32}
            className="w-4 h-4"
            alt="Company logo of Open AI"
          />
          {defaultModelName}
        </Badge>
      );
  }
};

export default ModelBadge;
