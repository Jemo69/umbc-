import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { NotaError } from "../lib/errors";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new NotaError("You must be logged in to add a task.", {
        toast: {
          variant: "destructive",
        },
      });
    }
    await ctx.db.insert("tasks", {
      userId: user._id,
      text: args.text,
      completed: false,
    });
  },
});

export const update = mutation({
  args: { id: v.id("tasks"), completed: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { completed: args.completed });
  },
});

export const del = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});