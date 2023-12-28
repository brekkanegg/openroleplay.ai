import { Badge } from "@repo/ui/src/components/badge";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const ModelBadge = ({ modelName }: { modelName: string }) => {
  const model = modelName
    ? modelName.replace("accounts/fireworks/models/", "")
    : "gpt-3.5-turbo-1106";
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
        </Badge>
      );
    case "gpt-3.5-turbo-1106":
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
        </Badge>
      );
    default:
      return (
        <Badge className="flex gap-1 w-fit" variant="model">
          <Sparkles className="w-4 h-4 p-0.5 text-primary-foreground" />
          {model}
        </Badge>
      );
  }
};

export default ModelBadge;
