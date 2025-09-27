import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  tasks: defineTable({
    userId: v.id("users"),
    text: v.string(),
    completed: v.boolean(),
  }).index("by_user", ["userId"]),

  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    storageId: v.string(),
  }).index("by_user", ["userId"]),

  notes: defineTable({
    userId: v.id("users"),
    documentId: v.id("documents"),
    text: v.string(),
    isViewer: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_document", ["documentId"]),

  chunks: defineTable({
    documentId: v.id("documents"),
    text: v.string(),
    embedding: v.array(v.float64()),
  })
    .index("by_document", ["documentId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),
});
