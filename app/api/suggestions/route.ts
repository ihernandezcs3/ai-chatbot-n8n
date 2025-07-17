import { NextRequest, NextResponse } from "next/server";
import { SuggestionPayload, SuggestionResponse } from "@/types/Suggestion";

// Store for connected clients
const clients = new Set<ReadableStreamDefaultController>();

// Store for the latest suggestions
let latestSuggestions: SuggestionPayload | null = null;

export async function POST(request: NextRequest) {
  try {
    const body: SuggestionPayload = await request.json();
    console.log("🔄 Suggestions received:", body);
    // Validate the payload
    if (!body.suggestions || !Array.isArray(body.suggestions)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload: suggestions array is required",
        },
        { status: 400 }
      );
    }

    // Validate each suggestion
    for (const suggestion of body.suggestions) {
      if (!suggestion.id || !suggestion.text || !suggestion.type) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid suggestion: id, text, and type are required",
          },
          { status: 400 }
        );
      }
    }

    // Store the latest suggestions
    latestSuggestions = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all connected clients
    const message = `data: ${JSON.stringify(latestSuggestions)}\n\n`;
    clients.forEach((client) => {
      try {
        client.enqueue(new TextEncoder().encode(message));
      } catch (error) {
        // Remove disconnected clients
        clients.delete(client);
      }
    });

    const response: SuggestionResponse = {
      success: true,
      message: "Suggestions received and broadcasted successfully",
      receivedCount: body.suggestions.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing suggestions request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Add this client to the set
      clients.add(controller);

      // Send the latest suggestions immediately if available
      if (latestSuggestions) {
        const message = `data: ${JSON.stringify(latestSuggestions)}\n\n`;
        controller.enqueue(encoder.encode(message));
      }

      // Send initial connection message
      const initMessage = `data: ${JSON.stringify({
        type: "connected",
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(initMessage));

      // Handle client disconnect
      // Note: ReadableStreamDefaultController doesn't have a signal property
      // The connection will be cleaned up when the stream is closed
    },
    cancel(controller) {
      clients.delete(controller);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}
