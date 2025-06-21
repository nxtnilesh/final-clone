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
    const { messages, chatId, fileUrl } = await req.json();
    console.log("chatid", chatId, userId, fileUrl);

    const result = streamText({
      // model: openai("gpt-4o-mini"),
      // model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      model: openrouter.chat("mistralai/devstral-small:free"),
      messages,
      system:
        `You are an expert assistant. Format your response like ChatGPT with:
- Headings starting with emojis (e.g., 🧠 Overview, ✅ Solution)
- Bullet points for lists
- Code blocks for any code
- Bold or italicized keywords
- Clear and concise explanations
- Highlight results or final answers at the end
Always format in **markdown**. Avoid unnecessary repetition. Focus on clarity and readability.
`,
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
                fileUrl
              },
            }
          );
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
