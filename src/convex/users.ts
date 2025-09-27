import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await authComponent.getAuthUser(ctx);
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      return user._id;
    }

    return await ctx.db.insert("users", {
      email: args.email,
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await authComponent.getAuthUser(ctx);
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});