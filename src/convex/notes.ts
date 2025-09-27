import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { NotaError } from "../lib/errors";
import { authComponent } from "./auth";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI();

export const get = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    return await ctx.db
      .query("notes")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

export const add = action({
  args: {
    documentId: v.id("documents"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    if (!user) {
      throw new NotaError("You must be logged in to add a note.", {
        toast: {
          variant: "destructive",
        },
      });
    }

    await ctx.runMutation(api.notes.addMessage, {
      documentId: args.documentId,
      message: args.message,
      isViewer: true,
    });

    const { data } = await openai.embeddings.create({
      input: args.message,
      model: "text-embedding-3-small",
    });

    const results = await ctx.vectorSearch("chunks", "by_embedding", {
      vector: data[0].embedding,
      limit: 5,
      filter: (q) => q.eq("documentId", args.documentId),
    });

    const context = await Promise.all(
      results.map(async (result) => {
        const chunk = await ctx.runQuery(api.chunks.get, { id: result._id });
        return chunk?.text;
      })
    );

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Here is the context for my question:\n\n${context.join(
            "\n---\n"
          )}`,
        },
        { role: "user", content: args.message },
      ],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content ?? "No response";

    await ctx.runMutation(api.notes.addMessage, {
      documentId: args.documentId,
      message: response,
      isViewer: false,
    });
  },
});

export const addMessage = mutation({
  args: {
    documentId: v.id("documents"),
    message: v.string(),
    isViewer: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new NotaError("You must be logged in to add a message.", {
        toast: {
          variant: "destructive",
        },
      });
    }
    await ctx.db.insert("notes", {
      userId: user._id,
      documentId: args.documentId,
      text: args.message,
      isViewer: args.isViewer,
    });
  },
});