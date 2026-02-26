import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

export const saveProviderRating = internalMutation({
  args: {
    providerId: v.any(),
    userId: v.any(),
    rating: v.number(),
    comment: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("providerRatings", {
          providerId: args.providerId,
          userId: args.userId,
          rating: args.rating,
          comment: args.comment,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const fetchProviderRatings = internalQuery({
  args: { providerId: v.any() },
  handler: async (ctx, args) => {
    return await ctx.db.query("providerRatings")
       
          .filter((q) => q.eq(q.field("providerId"), args.providerId))
       .collect();
  },
});

export const fetchAnalyticsRatings = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("providerRatings")
       .collect();
  },
});