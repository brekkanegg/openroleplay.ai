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
  getCrystalPrice,
  getRemindInstructionInterval,
} from "./constants";
import { getUser } from "./users";

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
      ? await ctx.runQuery(internal.personas.getPersona, {
          id: personaId,
        })
      : undefined;

    const messageId = await ctx.runMutation(
      internal.serve.addCharacterMessage,
      {
        chatId,
        characterId,
      }
    );

    if (character?.isArchived) {
      await ctx.runMutation(internal.serve.updateCharacterMessage, {
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
      await ctx.runMutation(internal.serve.useCrystal, {
        userId,
        name: model,
      });
      const stream = await openai.chat.completions.create({
        model,
        stream: true,
        messages: [
          {
            role: "system",
            content: instruction,
          },
          ...(messages
            .map(({ characterId, text }, index) => {
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
          await ctx.runMutation(internal.serve.updateCharacterMessage, {
            messageId,
            text,
          });
        }
      }
    } catch (error) {
      console.log(error);
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

export const useCrystal = internalMutation(
  async (ctx, { userId, name }: { userId: Id<"users">; name: string }) => {
    const user = await getUser(ctx);
    const price = getCrystalPrice(name);
    if (user.crystals - price < 0) {
      throw new ConvexError(
        `Not enough crystals. You need ${price} crystals to use ${name}.`
      );
    }
    await ctx.db.patch(userId, { crystals: user.crystals - price });
    await ctx.db.insert("usage", {
      userId,
      name,
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
