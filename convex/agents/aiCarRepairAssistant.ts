import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { createOpenAI } from "@ai-sdk/openai";

export const aiCarRepairAssistant = new Agent(components.agent, {
  chat: createOpenAI({baseURL: "https://api.openai.com/v1"}).chat("gpt-4o-mini"),
  instructions: `You are a helpful auto-repair assistant. Answer the user's car problem questions.`,
});