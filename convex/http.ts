import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { registerGeneratedWebhookRoutes } from "./webhooks";

const http = httpRouter();
 
auth.addHttpRoutes(http);

// Register generated webhook routes
registerGeneratedWebhookRoutes(http);
 
export default http;