import { mutation, query, action } from "./_generated/server";
import { NotaError } from "../lib/errors";
import { authComponent } from "./auth";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";
import pdf from "pdf-parse";

const openai = new OpenAI();

export const ingest = action({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const { storageId } = await ctx.runQuery(api.documents.getById, {
      id: args.documentId,
    });
    const blob = await ctx.storage.get(storageId);
    if (!blob) {
      throw new Error("Could not find file in storage.");
    }
    const { text } = await pdf(Buffer.from(await blob.arrayBuffer()));

    const chunkSize = 2000;
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      const { data } = await openai.embeddings.create({
        input: chunk,
        model: "text-embedding-3-small",
      });
      await ctx.runMutation(api.documents.addChunk, {
        documentId: args.documentId,
        text: chunk,
        embedding: data[0].embedding,
      });
    }
  },
});

export const addChunk = mutation({
  args: {
    documentId: v.id("documents"),
    text: v.string(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chunks", {
      documentId: args.documentId,
      text: args.text,
      embedding: args.embedding,
    });
  },
});

export const getUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new NotaError("You must be logged in to upload a document.", {
        toast: {
          variant: "destructive",
        },
      });
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    storageId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new NotaError("You must be logged in to create a document.", {
        toast: {
          variant: "destructive",
        },
      });
    }
    const documentId = await ctx.db.insert("documents", {
      userId: user._id,
      storageId: args.storageId,
      title: args.title,
    });
    await ctx.scheduler.runAfter(0, api.documents.ingest, {
      documentId,
    });
    return documentId;
  },
});

export const getById = query({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new NotaError("You must be logged in to view a document.", {
        toast: {
          variant: "destructive",
        },
      });
    }
    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== user._id) {
      throw new NotaError("You do not have permission to view this document.", {
        toast: {
          variant: "destructive",
        },
      });
    }
    return document;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});