import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

const workspaceTable = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  createdBy: v.id("users"),
  joinCode: v.string(),
})
  .index("by_user", ["createdBy"])
  .index("by_join_code", ["joinCode"]);

const channelTable = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  createdBy: v.id("users"),
  workspaceId: v.id("workspaces"),
  messages: v.array(v.id("messages")),
  visibility: v.union(v.literal("public"), v.literal("private")),
  members: v.array(v.id("members")),
}).index("by_workspace_id", ["workspaceId"]);

const messageTable = defineTable({
  content: v.string(),
  type: v.string(),
  createdBy: v.id("users"),
  channelId: v.id("channels"),
});

const directMessageTable = defineTable({
  content: v.string(),
  sender: v.id("users"),
  recipient: v.id("users"),
  workspaceId: v.id("workspaces"),
  timestamp: v.number(),
  read: v.boolean(),
})
  .index("by_workspace_and_users", ["workspaceId", "sender", "recipient"])
  .index("by_timestamp", ["timestamp"]);

const memberTable = defineTable({
  userId: v.id("users"),
  workspaceId: v.id("workspaces"),
  role: v.union(v.literal("admin"), v.literal("member"), v.literal("guest")),
})
  .index("by_workspace_id", ["workspaceId"])
  .index("by_user_id", ["userId"])
  .index("by_workspace_id_and_user_id", ["workspaceId", "userId"]);

const schema = defineSchema({
  ...authTables,
  workspaces: workspaceTable,
  members: memberTable,
  channels: channelTable,
  messages: messageTable,
  directMessages: directMessageTable,
});

export default schema;
