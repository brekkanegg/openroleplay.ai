import { CardDescription, CardHeader, CardTitle } from ".";

const CharacterCardContent = (props: { icon: any; title: any; desc: any }) => {
  return (
    <CardHeader className="relative">
      <div className="bg-gradient-to-b from-transparent to-black/50 absolute -left-2 -bottom-2 w-[calc(100%+16px)] h-full rounded-lg" />
      <CardTitle className="text-white select-none line-clamp-1">
        {props.title}
      </CardTitle>
      <CardDescription className="text-white select-none line-clamp-3">
        {props.desc}
      </CardDescription>
    </CardHeader>
  );
};

export default CharacterCardContent;
