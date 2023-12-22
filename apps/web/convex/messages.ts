import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getUser } from "./users";

export const list = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});

export const send = mutation({
  args: {
    message: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, { message, sessionId }) => {
    const user = await getUser(ctx);
    await ctx.db.insert("messages", {
      text: message,
      userId: user._id,
      sessionId,
    });
    await ctx.scheduler.runAfter(0, internal.serve.answer, {
      sessionId,
    });
  },
});

export const clear = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const messages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));
  },
});
