import CharacterCard from "@repo/ui/src/components/character-card";
import CharacterCardPlaceholder from "@repo/ui/src/components/character-card-placeholder";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const Characters = () => {
  const characters = useQuery(api.characters.list);
  return (
    <div className="pl-8 pr-4 xl:px-0 flex flex-col  sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
      {characters
        ? characters.map(
            (character) =>
              character.name && (
                <CharacterCard
                  key={character._id}
                  name={character.name}
                  cardImageUrl={character.cardImageUrl as string}
                  description={character.description}
                />
              )
          )
        : Array.from({ length: 12 }).map((_, index) => (
            <CharacterCardPlaceholder key={index} />
          ))}
    </div>
  );
};

export default Characters;
