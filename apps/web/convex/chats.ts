import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUser } from "./users";

export const create = mutation({
  args: {
    chatName: v.optional(v.string()),
    characterId: v.id("characters"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const chat = await ctx.db.insert("chats", {
      ...args,
      userId: user._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
    });
    return chat;
  },
});

export const list = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    return await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});

export const get = query({
  args: {
    id: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    return await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();
  },
});

export const remove = mutation({
  args: {
    id: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const chat = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();
    if (chat) {
      return await ctx.db.delete(args.id);
    }
  },
});
