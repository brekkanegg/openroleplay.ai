import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function useStoreChatEffect(characterId: Id<"characters">) {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [chatId, setChatId] = useState<Id<"chats"> | null>(null);
  const createChat = useMutation(api.chats.create);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function createChatForUser() {
      const id = await createChat({ characterId });
      setChatId(id);
    }

    createChatForUser();
    return () => setChatId(null);
  }, [isAuthenticated, createChat, user?.id]);

  return chatId;
}
