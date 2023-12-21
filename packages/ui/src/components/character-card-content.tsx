import { CardDescription, CardHeader, CardTitle } from ".";

const CharacterCardContent = (props: { icon: any; title: any; desc: any }) => {
  return (
    <CardHeader className="relative">
      <div className="bg-gradient-to-b from-transparent to-black/50 absolute -left-4 -bottom-4 w-[calc(100%+2rem)] h-full rounded-lg" />
      <CardTitle className="text-white line-clamp-1">{props.title}</CardTitle>
      <CardDescription className="text-white line-clamp-3">
        {props.desc}
      </CardDescription>
    </CardHeader>
  );
};

export default CharacterCardContent;
