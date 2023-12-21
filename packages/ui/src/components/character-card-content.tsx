const CharacterCardContent = (props: { icon: any; title: any; desc: any }) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-start">
      <h2>{props.title}</h2>
      <p>{props.desc}</p>
    </div>
  );
};

export default CharacterCardContent;
