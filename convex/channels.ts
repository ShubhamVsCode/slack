import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Only the member of the workspace can create a channel
export const createChannel = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const { workspaceId, name, visibility = "public" } = args;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId),
      )
      .first();

    if (!member) {
      throw new ConvexError("You are not a member of this workspace");
    }

    if (member.role !== "admin") {
      throw new ConvexError("You are not authorized to create a channel");
    }

    const channelId = await ctx.db.insert("channels", {
      name,
      workspaceId,
      messages: [],
      members: [member._id],
      visibility,
      createdBy: userId,
    });

    return channelId;
  },
});

export const getChannels = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const { workspaceId } = args;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member) {
      return null;
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
      .collect();
    return channels;
  },
});

export const getChannel = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const { channelId } = args;

    const channel = await ctx.db.get(channelId);
    if (!channel) {
      return null;
    }

    const createdBy = await ctx.db.get(channel.createdBy);
    const members = await Promise.all(
      channel.members.map((member) => ctx.db.get(member)),
    );
    const userIds = members
      .filter((member) => member !== null)
      .map((member) => member?.userId);
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));

    return { ...channel, createdBy, members: users };
  },
});

export const getMessages = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const { channelId } = args;
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("channelId"), channelId))
      .collect();

    const messagesWithUserDetails = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.createdBy);
        const fileUrls = await Promise.all(
          message.files?.map((file) => ctx.storage.getUrl(file)) || [],
        );
        return {
          ...message,
          fileUrls,
          createdBy: {
            id: message.createdBy,
            name: user?.name || "Unknown User",
            image: user?.image,
          },
        };
      }),
    );
    return messagesWithUserDetails;
  },
});

export const sendMessage = mutation({
  args: {
    channelId: v.id("channels"),
    text: v.string(),
    files: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const { channelId, text, files } = args;
    if (!text) {
      return null;
    }
    const message = await ctx.db.insert("messages", {
      channelId,
      content: text,
      createdBy: userId,
      type: "text",
      files: files || [],
    });
    return message;
  },
});

export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const { messageId, text } = args;
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new ConvexError("Message not found");
    }

    if (message.createdBy !== userId) {
      throw new ConvexError("You are not authorized to edit this message");
    }

    await ctx.db.patch(messageId, {
      content: text,
      editedAt: Date.now(),
    });

    return message;
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const { messageId } = args;
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new ConvexError("Message not found");
    }

    if (message.createdBy !== userId) {
      throw new ConvexError("You are not authorized to delete this message");
    }

    await ctx.db.patch(messageId, {
      deletedAt: Date.now(),
    });

    return message;
  },
});

export const getChannelMembers = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const { channelId } = args;
    const channel = await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("_id"), channelId))
      .unique();

    if (!channel) {
      return null;
    }

    const memberIds = channel.members;
    return Promise.all(memberIds.map((id) => ctx.db.get(id)));
  },
});
