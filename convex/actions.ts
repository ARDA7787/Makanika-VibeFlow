import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { z } from "zod/v3";
import { aiCarRepairAssistant } from "./agents/aiCarRepairAssistant";
import { parseIssue } from "./agents/parseIssue";
import { internal } from "./_generated/api";
import { __vfTrack, __vfTrackSync } from "./_vibeflowTracking";

export const processRequest_aiCarRepairAssistant = internalAction({
  args: { input: v.any() },
  handler: async (ctx, args) => {
    // Convert input to string if needed
    const inputString = typeof args?.input === 'string' ? args.input : args?.input?.text || JSON.stringify(args?.input);
    
    let content = [{ type: "text", text: inputString }]
    
    if (typeof args?.input !== 'string' && args?.input?.image) {
      content.push({ type: "image", image: args.input.image });
    }
    
    // Call AI agent
    const { thread } = await aiCarRepairAssistant.createThread(ctx);
    
    
    const result = await thread.generateText({ 
      messages: [{ role: "user", content }],
      
    });
    const aiResponse = result.text.trim();
    
    const response = {
      content: aiResponse
    }
    
    return response;
  },
});

export const processRequest_parseIssue = internalAction({
  args: { input: v.any() },
  handler: async (ctx, args) => {
    // Convert input to string if needed
    const inputString = typeof args?.input === 'string' ? args.input : args?.input?.text || JSON.stringify(args?.input);
    
    let content = [{ type: "text", text: inputString }]
    
    if (typeof args?.input !== 'string' && args?.input?.image) {
      content.push({ type: "image", image: args.input.image });
    }
    
    // Call AI agent
    const { thread } = await parseIssue.createThread(ctx);
    
    const result = await thread.generateObject({
      messages: [{ role: "user", content }],
      schema: z.object({ carModel: z.string().describe("The car make and model extracted from the user's text"), issueCategory: z.string().describe("Short category label for the type of car issue"), issueDescription: z.string().describe("Clean, concise summary of the issue") }),
      
    });
    
    const response = result.object
    
    return response;
  },
});

/**
 * HTTP Request: GET
 * Generated from HTTP Request node: node_1772031019471_mrfkj7g
 */
export const getApi_node_1772031019471_mrfkj7g = action({
  args: {
    // Arguments expected by this HTTP request
    address: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const method = 'GET';
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
        // Build query parameters (fields mode)
        const urlWithParams = new URL(url);
        urlWithParams.searchParams.set('key', process.env.GOOGLE_MAPS_API_KEY ?? 'MISSING_KEY');
        urlWithParams.searchParams.set('address', String(args.address ?? ''));
        const finalUrl = urlWithParams.toString();
    
    // Build headers
    const headers: Record<string, string> = {
    };
    
    // Build body
    const body = undefined;
    
    try {
      console.log(`🌐 Making ${method} request to ${finalUrl}`);
    
      const response = await fetch(finalUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    
      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('audio/') || contentType?.includes('image/') || contentType?.includes('video/') || contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binaryString);
        result = base64;
      } else {
        result = await response.text();
      }
    
      // Extract specific path if specified
      return result;
    } catch (error) {
      console.error(`❌ HTTP request failed:`, error);
      throw error;
    }
  },
});

/**
 * Required Environment Variables:
 * - API_ELEVENLABS_KEY: Set this in your Convex deployment
 */
/**
 * HTTP Request: POST
 * Generated from HTTP Request node: node_1772034981723_xpycof7
 */
export const getApi_node_1772034981723_xpycof7 = action({
  args: {
    // Arguments expected by this HTTP request
    base64Audio: v.optional(v.any()),
    mimeType: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const method = 'POST';
    const url = 'https://integration.vibeflow.ai/api/actions/elevenlabs/speech-to-text';
    
    // Build headers
    const headers: Record<string, string> = {
          'Content-Type': 'application/json',
    };
        // Add Bearer token authentication from environment
        const apiKey = process.env.API_ELEVENLABS_KEY;
        if (!apiKey) {
          throw new Error('API_ELEVENLABS_KEY environment variable is required');
        }
        headers.Authorization = `Bearer ${apiKey}`;
    
        // Build body (fields mode)
        const bodyObj: Record<string, any> = {
        "modelId": "scribe_v2"
    };
        bodyObj['base64Audio'] = args.base64Audio ?? '';
        bodyObj['mimeType'] = args.mimeType ?? '';
    // Build body
    const body = bodyObj;
    
    try {
      console.log(`🌐 Making ${method} request to ${url}`);
    
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    
      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('audio/') || contentType?.includes('image/') || contentType?.includes('video/') || contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binaryString);
        result = base64;
      } else {
        result = await response.text();
      }
    
      // Extract specific path if specified
      return result;
    } catch (error) {
      console.error(`❌ HTTP request failed:`, error);
      throw error;
    }
  },
});

/**
 * Required Environment Variables:
 * - API_ELEVENLABS_KEY: Set this in your Convex deployment
 */
/**
 * HTTP Request: POST
 * Generated from HTTP Request node: node_1772047321030_ghby9cu
 */
export const getApi_node_1772047321030_ghby9cu = action({
  args: {
    // Arguments expected by this HTTP request
    base64Audio: v.optional(v.any()),
    mimeType: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const method = 'POST';
    const url = 'https://integration.vibeflow.ai/api/actions/elevenlabs/speech-to-text';
    
    // Build headers
    const headers: Record<string, string> = {
          'Content-Type': 'application/json',
    };
        // Add Bearer token authentication from environment
        const apiKey = process.env.API_ELEVENLABS_KEY;
        if (!apiKey) {
          throw new Error('API_ELEVENLABS_KEY environment variable is required');
        }
        headers.Authorization = `Bearer ${apiKey}`;
    
        // Build body (fields mode)
        const bodyObj: Record<string, any> = {
        "modelId": "scribe_v2"
    };
        bodyObj['base64Audio'] = args.base64Audio ?? '';
        bodyObj['mimeType'] = args.mimeType ?? '';
    // Build body
    const body = bodyObj;
    
    try {
      console.log(`🌐 Making ${method} request to ${url}`);
    
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    
      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('audio/') || contentType?.includes('image/') || contentType?.includes('video/') || contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binaryString);
        result = base64;
      } else {
        result = await response.text();
      }
    
      // Extract specific path if specified
      return result;
    } catch (error) {
      console.error(`❌ HTTP request failed:`, error);
      throw error;
    }
  },
});

/**
 * Required Environment Variables:
 * - API_ELEVENLABS_KEY: Set this in your Convex deployment
 */
/**
 * HTTP Request: POST
 * Generated from HTTP Request node: node_1772047321030_46kg4ey
 */
export const getApi_node_1772047321030_46kg4ey = action({
  args: {
    // Arguments expected by this HTTP request
    text: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const method = 'POST';
    const url = 'https://integration.vibeflow.ai/api/actions/elevenlabs/text-to-speech';
    
    // Build headers
    const headers: Record<string, string> = {
          'Content-Type': 'application/json',
    };
        // Add Bearer token authentication from environment
        const apiKey = process.env.API_ELEVENLABS_KEY;
        if (!apiKey) {
          throw new Error('API_ELEVENLABS_KEY environment variable is required');
        }
        headers.Authorization = `Bearer ${apiKey}`;
    
        // Build body (fields mode)
        const bodyObj: Record<string, any> = {
        "voiceId": "EXAVITQu4vr4xnSDxMaL",
        "modelId": "eleven_multilingual_v2",
        "outputFormat": "mp3_44100_128"
    };
        bodyObj['text'] = args.text ?? '';
    // Build body
    const body = bodyObj;
    
    try {
      console.log(`🌐 Making ${method} request to ${url}`);
    
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    
      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('audio/') || contentType?.includes('image/') || contentType?.includes('video/') || contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binaryString);
        result = base64;
      } else {
        result = await response.text();
      }
    
      // Extract specific path if specified
      return result;
    } catch (error) {
      console.error(`❌ HTTP request failed:`, error);
      throw error;
    }
  },
});

export const processFlow_node_1772008244900_r2444c6 = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772008244900_r2444c6', 'SubmitIssue', args.input, args.input);
    const httpResult_node_1772031019471_mrfkj7g = await __vfTrack(__vibeflowTracking, 'node_1772031019471_mrfkj7g', 'Geocode Address', args.input, async () => {
      
    // Call HTTP request: getApi_node_1772031019471_mrfkj7g (from node: node_1772031019471_mrfkj7g)
    return  await ctx.runAction(api.actions.getApi_node_1772031019471_mrfkj7g, {
      address: args.input?.address,
    });
    });
    const codeResult_node_1772031019471_os5rtsy = await __vfTrack(__vibeflowTracking, 'node_1772031019471_os5rtsy', 'Extract Coordinates', httpResult_node_1772031019471_mrfkj7g, async () => {
      
        // CODE node: Extract Coordinates
        return  await (async function() {
          const input = httpResult_node_1772031019471_mrfkj7g;
          const geoResult = httpResult_node_1772031019471_mrfkj7g;
      const location = geoResult?.results?.[0]?.geometry?.location;
      const lat = location?.lat || 0;
      const lng = location?.lng || 0;
      return { lat, lng };
        })();
    
    });
    const agentResult_node_1772008470000_gxlnwop = await __vfTrack(__vibeflowTracking, 'node_1772008470000_gxlnwop', 'ParseIssue', codeResult_node_1772031019471_os5rtsy, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_parseIssue, {
    input: args.input?.issueDescription
    });
    });
    const mutationResult_node_1772008244900_z6f8hae = await __vfTrack(__vibeflowTracking, 'node_1772008244900_z6f8hae', 'Save Lead', agentResult_node_1772008470000_gxlnwop, async () => {
      
    return  await ctx.runMutation(internal.leads.saveLead, {
      userId: args.input?.userId,
      carModel: agentResult_node_1772008470000_gxlnwop.carModel,
      issueCategory: agentResult_node_1772008470000_gxlnwop.issueCategory,
      issueDescription: agentResult_node_1772008470000_gxlnwop.issueDescription,
      latitude: codeResult_node_1772031019471_os5rtsy?.lat,
      longitude: codeResult_node_1772031019471_os5rtsy?.lng,
    });
    });
    const queryResult_node_1772008668144_xex9hsf = await __vfTrack(__vibeflowTracking, 'node_1772008668144_xex9hsf', 'FindProviders', mutationResult_node_1772008244900_z6f8hae, async () => {
      
    // Call query: findProviders (from node: node_1772008668144_xex9hsf)
    return  await ctx.runQuery(internal.providers.findProviders, {

    });
    });
    const codeResult_node_1772008668144_dnuijlt = await __vfTrack(__vibeflowTracking, 'node_1772008668144_dnuijlt', 'Sort & Filter Providers', queryResult_node_1772008668144_xex9hsf, async () => {
      
        // CODE node: Sort & Filter Providers
        return  await (async function() {
          const input = queryResult_node_1772008668144_xex9hsf;
          const providers = queryResult_node_1772008668144_xex9hsf;
      const category = (agentResult_node_1772008470000_gxlnwop?.issueCategory || "").toLowerCase();
      const userLat = codeResult_node_1772031019471_os5rtsy?.lat || 0;
      const userLng = codeResult_node_1772031019471_os5rtsy?.lng || 0;
      
      function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      }
      
      const filtered = providers.filter(p =>
        p.services && p.services.some(s => s.toLowerCase().includes(category))
      );
      
      const sorted = filtered.map(p => ({
        _id: p._id,
        name: p.name,
        email: p.email,
        distance: haversine(userLat, userLng, p.latitude, p.longitude)
      })).sort((a, b) => a.distance - b.distance);
      
      return sorted.slice(0, 3);
        })();
    
    });
    const mutationResult_node_1772008668144_4vbxmfg = await __vfTrack(__vibeflowTracking, 'node_1772008668144_4vbxmfg', 'Assign Providers to Lead', codeResult_node_1772008668144_dnuijlt, async () => {
      
    return  await ctx.runMutation(internal.leads.assignProvidersToLead, {
      id: mutationResult_node_1772008244900_z6f8hae?._id,
      assignedProviders: Array.isArray(codeResult_node_1772008668144_dnuijlt) ? codeResult_node_1772008668144_dnuijlt : [],
    });
    });
    
    const withTimeout_node_1772008855392_379b3o4 = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
      ]);
    };
    const items_node_1772008855392_379b3o4 = Array.isArray(codeResult_node_1772008668144_dnuijlt) ? codeResult_node_1772008668144_dnuijlt : [];
    const loopResults_node_1772008855392_379b3o4: any[] = [];
    for (const item_node_1772008855392_379b3o4 of items_node_1772008855392_379b3o4) {
      try {

        const value = await withTimeout_node_1772008855392_379b3o4((async () => { return item_node_1772008855392_379b3o4; })(), 30000000);
        loopResults_node_1772008855392_379b3o4.push(value);
      } catch (_) {
        // continueOnError=true: skip this item
      }
    }

    const returnValue_node_1772008668144_zby9sjb = await __vfTrack(__vibeflowTracking, 'node_1772008668144_zby9sjb', 'Return Lead with Providers', loopResults_node_1772008855392_379b3o4, async () => {
      
    return  loopResults_node_1772008855392_379b3o4;

    });

    const __finalResult = returnValue_node_1772008668144_zby9sjb;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772008244900_jjeqg0p = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772008244900_jjeqg0p', 'SendChatMessage', args.input, args.input);    let returnValue_node_1772008244900_0w6xqca;

    const mutationResult_node_1772008244900_oiv4q4w = await __vfTrack(__vibeflowTracking, 'node_1772008244900_oiv4q4w', 'Save Chat Message', args.input, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveChatMessage, {
      sessionId: args.input.sessionId,
      message: args.input.message,
      timestamp: Date.now(),
    });
    });
    // IF node node_1772029814353_91j1ig1
    const left_node_1772029814353_91j1ig1_0 = /(human|agent|representative)/i.test(args.input?.message);
    const right_node_1772029814353_91j1ig1_0 = true;
    const cond_node_1772029814353_91j1ig1_0 = left_node_1772029814353_91j1ig1_0 === right_node_1772029814353_91j1ig1_0;
    const cond_node_1772029814353_91j1ig1 = cond_node_1772029814353_91j1ig1_0;
    __vfTrackSync(__vibeflowTracking, 'node_1772029814353_91j1ig1', 'Escalation Check', mutationResult_node_1772008244900_oiv4q4w, { conditionResult: cond_node_1772029814353_91j1ig1 });

    let branchResult_node_1772029814353_91j1ig1 = mutationResult_node_1772008244900_oiv4q4w;
    if (cond_node_1772029814353_91j1ig1) {
      const mutationResult_canned = await __vfTrack(__vibeflowTracking, 'node_1772029814353_qqm2s57', 'Save Canned Reply', mutationResult_node_1772008244900_oiv4q4w, async () => {
        return await ctx.runMutation(internal.chatMessages.saveCannedReply, {
          sessionId: args.input?.sessionId,
          timestamp: Date.now(),
        });
      });
      const returnValue_escalation = await __vfTrack(__vibeflowTracking, 'node_1772029814353_nd7jwdc', 'Return Canned Message', mutationResult_canned, async () => {
        return "A specialist will contact you soon.";
      });
      branchResult_node_1772029814353_91j1ig1 = returnValue_escalation;
      returnValue_node_1772008244900_0w6xqca = returnValue_escalation;
    } else {
      
    const agentResult_node_1772008244900_763ch97 = await __vfTrack(__vibeflowTracking, 'node_1772008244900_763ch97', 'AI Car Repair Assistant', mutationResult_node_1772008244900_oiv4q4w, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_aiCarRepairAssistant, {
    input: args.input?.message
    });
    });
      branchResult_node_1772029814353_91j1ig1 = agentResult_node_1772008244900_763ch97;
      
    const mutationResult_node_1772008244900_f1t4yz7 = await __vfTrack(__vibeflowTracking, 'node_1772008244900_f1t4yz7', 'Save Agent Reply', agentResult_node_1772008244900_763ch97, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveAgentReply, {
      sessionId: args.input?.sessionId,
      message: agentResult_node_1772008244900_763ch97?.content ?? agentResult_node_1772008244900_763ch97,
      timestamp: Date.now(),
    });
    });
      branchResult_node_1772029814353_91j1ig1 = mutationResult_node_1772008244900_f1t4yz7;
      
    returnValue_node_1772008244900_0w6xqca = await __vfTrack(__vibeflowTracking, 'node_1772008244900_0w6xqca', 'Return Agent Reply', mutationResult_node_1772008244900_f1t4yz7, async () => {
      
    return  mutationResult_node_1772008244900_f1t4yz7;

    });
      branchResult_node_1772029814353_91j1ig1 = returnValue_node_1772008244900_0w6xqca;
    }

    const __finalResult = branchResult_node_1772029814353_91j1ig1;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772008244900_r5sv0js = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772008244900_r5sv0js', 'SubmitRating', args.input, args.input);
    const mutationResult_node_1772008244900_ermgtqy = await __vfTrack(__vibeflowTracking, 'node_1772008244900_ermgtqy', 'Save Provider Rating', args.input, async () => {
      
    return  await ctx.runMutation(internal.providerRatings.saveProviderRating, {
      providerId: args.input.providerId,
      userId: args.input.userId,
      rating: args.input.rating,
      comment: args.input.comment,
    });
    });
    const queryResult_node_1772030777132_0azy4nc = await __vfTrack(__vibeflowTracking, 'node_1772030777132_0azy4nc', 'Fetch Provider Ratings', mutationResult_node_1772008244900_ermgtqy, async () => {
      
    // Call query: fetchProviderRatings (from node: node_1772030777132_0azy4nc)
    return  await ctx.runQuery(internal.providerRatings.fetchProviderRatings, {
      providerId: args.input?.providerId,
    });
    });
    const codeResult_node_1772030777132_3zklzvu = await __vfTrack(__vibeflowTracking, 'node_1772030777132_3zklzvu', 'Compute Average Rating', queryResult_node_1772030777132_0azy4nc, async () => {
      
        // CODE node: Compute Average Rating
        return  await (async function() {
          const input = queryResult_node_1772030777132_0azy4nc;
          const ratings = queryResult_node_1772030777132_0azy4nc;
      const providerId = args.input?.providerId;
      const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
      const averageRating = ratings.length > 0 ? total / ratings.length : 0;
      return { providerId, averageRating: Math.round(averageRating * 10) / 10 };
        })();
    
    });
    const mutationResult_node_1772030777132_v2b67uj = await __vfTrack(__vibeflowTracking, 'node_1772030777132_v2b67uj', 'Update Provider Rating', codeResult_node_1772030777132_3zklzvu, async () => {
      
    return  await ctx.runMutation(internal.providers.updateProviderRating, {
      id: args.input?.providerId,
      rating: codeResult_node_1772030777132_3zklzvu.averageRating,
    });
    });
    const returnValue_node_1772030777132_nyrn0k7 = await __vfTrack(__vibeflowTracking, 'node_1772030777132_nyrn0k7', 'Return Success', mutationResult_node_1772030777132_v2b67uj, async () => {
      
    return  "Rating submitted and provider score updated successfully.";

    });

    const __finalResult = returnValue_node_1772030777132_nyrn0k7;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_frontend_1772029814354_oflh77z = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'frontend_1772029814354_oflh77z', 'UI for Save Canned Reply', args.input, args.input);
    const mutationResult_node_1772029814353_qqm2s57 = await __vfTrack(__vibeflowTracking, 'node_1772029814353_qqm2s57', 'Save Canned Reply', args.input, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveCannedReply, {
      sessionId: args.input?.sessionId,
      timestamp: Date.now(),
    });
    });
    const returnValue_node_1772029814353_nd7jwdc = await __vfTrack(__vibeflowTracking, 'node_1772029814353_nd7jwdc', 'Return Canned Message', mutationResult_node_1772029814353_qqm2s57, async () => {
      
    return  "A specialist will contact you soon.";

    });

    const __finalResult = returnValue_node_1772029814353_nd7jwdc;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772029994867_m234cg4 = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772029994867_m234cg4', 'GetNearbyProviders', args.input, args.input);
    const queryResult_node_1772029994867_9bp9ha1 = await __vfTrack(__vibeflowTracking, 'node_1772029994867_9bp9ha1', 'FetchAllProviders', args.input, async () => {
      
    // Call query: fetchAllProviders (from node: node_1772029994867_9bp9ha1)
    return  await ctx.runQuery(internal.providers.fetchAllProviders, {

    });
    });
    const codeResult_node_1772029994867_em527wj = await __vfTrack(__vibeflowTracking, 'node_1772029994867_em527wj', 'Sort Providers by Distance', queryResult_node_1772029994867_9bp9ha1, async () => {
      
        // CODE node: Sort Providers by Distance
        return  await (async function() {
          const input = queryResult_node_1772029994867_9bp9ha1;
          const providers = queryResult_node_1772029994867_9bp9ha1;
      const userLat = args.input?.latitude || 0;
      const userLng = args.input?.longitude || 0;
      
      function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      }
      
      return providers.map(p => ({
        _id: p._id,
        name: p.name,
        services: p.services,
        email: p.email,
        phone: p.phone,
        address: p.address,
        rating: p.rating || 0,
        distance: haversine(userLat, userLng, p.latitude, p.longitude)
      })).sort((a, b) => a.distance - b.distance);
        })();
    
    });
    const returnValue_node_1772029994867_w0d0jhe = await __vfTrack(__vibeflowTracking, 'node_1772029994867_w0d0jhe', 'Return Nearby Providers', codeResult_node_1772029994867_em527wj, async () => {
      
    return  codeResult_node_1772029994867_em527wj;

    });
    const returnValue_node_1772055936312_gt5df2q = await __vfTrack(__vibeflowTracking, 'node_1772055936312_gt5df2q', 'Return All Providers', queryResult_node_1772029994867_9bp9ha1, async () => {
      
    return  queryResult_node_1772029994867_9bp9ha1;

    });

    const __finalResult = {
      Return_Nearby_Providers__w0d0jhe: returnValue_node_1772029994867_w0d0jhe,
      Return_All_Providers__gt5df2q: returnValue_node_1772055936312_gt5df2q,
    };
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772030272591_mnlfn7p = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772030272591_mnlfn7p', 'GetChatHistory', args.input, args.input);
    const queryResult_node_1772030272591_rb8975s = await __vfTrack(__vibeflowTracking, 'node_1772030272591_rb8975s', 'FetchChatMessages', args.input, async () => {
      
    // Call query: fetchChatMessages (from node: node_1772030272591_rb8975s)
    return  await ctx.runQuery(internal.chatMessages.fetchChatMessages, {
      sessionId: args.input?.sessionId,
    });
    });
    const codeResult_node_1772030272591_gmp7r5d = await __vfTrack(__vibeflowTracking, 'node_1772030272591_gmp7r5d', 'Sort Messages by Timestamp', queryResult_node_1772030272591_rb8975s, async () => {
      
        // CODE node: Sort Messages by Timestamp
        return  await (async function() {
          const input = queryResult_node_1772030272591_rb8975s;
          const messages = queryResult_node_1772030272591_rb8975s;
      return messages.sort((a, b) => a.timestamp - b.timestamp);
        })();
    
    });
    const returnValue_node_1772030272591_uqcmvd9 = await __vfTrack(__vibeflowTracking, 'node_1772030272591_uqcmvd9', 'Return Chat History', codeResult_node_1772030272591_gmp7r5d, async () => {
      
    return  codeResult_node_1772030272591_gmp7r5d;

    });

    const __finalResult = returnValue_node_1772030272591_uqcmvd9;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772030453405_fd9dht9 = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772030453405_fd9dht9', 'GetLeads', args.input, args.input);
    const queryResult_node_1772030453406_apij6kq = await __vfTrack(__vibeflowTracking, 'node_1772030453406_apij6kq', 'FetchAllLeads', args.input, async () => {
      
    // Call query: fetchAllLeads (from node: node_1772030453406_apij6kq)
    return  await ctx.runQuery(internal.leads.fetchAllLeads, {

    });
    });
    const codeResult_node_1772030453406_x1hanmp = await __vfTrack(__vibeflowTracking, 'node_1772030453406_x1hanmp', 'Filter Provider Leads', queryResult_node_1772030453406_apij6kq, async () => {
      
        // CODE node: Filter Provider Leads
        return  await (async function() {
          const input = queryResult_node_1772030453406_apij6kq;
          const leads = queryResult_node_1772030453406_apij6kq;
      const providerId = args.input?.providerId;
      
      return leads
        .filter(lead => {
          const hasProvider = Array.isArray(lead.assignedProviders) &&
            lead.assignedProviders.some(p => p._id === providerId || p === providerId);
          const validStatus = lead.status === "New" || lead.status === "Contacted";
          return hasProvider && validStatus;
        })
        .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0));
        })();
    
    });
    const returnValue_node_1772030453406_lbove6w = await __vfTrack(__vibeflowTracking, 'node_1772030453406_lbove6w', 'Return Provider Leads', codeResult_node_1772030453406_x1hanmp, async () => {
      
    return  codeResult_node_1772030453406_x1hanmp;

    });

    const __finalResult = returnValue_node_1772030453406_lbove6w;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772031872608_cn05ee5 = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772031872608_cn05ee5', 'GetAdminAnalytics', args.input, args.input);
    const queryResult_node_1772031872608_c96ei6d = await __vfTrack(__vibeflowTracking, 'node_1772031872608_c96ei6d', 'Fetch Analytics Leads', args.input, async () => {
      
    // Call query: fetchAnalyticsLeads (from node: node_1772031872608_c96ei6d)
    return  await ctx.runQuery(internal.leads.fetchAnalyticsLeads, {

    });
    });
    const queryResult_node_1772031872608_bnqb05l = await __vfTrack(__vibeflowTracking, 'node_1772031872608_bnqb05l', 'Fetch Analytics Messages', queryResult_node_1772031872608_c96ei6d, async () => {
      
    // Call query: fetchAnalyticsMessages (from node: node_1772031872608_bnqb05l)
    return  await ctx.runQuery(internal.chatMessages.fetchAnalyticsMessages, {

    });
    });
    const queryResult_node_1772031872608_m94p5nk = await __vfTrack(__vibeflowTracking, 'node_1772031872608_m94p5nk', 'Fetch Analytics Providers', queryResult_node_1772031872608_bnqb05l, async () => {
      
    // Call query: fetchAnalyticsProviders (from node: node_1772031872608_m94p5nk)
    return  await ctx.runQuery(internal.providers.fetchAnalyticsProviders, {

    });
    });
    const queryResult_node_1772031872608_cbcekjk = await __vfTrack(__vibeflowTracking, 'node_1772031872608_cbcekjk', 'Fetch Analytics Ratings', queryResult_node_1772031872608_m94p5nk, async () => {
      
    // Call query: fetchAnalyticsRatings (from node: node_1772031872608_cbcekjk)
    return  await ctx.runQuery(internal.providerRatings.fetchAnalyticsRatings, {

    });
    });
    const codeResult_node_1772031872608_72if0um = await __vfTrack(__vibeflowTracking, 'node_1772031872608_72if0um', 'Compute Analytics', queryResult_node_1772031872608_cbcekjk, async () => {
      
        // CODE node: Compute Analytics
        return  await (async function() {
          const input = queryResult_node_1772031872608_cbcekjk;
          const leads = queryResult_node_1772031872608_c96ei6d;
      const messages = queryResult_node_1772031872608_bnqb05l;
      const providers = queryResult_node_1772031872608_m94p5nk;
      const ratings = queryResult_node_1772031872608_cbcekjk;
      
      // Escalation detection: messages with sender="agent" and the canned escalation text
      const escalationMessages = messages.filter(m => 
        m.sender === "agent" && m.message === "A specialist will contact you soon."
      );
      
      // Unique sessions
      const allSessionIds = [...new Set(messages.map(m => m.sessionId))];
      const escalatedSessionIds = [...new Set(escalationMessages.map(m => m.sessionId))];
      
      // Agent messages (AI-handled, non-escalation)
      const aiMessages = messages.filter(m => m.sender === "agent" && m.message !== "A specialist will contact you soon.");
      const userMessages = messages.filter(m => m.sender === "user");
      
      // Average rating
      const avgRating = ratings.length > 0 
        ? Math.round((ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length) * 10) / 10 
        : 0;
      
      // Leads by category
      const leadsByCategory = leads.reduce((acc, lead) => {
        const cat = lead.issueCategory || "Unknown";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});
      
      // Messages per day (last 7 days)
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const recentMessages = messages.filter(m => m.timestamp >= sevenDaysAgo);
      const messagesByDay = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now - i * 24 * 60 * 60 * 1000);
        const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        messagesByDay[key] = 0;
      }
      recentMessages.forEach(m => {
        const d = new Date(m.timestamp);
        const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (messagesByDay[key] !== undefined) messagesByDay[key]++;
      });
      
      return {
        totalLeads: leads.length,
        totalSessions: allSessionIds.length,
        totalMessages: messages.length,
        totalAiMessages: aiMessages.length,
        totalUserMessages: userMessages.length,
        escalationCount: escalatedSessionIds.length,
        escalationRate: allSessionIds.length > 0 ? Math.round((escalatedSessionIds.length / allSessionIds.length) * 100) : 0,
        totalProviders: providers.length,
        avgRating,
        leadsByCategory,
        messagesByDay,
        recentEscalations: escalationMessages
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10)
          .map(m => ({ sessionId: m.sessionId, timestamp: m.timestamp, _id: m._id }))
      };
        })();
    
    });
    const returnValue_node_1772031872608_mu2vtar = await __vfTrack(__vibeflowTracking, 'node_1772031872608_mu2vtar', 'Return Analytics', codeResult_node_1772031872608_72if0um, async () => {
      
    return  codeResult_node_1772031872608_72if0um;

    });

    const __finalResult = returnValue_node_1772031872608_mu2vtar;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772031872608_f5f3g94 = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772031872608_f5f3g94', 'GetAllSessions', args.input, args.input);
    const queryResult_node_1772031872608_en04num = await __vfTrack(__vibeflowTracking, 'node_1772031872608_en04num', 'Fetch All Messages For Sessions', args.input, async () => {
      
    // Call query: fetchAllMessagesForSessions (from node: node_1772031872608_en04num)
    return  await ctx.runQuery(internal.chatMessages.fetchAllMessagesForSessions, {

    });
    });
    const codeResult_node_1772031872608_hvt1kg1 = await __vfTrack(__vibeflowTracking, 'node_1772031872608_hvt1kg1', 'Group Sessions', queryResult_node_1772031872608_en04num, async () => {
      
        // CODE node: Group Sessions
        return  await (async function() {
          const input = queryResult_node_1772031872608_en04num;
          const messages = queryResult_node_1772031872608_en04num;
      
      // Group messages by sessionId
      const sessionsMap = {};
      messages.forEach(m => {
        if (!sessionsMap[m.sessionId]) {
          sessionsMap[m.sessionId] = {
            sessionId: m.sessionId,
            messages: [],
            messageCount: 0,
            isEscalated: false,
            lastMessageAt: 0,
            lastMessage: ""
          };
        }
        sessionsMap[m.sessionId].messages.push(m);
        sessionsMap[m.sessionId].messageCount++;
        if (m.timestamp > sessionsMap[m.sessionId].lastMessageAt) {
          sessionsMap[m.sessionId].lastMessageAt = m.timestamp;
          sessionsMap[m.sessionId].lastMessage = m.message;
        }
        if (m.sender === "agent" && m.message === "A specialist will contact you soon.") {
          sessionsMap[m.sessionId].isEscalated = true;
        }
      });
      
      return Object.values(sessionsMap)
        .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
        })();
    
    });
    const returnValue_node_1772031872608_vl3kbn5 = await __vfTrack(__vibeflowTracking, 'node_1772031872608_vl3kbn5', 'Return All Sessions', codeResult_node_1772031872608_hvt1kg1, async () => {
      
    return  codeResult_node_1772031872608_hvt1kg1;

    });

    const __finalResult = returnValue_node_1772031872608_vl3kbn5;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772031872609_6ae4gpc = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772031872609_6ae4gpc', 'AdminSendMessage', args.input, args.input);
    const mutationResult_node_1772031872609_batoe04 = await __vfTrack(__vibeflowTracking, 'node_1772031872609_batoe04', 'Save Admin Message', args.input, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveAdminMessage, {
      sessionId: args.input?.sessionId,
      message: args.input?.message,
      timestamp: Date.now(),
    });
    });
    const returnValue_node_1772031872609_ge05tzg = await __vfTrack(__vibeflowTracking, 'node_1772031872609_ge05tzg', 'Return Admin Message', mutationResult_node_1772031872609_batoe04, async () => {
      
    return  mutationResult_node_1772031872609_batoe04;

    });

    const __finalResult = returnValue_node_1772031872609_ge05tzg;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772034548625_3jepe19 = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
        let returnValue_node_1772034548625_ssukjkq;

    const mutationResult_node_1772034548625_tfwhkcx = await __vfTrack(__vibeflowTracking, 'node_1772034548625_tfwhkcx', 'Upsert WA Session', args.input, async () => {
      
    return  await ctx.runMutation(internal.chatSessions.upsertWASession, {
      userId: args.input?.body.From,
      startedAt: Date.now(),
    });
    });
    const mutationResult_node_1772034548625_uyrx44x = await __vfTrack(__vibeflowTracking, 'node_1772034548625_uyrx44x', 'Save WA Session Record', mutationResult_node_1772034548625_tfwhkcx, async () => {
      
    return  await ctx.runMutation(internal.whatsappSessions.saveWASessionRecord, {
      phone: args.input?.body.From,
      sessionId: mutationResult_node_1772034548625_tfwhkcx?._id,
    });
    });
    const mutationResult_node_1772034548625_iyfp8u0 = await __vfTrack(__vibeflowTracking, 'node_1772034548625_iyfp8u0', 'Save WA User Message', mutationResult_node_1772034548625_uyrx44x, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveWAUserMessage, {
      sessionId: mutationResult_node_1772034548625_tfwhkcx?._id,
      message: args.input?.body.Body,
      timestamp: Date.now(),
    });
    });
    const codeResult_node_1772034981723_zulllyy = await __vfTrack(__vibeflowTracking, 'node_1772034981723_zulllyy', 'Prepare Input', mutationResult_node_1772034548625_iyfp8u0, async () => {
      
        // CODE node: Prepare Input
        return  await (async function() {
          const input = mutationResult_node_1772034548625_iyfp8u0;
          const body = args.input?.body;
      const mediaContentType = body.MediaContentType0 || "";
      const mediaUrl = body.MediaUrl0 || "";
      const textBody = body.Body || "";
      
      const isAudio = mediaContentType.startsWith("audio/") || mediaContentType.includes("ogg") || mediaContentType.includes("mpeg");
      
      if (!isAudio) {
        return { isAudio: false, base64Audio: null, mimeType: null, textBody };
      }
      
      // Fetch audio from Twilio's media URL (requires Twilio credentials via basic auth)
      // The media URL is publicly accessible from Twilio with account credentials
      const response = await fetch(mediaUrl, {
        headers: {
          "Accept": mediaContentType
        }
      });
      
      if (!response.ok) {
        return { isAudio: false, base64Audio: null, mimeType: null, textBody: textBody || "[voice message could not be fetched]" };
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryString = Array.from(uint8Array).map(b => String.fromCharCode(b)).join('');
      const base64Audio = btoa(binaryString);
      const mimeType = mediaContentType || "audio/ogg";
      
      return { isAudio: true, base64Audio, mimeType, textBody: null };
        })();
    
    });
    // IF node node_1772034981723_3e9u74j
    const left_node_1772034981723_3e9u74j_0 = codeResult_node_1772034981723_zulllyy?.isAudio;
    const right_node_1772034981723_3e9u74j_0 = true;
    const cond_node_1772034981723_3e9u74j_0 = left_node_1772034981723_3e9u74j_0 === right_node_1772034981723_3e9u74j_0;
    const cond_node_1772034981723_3e9u74j = cond_node_1772034981723_3e9u74j_0;
    __vfTrackSync(__vibeflowTracking, 'node_1772034981723_3e9u74j', 'Is Voice Message?', codeResult_node_1772034981723_zulllyy, { conditionResult: cond_node_1772034981723_3e9u74j });

    let branchResult_node_1772034981723_3e9u74j = codeResult_node_1772034981723_zulllyy;
    if (cond_node_1772034981723_3e9u74j) {
      
    const httpResult_node_1772034981723_xpycof7 = await __vfTrack(__vibeflowTracking, 'node_1772034981723_xpycof7', 'ElevenLabs Transcribe', codeResult_node_1772034981723_zulllyy, async () => {
      
    // Call HTTP request: getApi_node_1772034981723_xpycof7 (from node: node_1772034981723_xpycof7)
    return  await ctx.runAction(api.actions.getApi_node_1772034981723_xpycof7, {
      base64Audio: codeResult_node_1772034981723_zulllyy?.base64Audio,
      mimeType: codeResult_node_1772034981723_zulllyy?.mimeType,
    });
    });
      branchResult_node_1772034981723_3e9u74j = httpResult_node_1772034981723_xpycof7;
      
    const codeResult_node_1772034981723_7cucojd = await __vfTrack(__vibeflowTracking, 'node_1772034981723_7cucojd', 'Extract Transcript', httpResult_node_1772034981723_xpycof7, async () => {
      
        // CODE node: Extract Transcript
        return  await (async function() {
          const input = httpResult_node_1772034981723_xpycof7;
          const result = httpResult_node_1772034981723_xpycof7;
      // ElevenLabs STT returns plain text transcription
      const transcription = typeof result === "string" ? result : (result?.text || result?.transcription || JSON.stringify(result));
      return { resolvedText: transcription };
        })();
    
    });
      branchResult_node_1772034981723_3e9u74j = codeResult_node_1772034981723_7cucojd;
      
    const agentResult_node_1772034981723_7bzglw2 = await __vfTrack(__vibeflowTracking, 'node_1772034981723_7bzglw2', 'Extract English Intent', codeResult_node_1772034981723_7cucojd, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_parseIssue, {
    input: codeResult_node_1772034981723_7cucojd.resolvedText
    });
    });
      branchResult_node_1772034981723_3e9u74j = agentResult_node_1772034981723_7bzglw2;
      
    const agentResult_node_1772055936312_1armx69 = await __vfTrack(__vibeflowTracking, 'node_1772055936312_1armx69', 'WA Parse Issue', agentResult_node_1772034981723_7bzglw2, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_parseIssue, {
    input: agentResult_node_1772034981723_7bzglw2.englishMessage
    });
    });
      branchResult_node_1772034981723_3e9u74j = agentResult_node_1772055936312_1armx69;
      
    const queryResult_node_1772034548625_r3si3sc = await __vfTrack(__vibeflowTracking, 'node_1772034548625_r3si3sc', 'WA Fetch Providers', agentResult_node_1772055936312_1armx69, async () => {
      return await ctx.runQuery(internal.providers.waFetchProviders, {});
    });

    const codeResult_node_1772034548625_jtb58h8 = await __vfTrack(__vibeflowTracking, 'node_1772034548625_jtb58h8', 'Build WA Context', queryResult_node_1772034548625_r3si3sc, async () => {
      
        // CODE node: Build WA Context
        return  await (async function() {
          const input = queryResult_node_1772034548625_r3si3sc;
          const parsed = agentResult_node_1772055936312_1armx69;
      const providers = queryResult_node_1772034548625_r3si3sc;
      const intent = agentResult_node_1772034981723_7bzglw2;
      const rawMessage = args.input?.body.Body || "[voice message]";
      const senderPhone = args.input?.body.From || "";
      const senderName = args.input?.body.ProfileName || "Customer";
      const category = (parsed.issueCategory || "").toLowerCase();
      const detectedLanguage = intent.detectedLanguage || "English";
      
      const matchingProviders = providers
        .filter(p => p.services && p.services.some(s => String(s).toLowerCase().includes(category)))
        .slice(0, 3);
      
      const providerContext = matchingProviders.length > 0
        ? matchingProviders.map((p, i) => `${i+1}. ${p.name} | Phone: ${p.phone} | Email: ${p.email} | Address: ${p.address} | Rating: ${p.rating || "N/A"}`).join("\n")
        : "No specific providers found for this category in the database.";
      
      const contextPrompt = `Customer Name: ${senderName}
      Customer's Original Language: ${detectedLanguage}
      Customer's Original Message: ${rawMessage}
      Translated/Clarified Message (English): ${intent.englishMessage}
      Detected Issue Category: ${parsed.issueCategory}
      Car Model: ${parsed.carModel}
      Issue Summary: ${parsed.issueDescription}
      
      Available Nearby Providers for this Issue:
      ${providerContext}
      
      IMPORTANT: Respond to the customer in ${detectedLanguage} (their original language). Be friendly, concise, and WhatsApp-friendly (under 300 words). If providers are available, mention them. Always be empathetic and professional.`;
      
      return { contextPrompt, senderName, senderPhone, detectedLanguage };
        })();
    
    });
      branchResult_node_1772034981723_3e9u74j = codeResult_node_1772034548625_jtb58h8;
      
    const agentResult_node_1772034548625_virwgu3 = await __vfTrack(__vibeflowTracking, 'node_1772034548625_virwgu3', 'WA AI Assistant', codeResult_node_1772034548625_jtb58h8, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_aiCarRepairAssistant, {
    input: codeResult_node_1772034548625_jtb58h8?.contextPrompt
    });
    });
      branchResult_node_1772034981723_3e9u74j = agentResult_node_1772034548625_virwgu3;
      
    const mutationResult_node_1772034548625_dt99v7z = await __vfTrack(__vibeflowTracking, 'node_1772034548625_dt99v7z', 'Save WA AI Reply', agentResult_node_1772034548625_virwgu3, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveWAAIReply, {
      sessionId: mutationResult_node_1772034548625_tfwhkcx?._id,
      message: agentResult_node_1772034548625_virwgu3?.content,
      timestamp: Date.now(),
    });
    });
      branchResult_node_1772034981723_3e9u74j = mutationResult_node_1772034548625_dt99v7z;
      
    returnValue_node_1772034548625_ssukjkq = await __vfTrack(__vibeflowTracking, 'node_1772034548625_ssukjkq', 'Return WA Success', mutationResult_node_1772034548625_dt99v7z, async () => {
      
    return  "OK";

    });
      branchResult_node_1772034981723_3e9u74j = returnValue_node_1772034548625_ssukjkq;
    } else {
      
    const output_node_1772034981723_o3prnid = await __vfTrack(__vibeflowTracking, 'node_1772034981723_o3prnid', 'Use Text Body', codeResult_node_1772034981723_zulllyy, async () => {
      

    // EDIT FIELDS node node_1772034981723_o3prnid
    const input_node_1772034981723_o3prnid = codeResult_node_1772034981723_zulllyy;
    
    
    const setByPath_node_1772034981723_o3prnid = (obj: any, path: string, value: any) => {
      const keys = path.split('.');
      let ref = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (typeof ref[k] !== 'object' || ref[k] === null) ref[k] = {};
        ref = ref[k];
      }
      ref[keys[keys.length - 1]] = value;
    };
    
    return  {};
  
    setByPath_node_1772034981723_o3prnid(output_node_1772034981723_o3prnid, "resolvedText", input_node_1772034981723_o3prnid.textBody);
  
    });
      branchResult_node_1772034981723_3e9u74j = output_node_1772034981723_o3prnid;
    }

    const __finalResult = branchResult_node_1772034981723_3e9u74j;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772047321030_41foas9 = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772047321030_41foas9', 'VoiceChat', args.input, args.input);
    const httpResult_node_1772047321030_ghby9cu = await __vfTrack(__vibeflowTracking, 'node_1772047321030_ghby9cu', 'Voice STT', args.input, async () => {
      
    // Call HTTP request: getApi_node_1772047321030_ghby9cu (from node: node_1772047321030_ghby9cu)
    return  await ctx.runAction(api.actions.getApi_node_1772047321030_ghby9cu, {
      base64Audio: args.input?.base64Audio,
      mimeType: args.input?.mimeType,
    });
    });
    const codeResult_node_1772047321030_y2fucoo = await __vfTrack(__vibeflowTracking, 'node_1772047321030_y2fucoo', 'Extract Voice Transcript', httpResult_node_1772047321030_ghby9cu, async () => {
      
        // CODE node: Extract Voice Transcript
        return  await (async function() {
          const input = httpResult_node_1772047321030_ghby9cu;
          const result = httpResult_node_1772047321030_ghby9cu;
      const transcription = typeof result === "string" 
        ? result 
        : (result?.text || result?.transcription || result?.words?.map(w => w.text).join(" ") || JSON.stringify(result));
      return { resolvedText: transcription || "[Could not transcribe audio]" };
        })();
    
    });
    const mutationResult_node_1772047321030_gzlb0yp = await __vfTrack(__vibeflowTracking, 'node_1772047321030_gzlb0yp', 'Save Voice User Message', codeResult_node_1772047321030_y2fucoo, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveVoiceUserMessage, {
      sessionId: args.input?.sessionId,
      message: codeResult_node_1772047321030_y2fucoo?.resolvedText,
      timestamp: Date.now(),
    });
    });
    const agentResult_node_1772047321030_n9nov6f = await __vfTrack(__vibeflowTracking, 'node_1772047321030_n9nov6f', 'Voice Extract Intent', mutationResult_node_1772047321030_gzlb0yp, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_parseIssue, {
    input: codeResult_node_1772047321030_y2fucoo?.resolvedText
    });
    });
    const agentResult_node_1772047321030_xtabz8i = await __vfTrack(__vibeflowTracking, 'node_1772047321030_xtabz8i', 'Voice Parse Issue', agentResult_node_1772047321030_n9nov6f, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_parseIssue, {
    input: agentResult_node_1772047321030_n9nov6f?.englishMessage
    });
    });
    const queryResult_node_1772047321030_xld4ic4 = await __vfTrack(__vibeflowTracking, 'node_1772047321030_xld4ic4', 'Voice Fetch Providers', agentResult_node_1772047321030_xtabz8i, async () => {
      
    // Call query: voiceFetchProviders (from node: node_1772047321030_xld4ic4)
    return  await ctx.runQuery(internal.providers.voiceFetchProviders, {

    });
    });
    const codeResult_node_1772047321030_2x26dlt = await __vfTrack(__vibeflowTracking, 'node_1772047321030_2x26dlt', 'Build Voice Context', queryResult_node_1772047321030_xld4ic4, async () => {
      
        // CODE node: Build Voice Context
        return  await (async function() {
          const input = queryResult_node_1772047321030_xld4ic4;
          const parsed = agentResult_node_1772047321030_xtabz8i;
      const providers = queryResult_node_1772047321030_xld4ic4;
      const intent = agentResult_node_1772047321030_n9nov6f;
      const category = (parsed.issueCategory || "").toLowerCase();
      const detectedLanguage = intent.detectedLanguage || "English";
      const originalText = codeResult_node_1772047321030_y2fucoo?.resolvedText;
      
      const matchingProviders = providers
        .filter(p => p.services && p.services.some(s => String(s).toLowerCase().includes(category)))
        .slice(0, 3);
      
      const providerContext = matchingProviders.length > 0
        ? matchingProviders.map((p, i) => `${i+1}. ${p.name} | Phone: ${p.phone} | Address: ${p.address} | Rating: ${p.rating || "New"}`).join("\n")
        : "No specific providers found in the database for this issue category.";
      
      const contextPrompt = `You are a helpful auto-repair voice assistant. The customer spoke in ${detectedLanguage}.\n\nCustomer's original message (transcribed): ${originalText}\nTranslated to English: ${intent.englishMessage}\nDetected car issue category: ${parsed.issueCategory}\nCar model: ${parsed.carModel}\nIssue summary: ${parsed.issueDescription}\n\nNearby available providers for this issue type:\n${providerContext}\n\nCRITICAL INSTRUCTIONS:\n- Respond ONLY in ${detectedLanguage} (the customer's language)\n- This is a VOICE response — be conversational, warm, and natural-sounding\n- Keep it concise (under 120 words) — it will be spoken aloud\n- Do NOT use markdown, bullet points, or special characters\n- If providers are available, mention them naturally in conversation\n- Be empathetic and professional\n- End with an offer to help further`;
      
      return { contextPrompt, detectedLanguage, issueCategory: parsed.issueCategory, carModel: parsed.carModel };
        })();
    
    });
    const agentResult_node_1772047321030_ydu3si7 = await __vfTrack(__vibeflowTracking, 'node_1772047321030_ydu3si7', 'Voice AI Assistant', codeResult_node_1772047321030_2x26dlt, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_aiCarRepairAssistant, {
    input: codeResult_node_1772047321030_2x26dlt?.contextPrompt
    });
    });
    const mutationResult_node_1772047321030_rgti7o6 = await __vfTrack(__vibeflowTracking, 'node_1772047321030_rgti7o6', 'Save Voice Agent Reply', agentResult_node_1772047321030_ydu3si7, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveVoiceAgentReply, {
      sessionId: args.input?.sessionId,
      message: agentResult_node_1772047321030_ydu3si7?.content,
      timestamp: Date.now(),
    });
    });
    const httpResult_node_1772047321030_46kg4ey = await __vfTrack(__vibeflowTracking, 'node_1772047321030_46kg4ey', 'Voice TTS', mutationResult_node_1772047321030_rgti7o6, async () => {
      
    // Call HTTP request: getApi_node_1772047321030_46kg4ey (from node: node_1772047321030_46kg4ey)
    return  await ctx.runAction(api.actions.getApi_node_1772047321030_46kg4ey, {
      text: agentResult_node_1772047321030_ydu3si7?.content,
    });
    });
    const codeResult_node_1772047321030_f01qcef = await __vfTrack(__vibeflowTracking, 'node_1772047321030_f01qcef', 'Build Final Voice Response', httpResult_node_1772047321030_46kg4ey, async () => {
      
        // CODE node: Build Final Voice Response
        return  await (async function() {
          const input = httpResult_node_1772047321030_46kg4ey;
          const ttsResult = httpResult_node_1772047321030_46kg4ey;
      const audioBase64 = ttsResult?.audioBase64 || ttsResult?.data?.audioBase64 || null;
      const mimeType = ttsResult?.mimeType || ttsResult?.data?.mimeType || "audio/mpeg";
      const agentText = agentResult_node_1772047321030_ydu3si7?.content || "";
      const transcript = codeResult_node_1772047321030_y2fucoo?.resolvedText || "";
      const detectedLanguage = codeResult_node_1772047321030_2x26dlt?.detectedLanguage || "English";
      const issueCategory = codeResult_node_1772047321030_2x26dlt?.issueCategory || "General";
      const carModel = codeResult_node_1772047321030_2x26dlt?.carModel || "Unknown";
      
      return {
        audioBase64,
        mimeType,
        agentText,
        transcript,
        detectedLanguage,
        issueCategory,
        carModel,
        success: audioBase64 !== null
      };
        })();
    
    });
    const returnValue_node_1772047321030_jeycvnc = await __vfTrack(__vibeflowTracking, 'node_1772047321030_jeycvnc', 'Return Voice Response', codeResult_node_1772047321030_f01qcef, async () => {
      
    return  codeResult_node_1772047321030_f01qcef;

    });

    const __finalResult = returnValue_node_1772047321030_jeycvnc;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772053936250_5fzu5kb = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
        let returnValue_node_1772053936250_3wfkq02;
    let returnValue_node_1772053936250_wvmrdvm;
    let returnValue_node_1772053936250_4up2q69;
    let returnValue_node_1772057745239_o80tbis;

    const codeResult_node_1772053936250_1e9oxcl = await __vfTrack(__vibeflowTracking, 'node_1772053936250_1e9oxcl', 'Parse Tool Request', args.input, async () => {
      
        // CODE node: Parse Tool Request
        return  await (async function() {
          const input = args.input;
          const body = args.input?.body || {};
      
      const toolName = (
        body.tool_name ||
        body.name ||
        (body.tool && body.tool.name) ||
        "unknown"
      ).trim();
      
      const parameters =
        body.parameters ||
        body.input ||
        (body.tool && body.tool.input) ||
        {};
      
      const conversationId = body.conversation_id || body.conversationId || null;
      const agentId = body.agent_id || body.agentId || null;
      
      return { toolName, parameters, conversationId, agentId };
        })();
    
    });
    const codeResult_node_1772062963668_epnc40r = await __vfTrack(__vibeflowTracking, 'node_1772062963668_epnc40r', 'Log Tool Call', codeResult_node_1772053936250_1e9oxcl, async () => {
      
        // CODE node: Log Tool Call
        return  await (async function() {
          const input = codeResult_node_1772053936250_1e9oxcl;
          // Pass-through logging node — just forward the parsed tool request
      const toolName = codeResult_node_1772053936250_1e9oxcl?.toolName;
      const parameters = codeResult_node_1772053936250_1e9oxcl?.parameters;
      const conversationId = codeResult_node_1772053936250_1e9oxcl?.conversationId;
      return { toolName, parameters, conversationId };
        })();
    
    });
    // IF node node_1772053936250_bsk2oo1
    const left_node_1772053936250_bsk2oo1_0 = codeResult_node_1772053936250_1e9oxcl?.toolName;
    const right_node_1772053936250_bsk2oo1_0 = "find_providers";
    const cond_node_1772053936250_bsk2oo1_0 = left_node_1772053936250_bsk2oo1_0 === right_node_1772053936250_bsk2oo1_0;
    const cond_node_1772053936250_bsk2oo1 = cond_node_1772053936250_bsk2oo1_0;
    __vfTrackSync(__vibeflowTracking, 'node_1772053936250_bsk2oo1', 'Is Find Providers?', codeResult_node_1772062963668_epnc40r, { conditionResult: cond_node_1772053936250_bsk2oo1 });

    let branchResult_node_1772053936250_bsk2oo1 = codeResult_node_1772062963668_epnc40r;
    if (cond_node_1772053936250_bsk2oo1) {
      
    const queryResult_node_1772053936250_w52ivd5 = await __vfTrack(__vibeflowTracking, 'node_1772053936250_w52ivd5', 'Fetch Providers for Tool', codeResult_node_1772062963668_epnc40r, async () => {
      
    // Call query: fetchProvidersForTool (from node: node_1772053936250_w52ivd5)
    return  await ctx.runQuery(internal.providers.fetchProvidersForTool, {

    });
    });
      branchResult_node_1772053936250_bsk2oo1 = queryResult_node_1772053936250_w52ivd5;
      
    const codeResult_node_1772053936250_50kxh6m = await __vfTrack(__vibeflowTracking, 'node_1772053936250_50kxh6m', 'Filter & Format Providers', queryResult_node_1772053936250_w52ivd5, async () => {
      
        // CODE node: Filter & Format Providers
        return  await (async function() {
          const input = queryResult_node_1772053936250_w52ivd5;
          const providers = queryResult_node_1772053936250_w52ivd5 || [];
      const params = codeResult_node_1772053936250_1e9oxcl?.parameters || {};
      const category = (params.category || "").toLowerCase();
      const userLat = parseFloat(params.latitude) || 0;
      const userLng = parseFloat(params.longitude) || 0;
      
      function haversine(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }
      
      let filtered = providers;
      
      if (category) {
        filtered = providers.filter(p => {
          const services = (p.services || []).map(s => s.toLowerCase());
          return services.some(s => s.includes(category));
        });
      }
      
      const hasCoords = userLat !== 0 || userLng !== 0;
      
      const mapped = filtered.map(p => {
        const distance_km = hasCoords
          ? parseFloat(haversine(userLat, userLng, p.latitude || 0, p.longitude || 0).toFixed(2))
          : null;
        return {
          name: p.name || "",
          phone: p.phone || "",
          email: p.email || "",
          address: p.address || "",
          services: p.services || [],
          rating: p.rating || 0,
          distance_km
        };
      });
      
      const sorted = hasCoords
        ? mapped.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999))
        : mapped.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
      const top5 = sorted.slice(0, 5);
      
      return { providers: top5, count: top5.length, tool: "find_providers" };
        })();
    
    });
      branchResult_node_1772053936250_bsk2oo1 = codeResult_node_1772053936250_50kxh6m;
      
    returnValue_node_1772053936250_wvmrdvm = await __vfTrack(__vibeflowTracking, 'node_1772053936250_wvmrdvm', 'Return Providers Response', codeResult_node_1772053936250_50kxh6m, async () => {
      
    return  codeResult_node_1772053936250_50kxh6m;

    });
      branchResult_node_1772053936250_bsk2oo1 = returnValue_node_1772053936250_wvmrdvm;
    } else {
      
      // IF node node_1772053936250_t45aidk
      const left_node_1772053936250_t45aidk_0 = codeResult_node_1772053936250_1e9oxcl?.toolName;
      const right_node_1772053936250_t45aidk_0 = "get_issue_categories";
      const cond_node_1772053936250_t45aidk_0 = left_node_1772053936250_t45aidk_0 === right_node_1772053936250_t45aidk_0;
      const cond_node_1772053936250_t45aidk = cond_node_1772053936250_t45aidk_0;
      __vfTrackSync(__vibeflowTracking, 'node_1772053936250_t45aidk', 'Is Get Categories?', codeResult_node_1772062963668_epnc40r, { conditionResult: cond_node_1772053936250_t45aidk });

      let branchResult_node_1772053936250_t45aidk = codeResult_node_1772062963668_epnc40r;
      if (cond_node_1772053936250_t45aidk) {
        
    const codeResult_node_1772053936250_896if49 = await __vfTrack(__vibeflowTracking, 'node_1772053936250_896if49', 'Return Categories Static', codeResult_node_1772062963668_epnc40r, async () => {
      
        // CODE node: Return Categories Static
        return  await (async function() {
          const input = codeResult_node_1772062963668_epnc40r;
          return {
        categories: ["Engine", "Brakes", "Electrical", "Transmission", "Tires", "AC/Heating", "Bodywork", "General"],
        tool: "get_issue_categories"
      };
        })();
    
    });
        branchResult_node_1772053936250_t45aidk = codeResult_node_1772053936250_896if49;
        
    returnValue_node_1772053936250_4up2q69 = await __vfTrack(__vibeflowTracking, 'node_1772053936250_4up2q69', 'Return Categories Response', codeResult_node_1772053936250_896if49, async () => {
      
    return  codeResult_node_1772053936250_896if49;

    });
        branchResult_node_1772053936250_t45aidk = returnValue_node_1772053936250_4up2q69;
      } else {
        
        // IF node node_1772057745239_mpcm4u4
        const left_node_1772057745239_mpcm4u4_0 = codeResult_node_1772053936250_1e9oxcl?.toolName;
        const right_node_1772057745239_mpcm4u4_0 = "get_platform_stats";
        const cond_node_1772057745239_mpcm4u4_0 = left_node_1772057745239_mpcm4u4_0 === right_node_1772057745239_mpcm4u4_0;
        const cond_node_1772057745239_mpcm4u4 = cond_node_1772057745239_mpcm4u4_0;
        __vfTrackSync(__vibeflowTracking, 'node_1772057745239_mpcm4u4', 'Is Get Platform Stats?', codeResult_node_1772062963668_epnc40r, { conditionResult: cond_node_1772057745239_mpcm4u4 });

        let branchResult_node_1772057745239_mpcm4u4 = codeResult_node_1772062963668_epnc40r;
        if (cond_node_1772057745239_mpcm4u4) {
          
    const queryResult_node_1772053936250_n1r3f3z = await __vfTrack(__vibeflowTracking, 'node_1772053936250_n1r3f3z', 'Fetch All Leads for Stats', codeResult_node_1772062963668_epnc40r, async () => {
      
    // Call query: fetchAllLeadsForStats (from node: node_1772053936250_n1r3f3z)
    return  await ctx.runQuery(internal.leads.fetchAllLeadsForStats, {

    });
    });
          branchResult_node_1772057745239_mpcm4u4 = queryResult_node_1772053936250_n1r3f3z;
          
    const queryResult_node_1772057542799_76v0nzf = await __vfTrack(__vibeflowTracking, 'node_1772057542799_76v0nzf', 'Fetch Providers for Stats', queryResult_node_1772053936250_n1r3f3z, async () => {
      
    // Call query: fetchAllProvidersForStats (from node: node_1772057542799_76v0nzf)
    return  await ctx.runQuery(internal.providers.fetchAllProvidersForStats, {

    });
    });
          branchResult_node_1772057745239_mpcm4u4 = queryResult_node_1772057542799_76v0nzf;
          
    const queryResult_node_1772057542799_gxkbo87 = await __vfTrack(__vibeflowTracking, 'node_1772057542799_gxkbo87', 'Fetch Messages for Stats', queryResult_node_1772057542799_76v0nzf, async () => {
      
    // Call query: fetchAllMessagesForStats (from node: node_1772057542799_gxkbo87)
    return  await ctx.runQuery(internal.chatMessages.fetchAllMessagesForStats, {

    });
    });
          branchResult_node_1772057745239_mpcm4u4 = queryResult_node_1772057542799_gxkbo87;
          
    const codeResult_node_1772053936250_ipo0bkp = await __vfTrack(__vibeflowTracking, 'node_1772053936250_ipo0bkp', 'Format Platform Stats', queryResult_node_1772057542799_gxkbo87, async () => {
      
        // CODE node: Format Platform Stats
        return  await (async function() {
          const input = queryResult_node_1772057542799_gxkbo87;
          const leads = queryResult_node_1772053936250_n1r3f3z || [];
      const providers = queryResult_node_1772057542799_76v0nzf || [];
      const messages = queryResult_node_1772057542799_gxkbo87 || [];
      
      const total_leads = leads.length;
      const total_providers = providers.length;
      const total_messages = messages.length;
      
      const leads_by_status = leads.reduce((acc, lead) => {
        const status = lead.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      
      return {
        total_providers,
        total_leads,
        total_messages,
        leads_by_status,
        tool: "get_platform_stats"
      };
        })();
    
    });
          branchResult_node_1772057745239_mpcm4u4 = codeResult_node_1772053936250_ipo0bkp;
          
    returnValue_node_1772053936250_3wfkq02 = await __vfTrack(__vibeflowTracking, 'node_1772053936250_3wfkq02', 'Return Stats Response', codeResult_node_1772053936250_ipo0bkp, async () => {
      
    return  codeResult_node_1772053936250_ipo0bkp;

    });
          branchResult_node_1772057745239_mpcm4u4 = returnValue_node_1772053936250_3wfkq02;
        } else {
          
    const codeResult_node_1772057745239_98cy77r = await __vfTrack(__vibeflowTracking, 'node_1772057745239_98cy77r', 'Unknown Tool Response', codeResult_node_1772062963668_epnc40r, async () => {
      
        // CODE node: Unknown Tool Response
        return  await (async function() {
          const input = codeResult_node_1772062963668_epnc40r;
          const toolName = codeResult_node_1772053936250_1e9oxcl?.toolName || "unknown";
      return {
        error: true,
        message: `Unknown tool: "${toolName}". Supported tools are: find_providers, get_issue_categories, get_platform_stats.`,
        tool: toolName
      };
        })();
    
    });
          branchResult_node_1772057745239_mpcm4u4 = codeResult_node_1772057745239_98cy77r;
          
    returnValue_node_1772057745239_o80tbis = await __vfTrack(__vibeflowTracking, 'node_1772057745239_o80tbis', 'Return Unknown Tool', codeResult_node_1772057745239_98cy77r, async () => {
      
    return  codeResult_node_1772057745239_98cy77r;

    });
          branchResult_node_1772057745239_mpcm4u4 = returnValue_node_1772057745239_o80tbis;
        }
        branchResult_node_1772053936250_t45aidk = branchResult_node_1772057745239_mpcm4u4;
      }
      branchResult_node_1772053936250_bsk2oo1 = branchResult_node_1772053936250_t45aidk;
    }

    const __finalResult = {
      Return_Stats_Response__3wfkq02: returnValue_node_1772053936250_3wfkq02,
      Return_Providers_Response__wvmrdvm: returnValue_node_1772053936250_wvmrdvm,
      Return_Categories_Response__4up2q69: returnValue_node_1772053936250_4up2q69,
      Return_Unknown_Tool__o80tbis: returnValue_node_1772057745239_o80tbis,
    };
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_frontend_1772053936251_uqmsi3x = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'frontend_1772053936251_uqmsi3x', 'UI for WA Fetch Providers', args.input, args.input);
    const queryResult_node_1772034548625_r3si3sc = await __vfTrack(__vibeflowTracking, 'node_1772034548625_r3si3sc', 'WA Fetch Providers', args.input, async () => {
      
    // Call query: waFetchProviders (from node: node_1772034548625_r3si3sc)
    return  await ctx.runQuery(internal.providers.waFetchProviders, {

    });
    });
    const codeResult_node_1772034548625_jtb58h8 = await __vfTrack(__vibeflowTracking, 'node_1772034548625_jtb58h8', 'Build WA Context', queryResult_node_1772034548625_r3si3sc, async () => {
      
        // CODE node: Build WA Context
        return  await (async function() {
          const input = queryResult_node_1772034548625_r3si3sc;
          const parsed = queryResult_node_1772034548625_r3si3sc;
      const providers = queryResult_node_1772034548625_r3si3sc;
      const intent = queryResult_node_1772034548625_r3si3sc;
      const rawMessage = args.input?.body.Body || "[voice message]";
      const senderPhone = args.input?.body.From || "";
      const senderName = args.input?.body.ProfileName || "Customer";
      const category = (parsed.issueCategory || "").toLowerCase();
      const detectedLanguage = intent.detectedLanguage || "English";
      
      const matchingProviders = providers
        .filter(p => p.services && p.services.some(s => String(s).toLowerCase().includes(category)))
        .slice(0, 3);
      
      const providerContext = matchingProviders.length > 0
        ? matchingProviders.map((p, i) => `${i+1}. ${p.name} | Phone: ${p.phone} | Email: ${p.email} | Address: ${p.address} | Rating: ${p.rating || "N/A"}`).join("\n")
        : "No specific providers found for this category in the database.";
      
      const contextPrompt = `Customer Name: ${senderName}
      Customer's Original Language: ${detectedLanguage}
      Customer's Original Message: ${rawMessage}
      Translated/Clarified Message (English): ${intent.englishMessage}
      Detected Issue Category: ${parsed.issueCategory}
      Car Model: ${parsed.carModel}
      Issue Summary: ${parsed.issueDescription}
      
      Available Nearby Providers for this Issue:
      ${providerContext}
      
      IMPORTANT: Respond to the customer in ${detectedLanguage} (their original language). Be friendly, concise, and WhatsApp-friendly (under 300 words). If providers are available, mention them. Always be empathetic and professional.`;
      
      return { contextPrompt, senderName, senderPhone, detectedLanguage };
        })();
    
    });
    const agentResult_node_1772034548625_virwgu3 = await __vfTrack(__vibeflowTracking, 'node_1772034548625_virwgu3', 'WA AI Assistant', codeResult_node_1772034548625_jtb58h8, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_aiCarRepairAssistant, {
    input: codeResult_node_1772034548625_jtb58h8?.contextPrompt
    });
    });
    const mutationResult_node_1772034548625_dt99v7z = await __vfTrack(__vibeflowTracking, 'node_1772034548625_dt99v7z', 'Save WA AI Reply', agentResult_node_1772034548625_virwgu3, async () => {
      
    return  await ctx.runMutation(internal.chatMessages.saveWAAIReply, {
      sessionId: agentResult_node_1772034548625_virwgu3?._id,
      message: agentResult_node_1772034548625_virwgu3?.content,
      timestamp: Date.now(),
    });
    });
    const returnValue_node_1772034548625_ssukjkq = await __vfTrack(__vibeflowTracking, 'node_1772034548625_ssukjkq', 'Return WA Success', mutationResult_node_1772034548625_dt99v7z, async () => {
      
    return  "OK";

    });

    const __finalResult = returnValue_node_1772034548625_ssukjkq;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772055936312_vx8innu = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772055936312_vx8innu', 'AdminGetAllProviders', args.input, args.input);
    const queryResult_node_1772029994867_9bp9ha1 = await __vfTrack(__vibeflowTracking, 'node_1772029994867_9bp9ha1', 'FetchAllProviders', args.input, async () => {
      
    // Call query: fetchAllProviders (from node: node_1772029994867_9bp9ha1)
    return  await ctx.runQuery(internal.providers.fetchAllProviders, {

    });
    });
    const codeResult_node_1772029994867_em527wj = await __vfTrack(__vibeflowTracking, 'node_1772029994867_em527wj', 'Sort Providers by Distance', queryResult_node_1772029994867_9bp9ha1, async () => {
      
        // CODE node: Sort Providers by Distance
        return  await (async function() {
          const input = queryResult_node_1772029994867_9bp9ha1;
          const providers = queryResult_node_1772029994867_9bp9ha1;
      const userLat = args.input?.latitude || 0;
      const userLng = args.input?.longitude || 0;
      
      function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      }
      
      return providers.map(p => ({
        _id: p._id,
        name: p.name,
        services: p.services,
        email: p.email,
        phone: p.phone,
        address: p.address,
        rating: p.rating || 0,
        distance: haversine(userLat, userLng, p.latitude, p.longitude)
      })).sort((a, b) => a.distance - b.distance);
        })();
    
    });
    const returnValue_node_1772029994867_w0d0jhe = await __vfTrack(__vibeflowTracking, 'node_1772029994867_w0d0jhe', 'Return Nearby Providers', codeResult_node_1772029994867_em527wj, async () => {
      
    return  codeResult_node_1772029994867_em527wj;

    });
    const returnValue_node_1772055936312_gt5df2q = await __vfTrack(__vibeflowTracking, 'node_1772055936312_gt5df2q', 'Return All Providers', queryResult_node_1772029994867_9bp9ha1, async () => {
      
    return  queryResult_node_1772029994867_9bp9ha1;

    });

    const __finalResult = {
      Return_Nearby_Providers__w0d0jhe: returnValue_node_1772029994867_w0d0jhe,
      Return_All_Providers__gt5df2q: returnValue_node_1772055936312_gt5df2q,
    };
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772055936312_z5foepg = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772055936312_z5foepg', 'AdminGetAllLeads', args.input, args.input);
    const queryResult_node_1772055936312_ysl41ac = await __vfTrack(__vibeflowTracking, 'node_1772055936312_ysl41ac', 'Fetch All Leads For Admin', args.input, async () => {
      
    // Call query: fetchAllLeadsForAdmin (from node: node_1772055936312_ysl41ac)
    return  await ctx.runQuery(internal.leads.fetchAllLeadsForAdmin, {

    });
    });
    const codeResult_node_1772055936312_83l29eg = await __vfTrack(__vibeflowTracking, 'node_1772055936312_83l29eg', 'Sort Leads By Date', queryResult_node_1772055936312_ysl41ac, async () => {
      
        // CODE node: Sort Leads By Date
        return  await (async function() {
          const input = queryResult_node_1772055936312_ysl41ac;
          const leads = queryResult_node_1772055936312_ysl41ac;
      return leads.sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0));
        })();
    
    });
    const returnValue_node_1772055936312_zgrvjbw = await __vfTrack(__vibeflowTracking, 'node_1772055936312_zgrvjbw', 'Return All Leads For Admin', codeResult_node_1772055936312_83l29eg, async () => {
      
    return  codeResult_node_1772055936312_83l29eg;

    });

    const __finalResult = returnValue_node_1772055936312_zgrvjbw;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});