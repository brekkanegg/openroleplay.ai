import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TooltipContent,
} from "@repo/ui/src/components";
import { InfoTooltip } from "@repo/ui/src/components/hybrid-tooltip";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CharacterCardPlaceholder from "../cards/character-card-placeholder";
import { AspectRatio } from "@repo/ui/src/components/aspect-ratio";
import { Plus } from "lucide-react";
import { useState } from "react";
import PersonaForm from "./persona-form";
import PersonaCard from "../cards/persona-card";

const NewPersona = ({ onClick }: { onClick: any }) => {
  return (
    <AspectRatio
      ratio={1 / 1.75}
      className="group w-full h-full hover:-translate-y-1 duration-200 border border-dashed hover:shadow-lg place-content-center rounded-lg"
      role="button"
      onClick={onClick}
    >
      <Card className="rounded-lg p-2 w-full h-full flex items-center justify-center border-none gap-2">
        <Plus /> Create persona
      </Card>
    </AspectRatio>
  );
};

export function MyPersonas() {
  const allPersonas = useQuery(api.personas.listMy) || [];
  const personas = allPersonas.filter((persona) => persona.name);
  const [draftPersona, setDraftPersona] = useState(false) as any;
  return (
    <>
      {draftPersona ? (
        <PersonaForm
          id={draftPersona?._id}
          name={draftPersona?.name}
          description={draftPersona?.description}
          cardImageUrl={draftPersona?.cardImageUrl}
          isEdit={draftPersona === true ? false : true}
          isPrivate={draftPersona.isPrivate}
          onClickGoBack={() => setDraftPersona(false)}
        />
      ) : (
        <Card className="w-full h-full shadow-none lg:shadow-xl border-transparent lg:border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              My personas
              <InfoTooltip
                content={
                  <TooltipContent
                    title={
                      "You can be anyone you want to be. By updating your profile settings with specific personality traits, preferences, and physical characteristics, your interactions with characters become more personalized and immersive. Whether you want to explore new identities, immerse yourself in your favorite fictional stories, or simply add a creative twist to your conversations, Personas are the way to go."
                    }
                  />
                }
              />
            </CardTitle>

            <CardDescription>Create and customize personas.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-4">
            <NewPersona onClick={() => setDraftPersona(true)} />
            {personas
              ? personas.map(
                  (persona) =>
                    persona.name && (
                      <div className="relative">
                        <Button
                          className="absolute z-[2] right-4 top-4 h-8 rounded-full"
                          variant="outline"
                          onClick={() => setDraftPersona(persona)}
                        >
                          Edit
                        </Button>
                        <PersonaCard
                          id={persona._id}
                          key={persona._id}
                          name={persona.name}
                          cardImageUrl={persona.cardImageUrl as string}
                          description={persona.description}
                        />
                      </div>
                    )
                )
              : Array.from({ length: 12 }).map((_, index) => (
                  <CharacterCardPlaceholder key={index} />
                ))}
            {Array.from({ length: 10 - personas?.length - 1 }).map(
              (_, index) => (
                <CharacterCardPlaceholder key={index} />
              )
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
