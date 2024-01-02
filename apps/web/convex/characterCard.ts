import { ConvexError, v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { getUser } from "./users";
import { internal } from "./_generated/api";

export const request = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    characterId: v.id("characters"),
  },
  handler: async (ctx, { name, description, characterId }) => {
    const user = await getUser(ctx);
    await ctx.scheduler.runAfter(0, internal.image.generateWithDalle3, {
      userId: user._id,
      characterId,
      name,
      description,
    });
    const character = await ctx.db.get(characterId);
    return character?.cardImageUrl;
  },
});

export const uploadImage = internalMutation({
  args: {
    characterId: v.id("characters"),
    cardImageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const character = await ctx.db.get(args.characterId);
    if (!character) {
      throw new ConvexError({ message: "Character does not exist." });
    }
    const cardImageUrl = (await ctx.storage.getUrl(
      args.cardImageStorageId
    )) as string;
    const updatedCharacter = await ctx.db.patch(args.characterId, {
      cardImageUrl,
    });
    return updatedCharacter;
  },
});
