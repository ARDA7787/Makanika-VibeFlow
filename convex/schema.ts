import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // Keep existing tables and add:
  customers: defineTable({
       name: v.string(),
       email: v.string(),
       phone: v.string(),
       address: v.string(),
       latitude: v.number(),
       longitude: v.number(),
  }),
  providers: defineTable({
       name: v.string(),
       services: v.array(v.any()),
       email: v.string(),
       phone: v.string(),
       address: v.string(),
       latitude: v.number(),
       longitude: v.number(),
       rating: v.optional(v.number()),
  }),
  leads: defineTable({
       userId: v.string(),
       issueDescription: v.string(),
       carModel: v.string(),
       status: v.string(),
       issueCategory: v.optional(v.string()),
       assignedProviders: v.optional(v.array(v.any())),
       latitude: v.optional(v.number()),
       longitude: v.optional(v.number()),
  }),
  chatSessions: defineTable({
       userId: v.string(),
       providerId: v.optional(v.string()),
       status: v.string(),
       startedAt: v.number(),
       endedAt: v.optional(v.number()),
  }),
  chatMessages: defineTable({
       sessionId: v.string(),
       sender: v.string(),
       message: v.string(),
       timestamp: v.number(),
  }),
  providerRatings: defineTable({
       providerId: v.string(),
       userId: v.string(),
       rating: v.number(),
       comment: v.string(),
  }),
  whatsappSessions: defineTable({
       phone: v.string(),
       sessionId: v.string(),
       status: v.string(),
  }),
});