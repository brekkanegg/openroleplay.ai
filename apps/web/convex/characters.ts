import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUser } from "./users";
import { embedText } from "./ingest/embed";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    instructions: v.string(),
    cardImageUrl: v.string(),
    greetings: v.array(v.string()),
    knowledge: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    isPrivate: v.boolean(),
    isBlacklisted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const character = await ctx.db.insert("characters", {
      ...args,
      creatorId: user._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return character;
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("characters").collect();
  },
});

export const get = query({
  args: {
    id: v.id("characters"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: {
    id: v.id("characters"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const similarCharacters = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const embedding = await embedText(args.query);
    return await ctx.vectorSearch("characters", "byEmbedding", {
      vector: embedding[0],
      limit: 16,
    });
  },
});
