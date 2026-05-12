import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type Provider = "anthropic" | "gemini";

export interface AiCallOptions {
  provider: Provider;
  apiKey: string;
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

export async function callAi(opts: AiCallOptions): Promise<string> {
  const { provider, apiKey, systemPrompt, userMessage, maxTokens = 16000 } = opts;

  if (provider === "anthropic") {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: maxTokens,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userMessage,
              cache_control: { type: "ephemeral" },
            },
          ],
        },
      ],
    });
    const block = response.content[0];
    if (block.type !== "text") throw new Error("Unexpected response type");
    return block.text;
  }

  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-preview-05-06",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    });
    return result.response.text();
  }

  throw new Error(`Unknown provider: ${provider}`);
}

export function stripJsonFences(raw: string): string {
  return raw.replace(/^```json?\s*/m, "").replace(/```\s*$/m, "").trim();
}
