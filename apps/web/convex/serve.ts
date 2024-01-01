import { ConvexError } from "convex/values";
import { internalMutation } from "./_generated/server";
import { getCrystalPrice } from "./constants";
import { Id } from "./_generated/dataModel";

export const useCrystal = internalMutation(
  async (ctx, { userId, name }: { userId: Id<"users">; name: string }) => {
    const user = await ctx.db.get(userId);
    const price = getCrystalPrice(name);
    const currentCrystals = user?.crystals || 0;
    if (currentCrystals - price < 0) {
      throw new ConvexError(
        `Not enough crystals. You need ${price} crystals to use ${name}.`
      );
    }
    await ctx.db.patch(userId, { crystals: currentCrystals - price });
    await ctx.db.insert("usage", {
      userId,
      name,
    });
    return { currentCrystals, remainingCrystals: currentCrystals - price };
  }
);

export const refundCrystal = internalMutation(
  async (
    ctx,
    {
      userId,
      name,
      currentCrystals,
    }: { userId: Id<"users">; name: string; currentCrystals: number }
  ) => {
    await ctx.db.patch(userId, { crystals: currentCrystals });
    await ctx.db.insert("usage", {
      userId,
      name: name + "-refund",
    });
  }
);
