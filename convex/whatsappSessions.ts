import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const saveWASessionRecord = internalMutation({
  args: {
    phone: v.any(),
    sessionId: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("whatsappSessions", {
          phone: args.phone,
          sessionId: args.sessionId,
          status: "active",
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});