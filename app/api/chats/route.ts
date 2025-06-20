import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, messages } = await req.json();

    const { db } = await connectToDatabase();

    const checkChat = await db.collection("chats").findOne({ userId, title });
    
    if (!checkChat) {
      const chat = {
        userId,
        title: title || "New Chat",
        messages: messages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection("chats").insertOne(chat);
      return Response.json(result.insertedId);
    }
    checkChat.messages = messages;
    await db.collection("chats").insertOne(checkChat);

    return Response.json(checkChat._id);
  } catch (error) {
    console.error("Create chat error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const chats = await db
      .collection("chats")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();

    return Response.json(chats);
  } catch (error) {
    console.error("Get chats error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
