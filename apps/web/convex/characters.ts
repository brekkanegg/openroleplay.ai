import { action, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { embedText } from "./ingest/embed";
import { paginationOptsValidator } from "convex/server";
import { internal } from "./_generated/api";

export const upsert = mutation({
  args: {
    id: v.optional(v.id("characters")),
    remixId: v.optional(v.id("characters")),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    model: v.optional(
      v.union(
        v.literal("gpt-3.5-turbo-1106"),
        v.literal("gpt-4-1106-preview"),
        v.literal("mistral-7b-instruct"),
        v.literal("mixtral-8x7b-instruct"),
        v.literal("pplx-7b-chat"),
        v.literal("pplx-7b-online"),
        v.literal("pplx-70b-chat"),
        v.literal("pplx-70b-online"),
        v.literal("accounts/fireworks/models/qwen-14b-chat")
      )
    ),
    instructions: v.optional(v.string()),
    cardImageUrl: v.optional(v.string()),
    cardImageStorageId: v.optional(v.id("_storage")),
    greetings: v.optional(v.array(v.string())),
    knowledge: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const updatedAt = new Date().toISOString();
    if (args.id) {
      const characterDraft = await ctx.db.get(args.id);
      if (characterDraft && user._id !== characterDraft.creatorId) {
        throw new ConvexError({
          message: "User does not have permission to modify this character.",
        });
      }
      const { id, cardImageUrl, cardImageStorageId, ...rest } = args;
      const character = await ctx.db.patch(id, {
        ...rest,
        ...(cardImageStorageId
          ? {
              cardImageUrl: (await ctx.storage.getUrl(
                cardImageStorageId
              )) as string,
            }
          : { cardImageUrl }),
        updatedAt,
      });
      return character;
    } else {
      const { cardImageStorageId, cardImageUrl, ...rest } = args;
      const character = await ctx.db.insert("characters", {
        ...rest,
        ...(cardImageStorageId
          ? {
              cardImageUrl: (await ctx.storage.getUrl(
                cardImageStorageId
              )) as string,
            }
          : { cardImageUrl }),
        creatorId: user._id,
        updatedAt,
        numChats: 0,
        isDraft: true,
        isArchived: false,
        isNSFW: false,
        isBlacklisted: false,
      });
      return character;
    }
  },
});

export const publish = mutation({
  args: {
    id: v.id("characters"),
    visibility: v.optional(v.union(v.literal("private"), v.literal("public"))),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const character = await ctx.db.get(args.id);
    if (!character) {
      throw new ConvexError({ message: "Character does not exist." });
    }
    if (user._id !== character.creatorId) {
      throw new ConvexError({
        message: "User does not have permission to modify this character.",
      });
    }
    if (!character.name || !character.description || !character.instructions) {
      throw new ConvexError({
        message: "Character must have a name and instructions.",
      });
    }
    const updatedAt = new Date().toISOString();
    const updatedCharacter = await ctx.db.patch(args.id, {
      isDraft: false,
      ...(args.visibility ? { visibility: args.visibility } : {}),
      updatedAt,
    });
    return updatedCharacter;
  },
});

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("characters")
      .withIndex("byNumChats")
      .filter((q) => q.eq(q.field("isDraft"), false))
      .filter((q) => q.eq(q.field("isBlacklisted"), false))
      .filter((q) => q.neq(q.field("isArchived"), true))
      .filter((q) => q.neq(q.field("isNSFW"), true))
      .filter((q) => q.neq(q.field("visibility"), "private"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const listMy = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    return await ctx.db
      .query("characters")
      .filter((q) => q.eq(q.field("creatorId"), user._id))
      .filter((q) => q.neq(q.field("isArchived"), true))
      .order("desc")
      .paginate(args.paginationOpts);
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

export const archive = mutation({
  args: {
    id: v.id("characters"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const characterDraft = await ctx.db.get(args.id);
    if (characterDraft && user._id !== characterDraft.creatorId) {
      throw new ConvexError({
        message: "User does not have permission to modify this character.",
      });
    }
    return await ctx.db.patch(args.id, { isArchived: true });
  },
});

export const similarCharacters = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const embedding = await embedText(args.query);
    return await ctx.vectorSearch("characters", "byEmbedding", {
      vector: embedding[0] as number[],
      limit: 16,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const generateInstruction = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    characterId: v.id("characters"),
  },
  handler: async (ctx, { name, description, characterId }) => {
    const user = await getUser(ctx);
    await ctx.scheduler.runAfter(0, internal.llm.generateInstruction, {
      userId: user._id,
      characterId,
      name,
      description,
    });
    const character = await ctx.db.get(characterId);
    return character?.instructions;
  },
});
