import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CharacterCard from "../cards/character-card";
import CharacterCardPlaceholder from "../cards/character-card-placeholder";
import Footer from "../../app/footer";

const Discover = () => {
  const allCharacters = useQuery(api.characters.list) || [];
  const characters = allCharacters.filter((character) => character.name);
  return (
    <>
      <div className="px-4 2xl:px-0 flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-4">
        {characters
          ? characters.map(
              (character) =>
                character.name && (
                  <CharacterCard
                    id={character._id}
                    key={character._id}
                    name={character.name}
                    numChats={character.numChats as number}
                    cardImageUrl={character.cardImageUrl as string}
                    description={character.description}
                    model={character.model}
                  />
                )
            )
          : Array.from({ length: 12 }).map((_, index) => (
              <CharacterCardPlaceholder key={index} />
            ))}
        {Array.from({ length: 10 - characters?.length }).map((_, index) => (
          <CharacterCardPlaceholder key={index} />
        ))}
      </div>
      <div className="pt-32">
        <Footer />
      </div>
    </>
  );
};

export default Discover;
