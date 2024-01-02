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
              ${
                character?.description &&
                `description: ${character.description}`
              }
              instruction: ${character?.instructions}
            }

            ${
              persona
                ? `
              and you are talking with ${persona?.name} (${persona?.description})
              `
                : ""
            }

            (You can use parentheses to indicate different types of things the Character might say,
            narrator type descriptions of actions, muttering asides or emotional reactions.)

            You can indicate italics by putting a single asterisk * on each side of a phrase,
            like *sad*, *laughing*. This can be used to indicate action or emotion in a definition.

            Short answer is preferrable (maximum: 50 words.)

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

export const generateInstruction = internalAction({
  args: {
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
    characterId: v.id("characters"),
  },
  handler: async (ctx, { userId, name, description, characterId }) => {
    try {
      const model = DEFAULT_MODEL;
      const baseURL = getBaseURL(model);
      const apiKey = getAPIKey(model);
      const openai = new OpenAI({
        baseURL,
        apiKey,
      });
      const instruction = `Create specific and detailed character instruction (what does the character do, how does they behave, what should they avoid doing) for ${name} (description: ${description}). `;
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
          ],
        });

        let text = "";
        for await (const { choices } of stream) {
          const replyDelta = choices[0] && choices[0].delta.content;
          if (typeof replyDelta === "string" && replyDelta.length > 0) {
            text += replyDelta;
            await ctx.runMutation(internal.llm.updateCharacterInstruction, {
              characterId,
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
        await ctx.runMutation(internal.llm.updateCharacterInstruction, {
          characterId,
          text: error.data,
        });
      } else {
        await ctx.runMutation(internal.llm.updateCharacterInstruction, {
          characterId,
          text: "I cannot generate instruction at this time.",
        });
      }
      throw error;
    }
  },
});

export const generateFollowups = internalAction({
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
    try {
      const model = "gpt-3.5-turbo-1106";
      const baseURL = getBaseURL(model);
      const apiKey = getAPIKey(model);
      const openai = new OpenAI({
        baseURL,
        apiKey,
      });
      const { currentCrystals } = await ctx.runMutation(
        internal.serve.useCrystal,
        {
          userId,
          name: model,
        }
      );
      try {
        const instruction = `You are ${
          persona ? `${persona?.name} (${persona?.description}). You are ` : ""
        } talking with character.
        {
          name: ${character?.name}
          ${character?.description && `description: ${character.description}`}
        }
        respond in JSON as this will be used for function arguments.
        `;

        const functions = [
          {
            name: "generate_answers",
            description:
              "This function is always triggered. Always answer in short (maximum: 15 words.) sentence.",
            parameters: {
              type: "object",
              properties: {
                answer1: {
                  type: "string",
                  description:
                    "Provide a natural follow-up to the previous message, maintaining the flow of the conversation.",
                },
                answer2: {
                  type: "string",
                  description:
                    "Craft an engaging and intriguing follow-up to the previous message, designed to captivate the user's interest.",
                },
                answer3: {
                  type: "string",
                  description:
                    "Introduce an entirely new idea or pose a question to prevent the conversation from reaching a dead-end.",
                },
              },
              required: ["answer1", "answer2", "answer3"],
            },
          },
        ];
        const response = await openai.chat.completions.create({
          model,
          stream: false,
          messages: [
            {
              role: "system",
              content: instruction,
            },
            ...(messages
              .map(({ characterId, text }: any, index: any) => {
                return {
                  role: characterId ? "user" : "assistant",
                  content: text,
                };
              })
              .flat() as ChatCompletionMessageParam[]),
          ],
          function_call: "auto",
          response_format: { type: "json_object" },
          functions,
        });
        const responseMessage = (response &&
          response?.choices &&
          response.choices[0]?.message) as any;
        if (responseMessage?.function_call) {
          const functionArgs = JSON.parse(
            responseMessage.function_call.arguments
          );
          await ctx.runMutation(internal.followUps.create, {
            chatId,
            followUp1: functionArgs?.answer1,
            followUp2: functionArgs?.answer2,
            followUp3: functionArgs?.answer3,
          });
        }
      } catch (error) {
        console.log("error:::", error);
        await ctx.runMutation(internal.serve.refundCrystal, {
          userId,
          currentCrystals,
          name: model,
        });
        throw Error;
      }
    } catch (error) {
      console.log("error:::", error);
      throw error;
    }
  },
});

export const getMessages = internalQuery(
  async (ctx, { chatId }: { chatId: Id<"chats"> }) => {
    return await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .take(256);
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

export const updateCharacterInstruction = internalMutation(
  async (
    ctx,
    { characterId, text }: { characterId: Id<"characters">; text: string }
  ) => {
    await ctx.db.patch(characterId, { instructions: text });
  }
);
