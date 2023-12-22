import { v } from "convex/values";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const OPENAI_MODEL = "gpt-3.5-turbo";

export const answer = internalAction({
  args: {
    userId: v.id("users"),
    chatId: v.id("chats"),
    characterId: v.id("characters"),
    personaId: v.optional(v.id("personas")),
  },
  handler: async (ctx, { userId, chatId, characterId, personaId }) => {
    const messages = await ctx.runQuery(internal.serve.getMessages, {
      chatId,
    });
    const character = await ctx.runQuery(api.characters.get, {
      id: characterId,
    });
    const persona = personaId
      ? await ctx.runQuery(api.personas.get, {
          id: personaId,
        })
      : undefined;
    await ctx.runMutation(internal.serve.rateLimit, {
      userId,
      rateType: "smallLLM",
    });
    // const lastUserMessage = messages.at(-1)!.text;
    // const [embedding] = await embedTexts([lastUserMessage]);
    // const searchResults = await ctx.vectorSearch("embeddings", "byEmbedding", {
    //   vector: embedding,
    //   limit: 8,
    // });
    // const relevantDocuments = await ctx.runQuery(internal.serve.getChunks, {
    //   embeddingIds: searchResults.map(({ _id }) => _id),
    // });
    const messageId = await ctx.runMutation(
      internal.serve.addCharacterMessage,
      {
        chatId,
        characterId,
      }
    );

    try {
      const openai = new OpenAI();
      const stream = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        stream: true,
        messages: [
          {
            role: "system",
            content: `You are roleplaying with user. you are
            {
              name: ${character?.name}
              description: ${character?.description}
              instruction: ${character?.instructions}
            }
            ${
              persona
                ? `
              and the user is
              {
                name: ${persona?.name}
                description: ${persona?.description}
              }`
                : ""
            }
            `,
          },
          // ...(relevantDocuments.map(({ text }) => ({
          //   role: "system",
          //   content: "Relevant document:\n\n" + text,
          // })) as ChatCompletionMessageParam[]),
          ...(messages.map(({ characterId, text }) => ({
            role: characterId ? "assistant" : "user",
            content: text,
          })) as ChatCompletionMessageParam[]),
        ],
      });
      let text = "";
      for await (const { choices } of stream) {
        const replyDelta = choices[0].delta.content;
        if (typeof replyDelta === "string" && replyDelta.length > 0) {
          text += replyDelta;
          await ctx.runMutation(internal.serve.updateCharacterMessage, {
            messageId,
            text,
          });
        }
      }
    } catch (error: any) {
      await ctx.runMutation(internal.serve.updateCharacterMessage, {
        messageId,
        text: "I cannot reply at this time.",
      });
      throw error;
    }
  },
});

export const getMessages = internalQuery(
  async (ctx, { chatId }: { chatId: Id<"chats"> }) => {
    return await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .collect();
  }
);

export const addCharacterMessage = internalMutation(
  async (
    ctx,
    {
      chatId,
      characterId,
    }: { chatId: Id<"chats">; characterId: Id<"characters"> }
  ) => {
    return await ctx.db.insert("messages", {
      text: "",
      chatId,
      characterId,
    });
  }
);

export const rateLimit = internalMutation(
  async (
    ctx,
    {
      userId,
      rateType,
    }: { userId: Id<"users">; rateType: "smallLLM" | "largeLLM" }
  ) => {
    const currentMinute = new Date().getMinutes().toString();
    const rateLimits = await ctx.db
      .query("usage")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("rateType"), rateType))
      .filter((q) => q.eq(q.field("timeUnit"), currentMinute))
      .collect();

    if (rateLimits.length >= 10) {
      throw new Error("Rate limit exceeded");
    }

    await ctx.db.insert("usage", {
      userId,
      rateType,
      timeUnit: currentMinute,
    });
  }
);

export const updateCharacterMessage = internalMutation(
  async (
    ctx,
    { messageId, text }: { messageId: Id<"messages">; text: string }
  ) => {
    await ctx.db.patch(messageId, { text });
  }
);
