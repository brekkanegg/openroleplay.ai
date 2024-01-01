import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/src/components";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CharacterCardPlaceholder from "../cards/character-card-placeholder";
import CharacterCard from "../cards/character-card";
import { AspectRatio } from "@repo/ui/src/components/aspect-ratio";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CharacterForm from "./character-form";
import { InfoTooltip, TooltipContent } from "@repo/ui/src/components/tooltip";
import { useInView } from "framer-motion";

const NewCharacter = ({ onClick }: { onClick: any }) => {
  return (
    <AspectRatio
      ratio={1 / 1.75}
      className="group w-full h-full hover:-translate-y-1 duration-200 border border-dashed hover:shadow-lg place-content-center rounded-lg"
      role="button"
      onClick={onClick}
    >
      <Card className="rounded-lg p-2 w-full h-full flex items-center justify-center border-none gap-2">
        <Plus /> Create character
      </Card>
    </AspectRatio>
  );
};

export function MyCharacters() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.characters.listMy,
    {},
    { initialNumItems: 8 }
  );
  const allCharacters = results || [];
  const characters = allCharacters.filter((character) => character.name);
  const [draftCharacter, setDraftCharacter] = useState(false) as any;
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      loadMore(8);
    }
  }, [inView, loadMore]);
  return (
    <>
      {draftCharacter ? (
        <CharacterForm
          id={draftCharacter?._id}
          isEdit={draftCharacter === true ? false : true}
          draftModel={draftCharacter?.model}
          onClickGoBack={() => setDraftCharacter(false)}
        />
      ) : (
        <Card className="w-full h-full shadow-none lg:shadow-xl border-transparent lg:border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              My Characters
              <InfoTooltip
                content={
                  <TooltipContent
                    title={
                      "Create interactive characters using our tools. All characters on the home page were made this way."
                    }
                  />
                }
              />
            </CardTitle>
            <CardDescription>Create and customize characters.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-4">
            <NewCharacter onClick={() => setDraftCharacter(true)} />
            {characters
              ? characters.map(
                  (character) =>
                    character.name && (
                      <CharacterCard
                        id={character._id}
                        key={character._id}
                        name={character.name}
                        onEdit={() => setDraftCharacter(character)}
                        numChats={character.numChats as number}
                        cardImageUrl={character.cardImageUrl as string}
                        description={character.description}
                        isDraft={character.isDraft}
                        model={character.model}
                      />
                    )
                )
              : Array.from({ length: 12 }).map((_, index) => (
                  <CharacterCardPlaceholder key={index} />
                ))}
            {Array.from({ length: 10 - characters?.length - 1 }).map(
              (_, index) => (
                <CharacterCardPlaceholder key={index} />
              )
            )}
            <div ref={ref} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
