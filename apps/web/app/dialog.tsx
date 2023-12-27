"use client";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../convex/_generated/dataModel";
import { Plus, Send } from "lucide-react";
import Image from "next/image";
import { Button } from "@repo/ui/src/components";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/src/components/avatar";

export function Dialog({
  name,
  welcomeMessage,
  cardImageUrl,
  chatId,
  characterId,
}: {
  name: string;
  welcomeMessage?: string;
  cardImageUrl?: string;
  chatId: Id<"chats">;
  characterId: Id<"characters">;
}) {
  const remoteMessages = useQuery(api.messages.list, { chatId });
  const messages = useMemo(
    () =>
      [{ text: welcomeMessage, characterId, _id: "0" }].concat(
        (remoteMessages ?? []) as {
          characterId: Id<"characters">;
          text: string;
          _id: string;
        }[]
      ),
    [remoteMessages, welcomeMessage]
  );
  const sendMessage = useMutation(api.messages.send);

  const [isScrolled, setScrolled] = useState(false);

  const [input, setInput] = useState("");

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    sendMessage({ message: input, chatId, characterId });
    setInput("");
    setScrolled(false);
  };

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScrolled) {
      return;
    }
    // Using `setTimeout` to make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  }, [messages, isScrolled]);

  return (
    <div className="w-full h-full">
      <div
        className="flex-grow overflow-y-scroll scrollbar-hide gap-8 flex flex-col mx-2 p-4 rounded-lg h-[90%]"
        ref={listRef}
        onWheel={() => {
          setScrolled(true);
        }}
      >
        {remoteMessages === undefined ? (
          <>
            <div className="animate-pulse rounded-md bg-black/10 h-5" />
            <div className="animate-pulse rounded-md bg-black/10 h-9" />
          </>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex flex-col gap-2 ${
                message?.characterId ? "self-start" : "self-end"
              }`}
            >
              <div
                className={`text-sm font-medium flex items-center gap-2 ${
                  message?.characterId ? "justify-start" : "justify-end"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    alt={`Character card of ${name}`}
                    src={message?.characterId ? cardImageUrl : "undefined"}
                    className="object-cover"
                  />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                {message?.characterId ? <>{name}</> : <>You</>}
              </div>
              {message.text === "" ? (
                <div className="animate-pulse rounded-md bg-black/10 h-9" />
              ) : (
                <div
                  className={
                    "lg:max-w-[40rem] md:max-w-[30rem] max-w-[20rem] rounded-xl px-3 py-2 whitespace-pre-wrap" +
                    (message?.characterId
                      ? " bg-muted rounded-tl-none "
                      : " bg-foreground text-muted rounded-tr-none ")
                  }
                >
                  {message.text}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <form
        className="border-solid border-0 border-t-[1px] flex sticky bottom-0 bg-background"
        onSubmit={(event) => void handleSend(event)}
      >
        <input
          className="w-full ml-4 my-3 border-none focus-visible:ring-0"
          autoFocus
          name="message"
          placeholder="Send a message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button disabled={input === ""} variant="ghost" className="my-3 mr-4">
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
