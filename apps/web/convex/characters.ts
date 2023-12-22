import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUser } from "./users";

export const createCharacter = mutation({
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
