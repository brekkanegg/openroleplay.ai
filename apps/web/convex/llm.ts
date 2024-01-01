import { ConvexError, v } from "convex/values";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  DEFAULT_MODEL,
  getAPIKey,
  getBaseURL,
  getRemindInstructionInterval,
} from "./constants";

export const answer = internalAction({
  args: {
    userId: v.id("users"),
    chatId: v.id("chats"),
    characterId: v.id("characters"),
    personaId: v.optional(v.id("personas")),
  },
  handler: async (ctx, { userId, chatId, characterId, personaId }) => {
    const messages = await ctx.runQuery(internal.llm.getMessages, {
      chatId,
    });
    const character = await ctx.runQuery(api.characters.get, {
      id: characterId,
    });
    const persona = personaId
      ? await ctx.runQuery(internal.personas.getPersona, {
          id: personaId,
        })
      : undefined;

    const messageId = await ctx.runMutation(internal.llm.addCharacterMessage, {
      chatId,
      characterId,
    });

    if (character?.isArchived) {
      await ctx.runMutation(internal.llm.updateCharacterMessage, {
        messageId,
        text: "Sorry, the character is archived by the creator.",
      });
      return;
    }
    try {
      const model = character?.model ? character.model : DEFAULT_MODEL;
      const baseURL = getBaseURL(model);
      const apiKey = getAPIKey(model);
      const openai = new OpenAI({
        baseURL,
        apiKey,
      });
      const remindInstructionInterval = getRemindInstructionInterval(model);
      const instruction = `You are 
            {
              name: ${character?.name}
              description: ${character?.description}
              instruction: ${character?.instructions}
            }

            ${
              persona
                ? `
              and you are talking with
              {
                name: ${persona?.name}
                description: ${persona?.description}
              }`
                : ""
            }

            (You can use parentheses to indicate different types of things the Character might say,
            narrator type descriptions of actions, muttering asides or emotional reactions.)

            You can indicate italics by putting a single asterisk * on each side of a phrase,
            like *sad*, *laughing*. This can be used to indicate action or emotion in a definition.

            `;
      const { currentCrystals } = await ctx.runMutation(
        internal.serve.useCrystal,
        {
          userId,
          name: model,
        }
      );
      try {
        const stream = await openai.chat.completions.create({
          model,
          stream: true,
          messages: [
            {
              role: "system",
              content: instruction,
            },
            ...(messages
              .map(({ characterId, text }: any, index: any) => {
                const message = {
                  role: characterId ? "assistant" : "user",
                  content: text,
                };
                if ((index + 1) % remindInstructionInterval === 0) {
                  return [
                    message,
                    {
                      role: "system",
                      content: instruction,
                    },
                  ];
                } else {
                  return message;
                }
              })
              .flat() as ChatCompletionMessageParam[]),
          ],
        });

        let text = "";
        for await (const { choices } of stream) {
          const replyDelta = choices[0] && choices[0].delta.content;
          if (typeof replyDelta === "string" && replyDelta.length > 0) {
            text += replyDelta;
            await ctx.runMutation(internal.llm.updateCharacterMessage, {
              messageId,
              text,
            });
          }
        }
      } catch (error) {
        await ctx.runMutation(internal.serve.refundCrystal, {
          userId,
          currentCrystals,
          name: model,
        });
        throw Error;
      }
    } catch (error) {
      if (error instanceof ConvexError) {
        await ctx.runMutation(internal.llm.updateCharacterMessage, {
          messageId,
          text: error.data,
        });
      } else {
        await ctx.runMutation(internal.llm.updateCharacterMessage, {
          messageId,
          text: "I cannot reply at this time.",
        });
      }
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

export const updateCharacterMessage = internalMutation(
  async (
    ctx,
    { messageId, text }: { messageId: Id<"messages">; text: string }
  ) => {
    await ctx.db.patch(messageId, { text });
  }
);
