import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    chatId: v.id("chats"),
    characterId: v.optional(v.id("characters")),
    personaId: v.optional(v.id("personas")),
    text: v.string(),
  })
    .index("byCharacterId", ["characterId"])
    .index("byChatId", ["chatId"]),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("byToken", ["tokenIdentifier"]),
  characters: defineTable({
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    instructions: v.optional(v.string()),
    cardImageUrl: v.optional(v.string()),
    greetings: v.optional(v.array(v.string())),
    knowledge: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    creatorId: v.id("users"),
    isDraft: v.boolean(),
    isBlacklisted: v.boolean(),
    visibility: v.optional(v.union(v.literal("private"), v.literal("public"))),
    numChats: v.optional(v.number()),
    embedding: v.optional(v.array(v.float64())),
    model: v.optional(v.union(v.literal("gpt-3.5"), v.literal("gpt-4"))),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("byUserId", ["creatorId"])
    .vectorIndex("byEmbedding", {
      vectorField: "embedding",
      dimensions: 512,
      filterFields: ["name", "description", "instructions"],
    }),
  personas: defineTable({
    name: v.string(),
    description: v.string(),
    isPrivate: v.boolean(),
    isBlacklisted: v.boolean(),
    creatorId: v.id("users"),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("byUserId", ["creatorId"]),
  chats: defineTable({
    chatName: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
    userId: v.optional(v.id("users")),
    characterId: v.optional(v.id("characters")),
    joinedAt: v.string(),
  })
    .index("byChatId", ["chatName"])
    .index("byUserId", ["userId"])
    .index("byCharacterId", ["characterId"]),
  usage: defineTable({
    userId: v.id("users"),
    rateType: v.optional(v.union(v.literal("smallLLM"), v.literal("largeLLM"))),
    timeUnit: v.string(),
  }).index("byUserId", ["userId"]),
});
