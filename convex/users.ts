import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    return await ctx.db.get(userId);
  },
});

export const updateOnlineStatus = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const lastSeen = Date.now();

    const status = await ctx.db
      .query("onlineStatus")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (status) {
      await ctx.db.patch(status._id, { lastSeen });
    } else {
      await ctx.db.insert("onlineStatus", { userId, lastSeen });
    }
  },
});

export const getOnlineStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const status = await ctx.db
      .query("onlineStatus")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
    return status ? status.lastSeen : null;
  },
});
