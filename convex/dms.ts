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

    const onlineStatus = await ctx.db
      .query("onlineStatus")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    return {
      ...(await ctx.db.get(args.userId)),
      lastSeen: onlineStatus?.lastSeen,
    };
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

export const editDirectMessage = mutation({
  args: {
    directMessageId: v.id("directMessages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { directMessageId, content } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const directMessage = await ctx.db.get(directMessageId);
    if (!directMessage) {
      throw new ConvexError("Direct message not found");
    }

    if (directMessage.sender !== userId) {
      throw new ConvexError(
        "You are not authorized to edit this direct message",
      );
    }

    await ctx.db.patch(directMessageId, {
      content,
      editedAt: Date.now(),
    });

    return directMessage;
  },
});

export const deleteDirectMessage = mutation({
  args: {
    directMessageId: v.id("directMessages"),
  },
  handler: async (ctx, args) => {
    const { directMessageId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const directMessage = await ctx.db.get(directMessageId);
    if (!directMessage) {
      throw new ConvexError("Direct message not found");
    }

    if (directMessage.sender !== userId) {
      throw new ConvexError(
        "You are not authorized to delete this direct message",
      );
    }

    await ctx.db.patch(directMessageId, {
      deletedAt: Date.now(),
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
