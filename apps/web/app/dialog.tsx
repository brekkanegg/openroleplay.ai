"use client";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../convex/_generated/api";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Id } from "../convex/_generated/dataModel";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MoreHorizontal, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Tooltip } from "@repo/ui/src/components";
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
import { Crystal } from "@repo/ui/src/components/icons";
import { Separator } from "@repo/ui/src/components/separator";
import Spinner from "@repo/ui/src/components/spinner";

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
  const generateInspiration = useMutation(api.followUps.generate);
  const inspirations = useQuery(api.followUps.get, {
    chatId,
  });

  const [isGeneratingInspiration, setIsGeneratingInspiration] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [input, setInput] = useState("");

  const sendAndReset = (input: string) => {
    sendMessage({ message: input, chatId, characterId });
    setInput("");
    setScrolled(false);
  };
  const handleSend = (event?: FormEvent) => {
    event && event.preventDefault();
    sendAndReset(input);
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

  useEffect(() => {
    inspirations && setIsGeneratingInspiration(false);
  }, [inspirations]);

  return (
    <div className="w-full h-full">
      {chatId && (
        <div className="w-full flex items-center justify-between p-2 sticky top-0 bg-background border-b h-12 rounded-t-lg px-6">
          <div className="text-muted-foreground font-medium text-xs flex items-center gap-2">
            <ModelBadge modelName={model as string} showCredits={true} />
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
      <div className="h-[calc(100%-6rem)] relative flex flex-col ">
        <div
          className="grow overflow-y-scroll scrollbar-hide gap-8 flex flex-col mx-2 p-4 rounded-lg h-[100vh]"
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
                        a({ children, href, target, rel }) {
                          return (
                            <a
                              href={href}
                              rel={rel}
                              target={target}
                              className="hover:opacity-50 underline duration-200"
                            >
                              {children}
                            </a>
                          );
                        },
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
                      {message?.text?.startsWith("Not enough crystals.")
                        ? `${message.text} [Visit Shop](/shop)`
                        : message.text}
                    </MemoizedReactMarkdown>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
        <div className="w-full fixed lg:sticky bottom-32 lg:bottom-0 p-4 flex items-center gap-1 flex-wrap text-xs bg-background/90 backdrop-blur-md">
          <Tooltip
            content={
              <span className="text-xs flex gap-1 text-muted-foreground p-2">
                <Crystal className="w-4 h-4" /> x 5
              </span>
            }
            desktopOnly={true}
          >
            <Button
              variant="ghost"
              onClick={() => {
                setIsGeneratingInspiration(true);
                generateInspiration({ chatId, characterId });
              }}
              className="gap-1"
              size="xs"
              disabled={isGeneratingInspiration}
            >
              {isGeneratingInspiration ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 p-1" />
                  Inspire
                </>
              )}
            </Button>
          </Tooltip>
          {inspirations && (
            <>
              <Separator className="w-8" />
              {inspirations?.followUp1 &&
                inspirations.followUp1?.length > 0 && (
                  <Button
                    variant="outline"
                    size="xs"
                    className="font-normal rounded-full px-2"
                    onClick={() => {
                      sendAndReset(inspirations?.followUp1 as string);
                    }}
                  >
                    {inspirations?.followUp1}
                  </Button>
                )}
              {inspirations?.followUp2 &&
                inspirations.followUp2?.length > 0 && (
                  <Button
                    variant="outline"
                    size="xs"
                    className="font-normal rounded-full px-2"
                    onClick={() => {
                      sendAndReset(inspirations?.followUp2 as string);
                    }}
                  >
                    {inspirations?.followUp2}
                  </Button>
                )}
              {inspirations?.followUp3 &&
                inspirations.followUp3?.length > 0 && (
                  <Button
                    variant="outline"
                    size="xs"
                    className="font-normal rounded-full px-2"
                    onClick={() => {
                      sendAndReset(inspirations?.followUp3 as string);
                    }}
                  >
                    {inspirations?.followUp3}
                  </Button>
                )}
            </>
          )}
        </div>
        <form
          className="border-solid border-0 border-t-[1px] flex fixed lg:sticky bottom-16 lg:bottom-0 w-full bg-background h-16 items-center rounded-br-lg"
          onSubmit={(event) => void handleSend(event)}
        >
          <input
            className="w-full ml-4 my-3 border-none focus-visible:ring-0 bg-background"
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
