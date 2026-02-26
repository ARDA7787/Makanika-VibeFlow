import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { createOpenAI } from "@ai-sdk/openai";

export const parseIssue = new Agent(components.agent, {
  chat: createOpenAI({baseURL: "https://api.openai.com/v1"}).chat("gpt-4o-mini"),
  instructions: `You are a car repair intake assistant. Extract structured information from the user's free-text vehicle issue description. Return a JSON object with: carModel (the car make and model if mentioned, otherwise infer from context or use 'Unknown'), issueCategory (a short category like 'Engine', 'Brakes', 'Electrical', 'Transmission', 'Tires', 'AC/Heating', 'Bodywork', 'Other'), and issueDescription (a clean, concise summary of the issue in 1-2 sentences).`,
});