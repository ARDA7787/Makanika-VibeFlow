import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertWASession = internalMutation({
  args: {
    userId: v.any(),
    startedAt: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chatSessions", {
          userId: args.userId,
          status: "active",
          startedAt: args.startedAt,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});