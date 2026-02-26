import type { httpRouter } from "convex/server";

import { httpAction } from "./_generated/server";
      import { internal } from "./_generated/api";

      type HttpRouterInstance = ReturnType<typeof httpRouter>;

      export function registerGeneratedWebhookRoutes(http: HttpRouterInstance) {
http.route({
  path: '/whatsapp-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    console.log('📥 Webhook received:', '/whatsapp-webhook', 'POST');
  
    try {
      const requestUrl = new URL(request.url);
    // No authentication required

      const contentType = request.headers.get('content-type');
      let body;
    
      if (contentType?.includes('application/json')) {
        body = await request.json();
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
      } else {
        body = await request.text();
      }

      const headers = Object.fromEntries(request.headers.entries());
      const query = Object.fromEntries(requestUrl.searchParams.entries());
      let flowResult: any = null;

      console.log('📋 Webhook payload (WhatsApp Webhook):', {
        path: '/whatsapp-webhook',
        method: 'POST',
        headers,
        query,
        body
      });

    flowResult = await ctx.runAction(
      internal.actions.processFlow_node_1772034548625_3jepe19,
      {
        input: {
          body,
          headers,
          query,
          method: request.method,
          path: 'whatsapp-webhook',
          url: request.url
        },
      }
    );

    return new Response(JSON.stringify({ 
      success: true, 
      result: flowResult,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
    } catch (error) {
      console.error('❌ Webhook error (/whatsapp-webhook):', error);
      return new Response(JSON.stringify({
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
});

http.route({
  path: '/elevenlabs-tool-call',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    console.log('📥 Webhook received:', '/elevenlabs-tool-call', 'POST');
  
    try {
      const requestUrl = new URL(request.url);
    // No authentication required

      const contentType = request.headers.get('content-type');
      let body;
    
      if (contentType?.includes('application/json')) {
        body = await request.json();
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
      } else {
        body = await request.text();
      }

      const headers = Object.fromEntries(request.headers.entries());
      const query = Object.fromEntries(requestUrl.searchParams.entries());
      let flowResult: any = null;

      console.log('📋 Webhook payload (ElevenLabs Tool Call):', {
        path: '/elevenlabs-tool-call',
        method: 'POST',
        headers,
        query,
        body
      });

    flowResult = await ctx.runAction(
      internal.actions.processFlow_node_1772053936250_5fzu5kb,
      {
        input: {
          body,
          headers,
          query,
          method: request.method,
          path: 'elevenlabs-tool-call',
          url: request.url
        },
      }
    );

    return new Response(JSON.stringify({ 
      success: true, 
      result: flowResult,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
    } catch (error) {
      console.error('❌ Webhook error (/elevenlabs-tool-call):', error);
      return new Response(JSON.stringify({
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
});
      }