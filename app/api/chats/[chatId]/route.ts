import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { userId } = await auth();
    const { chatId } = await params;
    // const {chatId} = await req.json();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { db } = await connectToDatabase();
    const chat = await db.collection("chats").findOne({
      _id: new ObjectId(chatId),
      userId,
    });

    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }
    console.log("chats", chat);
    
    return Response.json(chat);
  } catch (error) {
    console.error("Get chat error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();
    const { db } = await connectToDatabase();

    const result = await db.collection("chats").updateOne(
      { _id: new ObjectId(params.chatId), userId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update chat error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("chats").deleteOne({
      _id: new ObjectId(params.chatId),
      userId,
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
