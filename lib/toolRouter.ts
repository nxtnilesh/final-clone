import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.NEXT_OPENROUTER_API_KEY!,
});

export async function classifyToolAndMemory(user_input: string): Promise<{
  tool: "Image" | "PDF" | "AI";
  addMemory: boolean;
}> {
  const prompt = `
You are a tool router and memory detector.
Decide the tool to use:
- Image → if the input is about uploading, generating, editing, or describing an image url include images.
- PDF → if the input is about uploading or working with a document (PDF, DOCX, TXT).
- AI → for all other tasks (text, code, Q&A, etc.) or if unclear.
Also, check if the input contains personal preferences, facts, goals, or instructions worth remembering.
Input: ${user_input}
Respond in JSON format like:
{"tool": "Image" | "PDF" | "AI","addMemory": true | false}
Default to tool: "AI" and addMemory: false if unclear.
`.trim();

  const result = await generateText({
    model: openrouter.chat("mistralai/devstral-small:free"),
    prompt,
  });

  try {
    return JSON.parse(result.text.trim());
  } catch (e) {
    console.error("Failed to parse result:", result.text);
    return { tool: "AI", addMemory: false }; 
  }
}
