import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

export const saveLead = internalMutation({
  args: {
    userId: v.any(),
    carModel: v.any(),
    issueCategory: v.optional(v.any()),
    issueDescription: v.any(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("leads", {
          userId: args.userId,
          carModel: args.carModel,
          issueCategory: args.issueCategory,
          issueDescription: args.issueDescription,
          status: "New",
          latitude: args.latitude,
          longitude: args.longitude,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const assignProvidersToLead = internalMutation({
  args: {
    id: v.id("leads"),
    assignedProviders: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.patch(args.id, {
          assignedProviders: args.assignedProviders,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const fetchAllLeads = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("leads")
       .collect();
  },
});

export const fetchAnalyticsLeads = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("leads")
       .collect();
  },
});

export const fetchAllLeadsForStats = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("leads")
       .collect();
  },
});

export const fetchAllLeadsForAdmin = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("leads")
       .collect();
  },
});