"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";
import { internal } from "./_generated/api";
import { crystalDollarPrice } from "./constants";
import { Id } from "./_generated/dataModel";

export const pay = action({
  args: {
    numCrystals: v.union(
      v.literal(300),
      v.literal(1650),
      v.literal(5450),
      v.literal(11200),
      v.literal(19400),
      v.literal(90000)
    ),
    userId: v.id("users"),
  },
  handler: async (
    ctx: any,
    {
      numCrystals,
      userId,
    }: {
      numCrystals: 300 | 1650 | 5450 | 11200 | 19400 | 90000;
      userId: Id<"users">;
    }
  ): Promise<string> => {
    const domain: string =
      process.env.HOSTING_URL ?? "http://localhost:3000/shop";
    const stripe: Stripe = new Stripe(process.env.STRIPE_API_KEY!, {
      apiVersion: "2023-10-16",
    });
    const paymentId: string = await ctx.runMutation(internal.payments.create, {
      numCrystals,
      userId,
    });
    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "USD",
              unit_amount_decimal: crystalDollarPrice[numCrystals],
              tax_behavior: "exclusive",
              product_data: {
                name: `${numCrystals} Crystals`,
                description:
                  "Crystal is an universal currency for calling AI features in openroleplay.ai",
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${domain}?paymentId=${paymentId}`,
        cancel_url: `${domain}`,
        automatic_tax: { enabled: true },
      });

    await ctx.runMutation(internal.payments.markPending, {
      paymentId,
      stripeId: session.id,
    });
    return session.url as string;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async ({ runMutation }, { signature, payload }) => {
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2023-10-16",
    });
    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET as string;
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      console.log("event:::", event);

      if (event.type === "checkout.session.completed") {
        const stripeId = (event.data.object as { id: string }).id;
        await runMutation(internal.payments.fulfill, { stripeId });
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
