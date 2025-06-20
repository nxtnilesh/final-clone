import { auth } from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import { appendResponseMessages, streamText } from "ai";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
export const maxDuration = 30;
const openrouter = createOpenRouter({
  apiKey: process.env.NEXT_OPENROUTER_API_KEY,
});
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { db } = await connectToDatabase();
    const { messages, chatId } = await req.json();
    console.log("chatid", chatId, userId);

    const result = streamText({
      // model: openai("gpt-4o-mini"),
      // model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      model: openrouter.chat("mistralai/devstral-small:free"),
      messages,
      system:
        "You are a helpful AI assistant. Provide clear, concise, and accurate responses in one line only",
      async onFinish({ response }) {
        let data = appendResponseMessages({
          messages,
          responseMessages: response.messages,
        });
        console.log("message", JSON.stringify(data));
        if (chatId) {
          const message = await db.collection("chats").updateOne(
            { _id: new ObjectId(chatId), userId },
            {
              $set: {
                messages: data,
                updatedAt: new Date(),
              },
            }
          );
          console.log("mongodb", JSON.stringify(message));
        }
      },
    });

    // Save chat to database

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
