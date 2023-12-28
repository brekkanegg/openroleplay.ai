import { internalQuery, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";

export const create = mutation({
  args: {
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    cardImageStorageId: v.optional(v.id("_storage")),
    isPrivate: v.boolean(),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const { cardImageStorageId, isDefault, ...rest } = args;
    const persona = await ctx.db.insert("personas", {
      ...rest,
      creatorId: user._id,
      isBlacklisted: false,
      ...(cardImageStorageId
        ? {
            cardImageUrl: (await ctx.storage.getUrl(
              cardImageStorageId
            )) as string,
          }
        : {}),
      updatedAt: new Date().toISOString(),
    });
    if (isDefault) {
      await ctx.db.patch(user._id, {
        primaryPersonaId: persona,
      });
    }
    return persona;
  },
});

export const listMy = query({
  args: {},
  handler: async (ctx, args) => {
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

export const getPersona = internalQuery({
  args: {
    id: v.id("personas"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("personas"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    cardImageStorageId: v.optional(v.id("_storage")),
    isPrivate: v.optional(v.boolean()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const persona = await ctx.db.get(args.id);
    if (persona && user._id !== persona.creatorId) {
      throw new ConvexError({
        message: "User does not have permission to modify this persona.",
      });
    }
    const { id, cardImageStorageId, isDefault, ...rest } = args;
    if (isDefault) {
      await ctx.db.patch(user._id, {
        primaryPersonaId: args.id,
      });
    }
    return await ctx.db.patch(args.id, {
      ...rest,
      ...(cardImageStorageId
        ? {
            cardImageUrl: (await ctx.storage.getUrl(
              cardImageStorageId
            )) as string,
          }
        : {}),
      updatedAt: new Date().toISOString(),
    });
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
