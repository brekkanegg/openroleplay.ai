import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import CharacterCard from "./character-card";
import CharacterCardPlaceholder from "./character-card-placeholder";

const Characters = () => {
  const characters = useQuery(api.characters.list);
  return (
    <div className="px-4 2xl:px-0 flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-4">
      {characters
        ? characters.map(
            (character) =>
              character.name && (
                <CharacterCard
                  id={character._id}
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
