"use client";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../convex/_generated/api";
import { useMutation, usePaginatedQuery } from "convex/react";
import { Id } from "../convex/_generated/dataModel";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MoreHorizontal, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@repo/ui/src/components";
import { CodeBlock } from "@repo/ui/src/components/codeblock";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/src/components/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/src/components/alert-dialog";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/src/components/popover";
import { useRouter } from "next/navigation";
import { MemoizedReactMarkdown } from "./markdown";
import ModelBadge from "../components/characters/model-badge";

export function Dialog({
  name,
  model,
  welcomeMessage,
  cardImageUrl,
  chatId,
  characterId,
}: {
  name: string;
  model: string;
  welcomeMessage?: string;
  cardImageUrl?: string;
  chatId: Id<"chats">;
  characterId: Id<"characters">;
}) {
  const router = useRouter();
  const goBack = router.back;
  const remove = useMutation(api.chats.remove);
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.list,
    { chatId },
    { initialNumItems: 5 }
  );
  const remoteMessages = results.reverse();
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
      {chatId && (
        <div className="w-full flex items-center justify-between p-2 sticky top-0 bg-white border-b h-[5%] rounded-t-lg px-6">
          <div className="text-muted-foreground font-medium text-xs flex items-center gap-2">
            <ModelBadge modelName={model as string} />
            AI can make mistakes.
          </div>
          <Popover>
            <AlertDialog>
              <AlertDialogTrigger>
                <PopoverContent asChild>
                  <Button variant="ghost" className="text-muted-foreground">
                    Delete Chat
                  </Button>
                </PopoverContent>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`This action cannot be undone. This will permanently delete chat.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const promise = remove({
                        id: chatId as Id<"chats">,
                      });
                      toast.promise(promise, {
                        loading: "Deleting chat...",
                        success: () => {
                          goBack();
                          return `Chat has been deleted.`;
                        },
                        error: (error) => {
                          console.log("error:::", error);
                          return error
                            ? (error.data as { message: string })?.message
                            : "Unexpected error occurred";
                        },
                      });
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <PopoverTrigger
              className={`flex items-center justify-center overflow-hidden rounded-full border-none outline-none transition-all duration-75 active:scale-95`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </PopoverTrigger>
          </Popover>
        </div>
      )}
      <div className="h-[calc(100%-2rem)] relative flex flex-col ">
        <div
          className="grow overflow-y-scroll scrollbar-hide gap-8 flex flex-col mx-2 p-4 rounded-lg h-[90vh]"
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
            messages.map((message, i) => (
              <motion.div
                key={message._id}
                className={`flex flex-col gap-2 ${
                  message?.characterId ? "self-start" : "self-end"
                }`}
                onViewportEnter={() => {
                  if (i === 0 && isScrolled) loadMore(5);
                }}
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
                  <div
                    className={
                      "lg:max-w-[40rem] md:max-w-[30rem] max-w-[20rem] rounded-xl px-3 py-2 whitespace-pre-wrap" +
                      (message?.characterId
                        ? " bg-muted rounded-tl-none "
                        : " bg-foreground text-muted rounded-tr-none ")
                    }
                  >
                    Thinking...
                  </div>
                ) : (
                  <div
                    className={
                      "lg:max-w-[40rem] md:max-w-[30rem] max-w-[20rem] rounded-xl px-3 py-2 whitespace-pre-wrap" +
                      (message?.characterId
                        ? " bg-muted rounded-tl-none "
                        : " bg-foreground text-muted rounded-tr-none ")
                    }
                  >
                    <MemoizedReactMarkdown
                      className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                      remarkPlugins={[remarkGfm, remarkMath]}
                      components={{
                        p({ children }) {
                          return <p className="mb-2 last:mb-0">{children}</p>;
                        },
                        code({ node, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");

                          return (
                            <CodeBlock
                              key={Math.random()}
                              language={(match && match[1]) || ""}
                              value={String(children).replace(/\n$/, "")}
                              {...props}
                            />
                          );
                        },
                      }}
                    >
                      {message.text}
                    </MemoizedReactMarkdown>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
        <form
          className="border-solid border-0 border-t-[1px] flex fixed lg:sticky bottom-0 w-full bg-background h-16 items-center rounded-b-lg"
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
    </div>
  );
}
