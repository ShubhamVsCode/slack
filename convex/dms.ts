import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    return await ctx.db.get(args.userId);
  },
});

export const createDirectMessage = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    recipientId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const { workspaceId, recipientId, content } = args;
    const directMessage = await ctx.db.insert("directMessages", {
      workspaceId,
      sender: userId,
      recipient: recipientId,
      content,
      timestamp: Date.now(),
      read: false,
    });
    return directMessage;
  },
});

export const getDirectMessages = query({
  args: {
    workspaceId: v.id("workspaces"),
    recipientId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { workspaceId, recipientId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const directMessages = await ctx.db
      .query("directMessages")
      .filter((q) =>
        q.and(
          q.eq(q.field("workspaceId"), workspaceId),
          q.or(
            q.and(
              q.eq(q.field("sender"), userId),
              q.eq(q.field("recipient"), recipientId),
            ),
            q.and(
              q.eq(q.field("sender"), recipientId),
              q.eq(q.field("recipient"), userId),
            ),
          ),
        ),
      )
      .collect();

    const messagesWithSenderAndRecipient = [];

    for (const message of directMessages) {
      const sender = await ctx.db.get(message.sender);
      const recipient = await ctx.db.get(message.recipient);
      messagesWithSenderAndRecipient.push({ ...message, sender, recipient });
    }

    return messagesWithSenderAndRecipient;
  },
});
