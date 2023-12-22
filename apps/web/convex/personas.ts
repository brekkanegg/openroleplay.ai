import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUser } from "./users";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    isPrivate: v.boolean(),
    isBlacklisted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const persona = await ctx.db.insert("personas", {
      ...args,
      creatorId: user._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return persona;
  },
});

export const list = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    return await ctx.db
      .query("personas")
      .filter((q) => q.eq(q.field("creatorId"), user._id))
      .collect();
  },
});

export const get = query({
  args: {
    id: v.id("personas"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    return await ctx.db
      .query("personas")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .filter((q) => q.eq(q.field("creatorId"), user._id))
      .first();
  },
});

export const update = mutation({
  args: {
    id: v.id("personas"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
    isBlacklisted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const persona = await ctx.db
      .query("personas")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .filter((q) => q.eq(q.field("creatorId"), user._id))
      .first();
    if (persona) {
      return await ctx.db.patch(args.id, {
        ...args,
        updatedAt: new Date().toISOString(),
      });
    }
  },
});

export const remove = mutation({
  args: {
    id: v.id("personas"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const persona = await ctx.db
      .query("personas")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .filter((q) => q.eq(q.field("creatorId"), user._id))
      .first();
    if (persona) {
      return await ctx.db.delete(args.id);
    }
  },
});
