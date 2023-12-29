import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = internalMutation({
  handler: async (
    ctx,
    { numCrystals, userId }: { numCrystals: number; userId: Id<"users"> }
  ) => {
    return await ctx.db.insert("payments", { numCrystals, userId });
  },
});

export const markPending = internalMutation({
  args: { paymentId: v.id("payments"), stripeId: v.string() },
  handler: async (ctx, { paymentId, stripeId }) => {
    await ctx.db.patch(paymentId, { stripeId });
  },
});

export const fulfill = internalMutation({
  args: { stripeId: v.string() },
  handler: async (ctx, { stripeId }) => {
    const { userId, numCrystals } = (await ctx.db
      .query("payments")
      .withIndex("byStripeId", (q) => q.eq("stripeId", stripeId))
      .unique())!;
    const user = await ctx.db.get(userId as Id<"users">);
    const currentCrystals = user?.crystals || 0;
    await ctx.db.patch(userId as Id<"users">, {
      crystals: currentCrystals + numCrystals,
    });
  },
});
