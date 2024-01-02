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

  const modelData = {
    mixtral: {
      src: "/models/mistral.png",
      alt: "Company logo of Mistral AI",
    },
    mistral: {
      src: "/models/mistral.png",
      alt: "Company logo of Mistral AI",
    },
    pplx: {
      src: "/models/perplexity.png",
      alt: "Company logo of Perplexity AI",
    },
    perplexity: {
      src: "/models/perplexity.png",
      alt: "Company logo of Perplexity AI",
    },
    openai: {
      src: "/models/openai.png",
      alt: "Company logo of Open AI",
    },
    gpt: {
      src: "/models/openai.png",
      alt: "Company logo of Open AI",
    },
  };

  const modelCompany = model.split("-")[0];
  const { src, alt } = modelData[modelCompany as keyof typeof modelData] || {
    src: null,
    alt: null,
  };

  return (
    <Badge className="flex gap-1 w-fit group/badge" variant="model">
      {src && (
        <Image
          src={src}
          width={32}
          height={32}
          className="w-4 h-4 p-0.5"
          alt={alt}
        />
      )}
      {!src && <Sparkles className="w-4 h-4 p-0.5 text-primary-foreground" />}
      <span className="hidden group-hover/badge:inline">{model}</span>
      {crystalUnit}
    </Badge>
  );
};

export default ModelBadge;
