import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const getJoinCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createWorkspace = mutation({
  args: {
    workspaceName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const joinCode = getJoinCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.workspaceName,
      createdBy: userId,
      joinCode: joinCode,
      description: "",
    });

    await ctx.db.insert("members", {
      userId: userId,
      workspaceId: workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

export const getWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member) {
      throw new ConvexError("Not a member of this workspace");
    }

    return await ctx.db.get(args.workspaceId);
  },
});

export const getWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const memberWorkspaces = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const workspaceIds = memberWorkspaces.map((member) => member.workspaceId);

    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db
        .query("workspaces")
        .filter((q) => q.eq(q.field("_id"), workspaceId))
        .first();
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getAllWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});

export const joinWorkspace = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const workspace = await ctx.db.get(args.workspaceId);

    if (!workspace) {
      throw new ConvexError("Workspace not found");
    }

    if (workspace.joinCode !== args.joinCode) {
      throw new ConvexError("Invalid join code");
    }

    const memberId = await ctx.db.insert("members", {
      userId: userId,
      workspaceId: workspace._id,
      role: "member",
    });

    const channels = await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("workspaceId"), workspace._id))
      .collect();

    for (const channel of channels) {
      await ctx.db.patch(channel._id, {
        members: [...channel.members, memberId],
      });
    }

    return workspace;
  },
});
