import { query } from "./_generated/server";
import { v } from "convex/values";
import { NotaError } from "../lib/errors";
import { authComponent } from "./auth";

export const get = query({
  args: {
    id: v.id("chunks"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new NotaError("You must be logged in to view a chunk.", {
        toast: {
          variant: "destructive",
        },
      });
    }
    return await ctx.db.get(args.id);
  },
});