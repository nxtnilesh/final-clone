import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    if (page < 1 || limit < 1) {
      return NextResponse.json({ error: "Page and limit must be positive integers." }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("chatgpt") // Replace with your database name

    const skip = (page - 1) * limit

    // Build the search query
    const searchQuery: any = {}
    if (query) {
      // Case-insensitive partial match on the 'title' field
      searchQuery.title = { $regex: query, $options: "i" }
    }

    const chats = await db
      .collection("chats")
      .find(searchQuery)
      .project({ title: 1 }) // Project only the title and _id (which is included by default)
      .skip(skip)
      .limit(limit)
      .toArray()

    // Optionally, get total count for pagination metadata
    const totalChats = await db.collection("chats").countDocuments(searchQuery)

    console.log("tilte",chats);
    
    return NextResponse.json({
      chats: chats.map((chat) => ({
        _id: chat._id.toString(), // Convert ObjectId to string for consistent API response
        title: chat.title,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalChats / limit),
      totalResults: totalChats,
    })
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
