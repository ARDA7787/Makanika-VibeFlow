import { internalQuery } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const findProviders = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("providers")
       .collect();
  },
});

export const fetchAllProviders = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("providers")
       .collect();
  },
});

export const updateProviderRating = internalMutation({
  args: {
    id: v.id("providers"),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.patch(args.id, {
          rating: args.rating,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const fetchAnalyticsProviders = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("providers")
       .collect();
  },
});

export const waFetchProviders = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("providers")
       .collect();
  },
});

export const voiceFetchProviders = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("providers")
       .collect();
  },
});

export const fetchProvidersForTool = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("providers")
       .collect();
  },
});

export const fetchAllProvidersForStats = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("providers")
       .collect();
  },
});