import { auth } from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import {
  appendResponseMessages,
  generateText,
  streamText,
  UIMessage,
} from "ai";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { classifyToolAndMemory } from "@/lib/toolRouter";
import { createMem0 } from "@mem0/vercel-ai-provider";

export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.NEXT_OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  let errorMessage = "";
  try {
    const { messages, chatId, fileUrl } = await req.json();
    const { userId } = await auth();
    const { db } = await connectToDatabase();

    if (userId) {
      const chat = await db
        .collection("chats")
        .findOne(
          { _id: new ObjectId(chatId), userId },
          { projection: { tokenUsed: 1 } }
        );

      // If limit exceeded
      if ((chat?.tokenUsed || 0) > 600) {
        console.log("Token limit exceeded:", chat?.tokenUsed);
        errorMessage = "Token limit exceeded";
        throw new Error(errorMessage);
      }
    }

    if (!userId) {
      console.log("userID");
      return new Response("Unauthorized", { status: 401 });
    }
    const tool = await classifyToolAndMemory(
      messages[messages.length - 1]?.content
    );

    console.log("messages", JSON.stringify(messages));

    if (tool.tool === "AI") {
      // if ("AI" === "AI") {
      console.log("ai tools ");

      const mem0 = createMem0({
        provider: "google",
        mem0ApiKey: process.env.NEXT_MEMO_API_KEY,
        apiKey: process.env.NEXT_GOOGLE_API_KEY,
      });
      const result = streamText({
        model: mem0("gemini-2.0-flash-lite", {
          user_id: userId,
        }),
        messages,
        system: `You are an expert assistant. Format your response like ChatGPT with:
    - Headings starting with emojis (e.g., 🧠 Overview, ✅ Solution)
    - Bullet points for lists
    - Code blocks for any code
    - Bold or italicized keywords
    - Clear and concise explanations
    - Highlight results or final answers at the end
    Always format in **markdown**. Avoid unnecessary repetition. Focus on clarity and readability.
    `,

        async onFinish({ response, usage }) {
          const totalTokensUsedNow = usage.totalTokens;

          if (chatId) {
            // Continue if under limit
            const data = appendResponseMessages({
              messages,
              responseMessages: response.messages,
            });

            await db.collection("chats").updateOne(
              { _id: new ObjectId(chatId), userId },
              {
                $set: {
                  messages: data,
                  updatedAt: new Date(),
                  fileUrl,
                },
                $inc: {
                  tokenUsed: totalTokensUsedNow,
                },
              }
            );
          }
        },
      });

      return result.toDataStreamResponse();
    }
    if (tool.tool === "Image") {
      console.log("image tool");
      console.log(messages);
      errorMessage = "Image exceeds the supported token limit.";

      // throw new Error(errorMessage);
      const lastMessage = messages[messages.length - 1];
      if (fileUrl && messages?.length > 0) {
        messages[messages.length - 1].content = [
          {
            type: "text",
            text:
              messages[messages.length - 1].parts?.[0]?.text ||
              messages[messages.length - 1].content ||
              "",
          },
          {
            type: "image",
            image: fileUrl,
          },
        ];
      }

      // console.log("message", lastMessage);
      console.log("message", messages);

      const result = streamText({
        // model: openai("gpt-4o-mini"),
        // model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
        model: openrouter.chat("google/gemma-3n-e4b-it:free"),
        messages,
        //         system: `You are an expert assistant. Format your response like ChatGPT with:
        // - Headings starting with emojis (e.g., 🧠 Overview, ✅ Solution)
        // - Bullet points for lists
        // - Code blocks for any code
        // - Bold or italicized keywords
        // - Clear and concise explanations
        // - Highlight results or final answers at the end
        // Always format in **markdown**. Avoid unnecessary repetition. Focus on clarity and readability.
        // `,

        async onFinish({ response, usage }) {
          const totalTokensUsedNow = usage.totalTokens;

          if (chatId) {
            // Continue if under limit
            const data = appendResponseMessages({
              messages,
              responseMessages: response.messages,
            });

            await db.collection("chats").updateOne(
              { _id: new ObjectId(chatId), userId },
              {
                $set: {
                  messages: data,
                  updatedAt: new Date(),
                  fileUrl,
                },
                $inc: {
                  tokenUsed: totalTokensUsedNow,
                },
              }
            );
          }
        },
        maxTokens: 100,
      });

      // Save chat to database

      return result.toDataStreamResponse();
    }
    if (tool.tool === "PDF") {
      console.log("image tool");
      console.log(messages);
      errorMessage = "PDF/Fil exceeds the supported token limit.";
      throw new Error(errorMessage);
      // const lastMessage = messages[messages.length - 1];
      // if (fileUrl && messages?.length > 0) {
      //   messages[messages.length - 1].content = [
      //     {
      //       type: "text",
      //       text:
      //         messages[messages.length - 1].parts?.[0]?.text ||
      //         messages[messages.length - 1].content ||
      //         "",
      //       providerOptions: {
      //         openai: { imageDetail: "low" },
      //       },
      //     },
      //     {
      //       type: "image",
      //       image: fileUrl,
      //     },
      //   ];
      // }

      // // console.log("message", lastMessage);
      // console.log("message", messages);

      // const result = streamText({
      //   // model: openai("gpt-4o-mini"),
      //   // model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      //   model: openrouter.chat("google/gemma-3n-e4b-it:free"),
      //   messages,
      //   //         system: `You are an expert assistant. Format your response like ChatGPT with:
      //   // - Headings starting with emojis (e.g., 🧠 Overview, ✅ Solution)
      //   // - Bullet points for lists
      //   // - Code blocks for any code
      //   // - Bold or italicized keywords
      //   // - Clear and concise explanations
      //   // - Highlight results or final answers at the end
      //   // Always format in **markdown**. Avoid unnecessary repetition. Focus on clarity and readability.
      //   // `,

      //   async onFinish({ response, usage }) {
      //     const totalTokensUsedNow = usage.totalTokens;

      //     if (chatId) {
      //       // Continue if under limit
      //       const data = appendResponseMessages({
      //         messages,
      //         responseMessages: response.messages,
      //       });

      //       await db.collection("chats").updateOne(
      //         { _id: new ObjectId(chatId), userId },
      //         {
      //           $set: {
      //             messages: data,
      //             updatedAt: new Date(),
      //             fileUrl,
      //           },
      //           $inc: {
      //             tokenUsed: totalTokensUsedNow,
      //           },
      //         }
      //       );
      //     }
      //   },
      //   maxTokens: 100,
      // });

      // Save chat to database

      // return result.toDataStreamResponse();
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(errorMessage, { status: 500 });
  }
}
