"use client";
import React, { useState } from "react";
import { Button } from ".";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CharacterCardContent from "./character-card-content";

const CharacterSlider = (props: { activeSlide: any; data: any[] }) => {
  const [activeSlide, setactiveSlide] = useState(props.activeSlide);

  const next = () =>
    activeSlide < props.data.length - 1 && setactiveSlide(activeSlide + 1);

  const prev = () => activeSlide > 0 && setactiveSlide(activeSlide - 1);

  const getStyles = (index: number) => {
    if (activeSlide === index)
      return {
        opacity: 1,
        transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
        zIndex: 10,
      };
    else if (activeSlide - 1 === index)
      return {
        opacity: 1,
        transform: "translateX(-240px) translateZ(-400px) rotateY(35deg)",
        zIndex: 9,
      };
    else if (activeSlide + 1 === index)
      return {
        opacity: 1,
        transform: "translateX(240px) translateZ(-400px) rotateY(-35deg)",
        zIndex: 9,
      };
    else if (activeSlide - 2 === index)
      return {
        opacity: 1,
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        zIndex: 8,
      };
    else if (activeSlide + 2 === index)
      return {
        opacity: 1,
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 8,
      };
    else if (activeSlide - 3 === index)
      return {
        opacity: 1,
        transform: "translateX(-720px) translateZ(-600px) rotateY(35deg)",
        zIndex: 7,
      };
    else if (activeSlide + 3 === index)
      return {
        opacity: 1,
        transform: "translateX(720px) translateZ(-600px) rotateY(-35deg)",
        zIndex: 7,
      };
    else if (index < activeSlide - 3)
      return {
        opacity: 1,
        transform: "translateX(-720px) translateZ(-600px) rotateY(35deg)",
        zIndex: 6,
      };
    else if (index > activeSlide + 3)
      return {
        opacity: 1,
        transform: "translateX(720px) translateZ(-600px) rotateY(-35deg)",
        zIndex: 6,
      };
  };

  return (
    <>
      <Button
        className="hidden md:block fixed left-8 my-auto top-0 bottom-0 z-20 group"
        onClick={prev}
        variant="ghost"
      >
        <ChevronLeft className="text-muted-foreground group-hover:text-foreground" />
      </Button>
      <div
        style={{
          perspective: "2000px",
          transformStyle: "preserve-3d",
        }}
        className="relative w-[300px] h-[525px] my-0 mx-auto"
      >
        {props.data.map((item, i) => (
          <React.Fragment key={item.id}>
            <div
              style={{
                background: item.bgColor,
                ...getStyles(i),
                transition:
                  "transform 500ms ease 0s, opacity 500ms ease 0s, visibility 500ms ease 0s",
              }}
              className="absolute rounded-lg p-2 top-0 w-[300px] h-[525px] shadow-lg flex items-end ring ring-black/10"
              role="button"
              onClick={() => {
                setactiveSlide(i);
              }}
            >
              <CharacterCardContent {...item} />
            </div>
            <div
              className="reflection"
              style={{
                background: `linear-gradient(to bottom, ${item.bgColor}40, transparent)`,
                ...getStyles(i),
                position: "absolute",
                width: "100%",
                height: "60px",
                bottom: "-60px",
                borderRadius: "12px",
                transition:
                  "transform 500ms ease 0s, opacity 500ms ease 0s, visibility 500ms ease 0s",
              }}
            />
          </React.Fragment>
        ))}
      </div>
      <Button
        className="hidden md:block fixed right-8 my-auto top-0 bottom-0 z-20 group"
        onClick={next}
        variant="ghost"
      >
        <ChevronRight className="text-muted-foreground group-hover:text-foreground" />
      </Button>
    </>
  );
};

export default CharacterSlider;
