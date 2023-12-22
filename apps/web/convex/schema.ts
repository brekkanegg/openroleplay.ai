import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    sessionId: v.string(),
    chatId: v.optional(v.id("chats")),
    characterId: v.optional(v.id("characters")),
    personaId: v.optional(v.id("personas")),
    userId: v.optional(v.id("users")),
    text: v.string(),
  })
    .index("bySessionId", ["sessionId"])
    .index("byCharacterId", ["characterId"]),
  documents: defineTable({
    url: v.string(),
    text: v.string(),
  }).index("byUrl", ["url"]),
  chunks: defineTable({
    documentId: v.id("documents"),
    text: v.string(),
    embeddingId: v.union(v.id("embeddings"), v.null()),
  })
    .index("byDocumentId", ["documentId"])
    .index("byEmbeddingId", ["embeddingId"]),
  embeddings: defineTable({
    embedding: v.array(v.number()),
    chunkId: v.id("chunks"),
  })
    .index("byChunkId", ["chunkId"])
    .vectorIndex("byEmbedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  characters: defineTable({
    name: v.string(),
    description: v.string(),
    instructions: v.string(),
    cardImageUrl: v.string(),
    greetings: v.array(v.string()),
    knowledge: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    creatorId: v.id("users"),
    isPrivate: v.boolean(),
    isBlacklisted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("byUserId", ["creatorId"]),
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
    characterId: v.id("characters"),
    userId: v.id("users"),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("byCharacterId", ["characterId"])
    .index("byUserId", ["userId"]),
});
