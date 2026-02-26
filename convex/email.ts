import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";

export const resend: Resend = new Resend(components.resend, {testMode: false});

export const sendEmail_node_1772008855392_r2zrbfb = internalAction({
  args: {
    toEmail: v.string(),
    body: v.string()
  },
  handler: async (ctx, args) => {
    try {
      const result = await resend.sendEmail(ctx, {
        from: "AutoRepair Platform <noreply@yourapp.com>",
        to: args.toEmail,
        subject: "New Auto Repair Request",
        html: args.body,
      });
    
      return {
        success: true,
        messageId: result.id,
        status: 'sent'
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  },
});

export const sendEmail_node_1772029814353_hkvx630 = internalAction({
  args: {
    body: v.string()
  },
  handler: async (ctx, args) => {
    try {
      const result = await resend.sendEmail(ctx, {
        from: "AutoRepair Platform <noreply@yourapp.com>",
        to: "admin@yourapp.com",
        subject: "Customer Requesting Human Support",
        html: args.body,
      });
    
      return {
        success: true,
        messageId: result.id,
        status: 'sent'
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  },
});