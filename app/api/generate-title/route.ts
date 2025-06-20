import { auth } from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { NextRequest } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.NEXT_OPENROUTER_API_KEY,
});
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const { text } = await generateText({
      // model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      model: openrouter.chat("mistralai/devstral-small:free"),
      prompt: `Generate a short, descriptive title (max 6 words) for a conversation that starts with: "${messages[0].content}". Only return the text title, nothing else.`,
    });

    return Response.json({ title: text.trim() });
  } catch (error) {
    console.error("Generate title error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
