import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

export const saveChatMessage = internalMutation({
  args: {
    sessionId: v.any(),
    message: v.any(),
    timestamp: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatMessages", {
          sessionId: args.sessionId,
          message: args.message,
          sender: "user",
          timestamp: args.timestamp,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const saveAgentReply = internalMutation({
  args: {
    sessionId: v.any(),
    message: v.any(),
    timestamp: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatMessages", {
          sessionId: args.sessionId,
          message: args.message,
          sender: "agent",
          timestamp: args.timestamp,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const saveCannedReply = internalMutation({
  args: {
    sessionId: v.any(),
    timestamp: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatMessages", {
          sessionId: args.sessionId,
          message: "A specialist will contact you soon.",
          sender: "agent",
          timestamp: args.timestamp,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const fetchChatMessages = internalQuery({
  args: { sessionId: v.any() },
  handler: async (ctx, args) => {
    return await ctx.db.query("chatMessages")
       
          .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
       .collect();
  },
});

export const fetchAnalyticsMessages = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("chatMessages")
       .collect();
  },
});

export const fetchAllMessagesForSessions = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("chatMessages")
       .collect();
  },
});

export const saveAdminMessage = internalMutation({
  args: {
    sessionId: v.any(),
    message: v.any(),
    timestamp: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatMessages", {
          sessionId: args.sessionId,
          message: args.message,
          sender: "agent",
          timestamp: args.timestamp,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const saveWAUserMessage = internalMutation({
  args: {
    sessionId: v.any(),
    message: v.any(),
    timestamp: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatMessages", {
          sessionId: args.sessionId,
          message: args.message,
          sender: "user",
          timestamp: args.timestamp,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const saveWAAIReply = internalMutation({
  args: {
    sessionId: v.any(),
    message: v.any(),
    timestamp: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatMessages", {
          sessionId: args.sessionId,
          message: args.message,
          sender: "agent",
          timestamp: args.timestamp,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const saveVoiceUserMessage = internalMutation({
  args: {
    sessionId: v.any(),
    message: v.any(),
    timestamp: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatMessages", {
          sessionId: args.sessionId,
          message: args.message,
          sender: "user",
          timestamp: args.timestamp,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const saveVoiceAgentReply = internalMutation({
  args: {
    sessionId: v.any(),
    message: v.any(),
    timestamp: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatMessages", {
          sessionId: args.sessionId,
          message: args.message,
          sender: "agent",
          timestamp: args.timestamp,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const fetchAllMessagesForStats = internalQuery({
  
  handler: async (ctx) => {
    return await ctx.db.query("chatMessages")
       .collect();
  },
});