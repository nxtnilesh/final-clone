import { auth } from "@clerk/nextjs/server";
import { createMem0 } from "@mem0/vercel-ai-provider";
import { generateText } from "ai"; 
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const mem0 = createMem0({
      provider: "google",
      mem0ApiKey: process.env.NEXT_MEMO_API_KEY,
      apiKey: process.env.NEXT_GOOGLE_API_KEY,
    });

    const { text } = await generateText({
      model: mem0("gemini-2.0-flash-lite", {
        user_id: userId,
      }),
      prompt: "what i like",
    });
    console.log("test", text);

    return Response.json({ text });
  } catch (error: any) {
    console.error("Error in GET handler:", error);
    return Response.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
