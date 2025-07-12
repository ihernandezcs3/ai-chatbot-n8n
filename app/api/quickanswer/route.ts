import { NextRequest, NextResponse } from "next/server";
import { QuickAnswerPayload, QuickAnswerResponse } from "@/types/QuickAnswer";

// Store for connected clients
const clients = new Set<ReadableStreamDefaultController>();

// Store for the latest quick answers
let latestQuickAnswers: QuickAnswerPayload | null = null;

export async function POST(request: NextRequest) {
  try {
    const body: QuickAnswerPayload = await request.json();
    console.log("🔄 QuickAnswer received:", body);
    // Validate the payload
    if (!body.quickAnswers || !Array.isArray(body.quickAnswers)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload: quickAnswers array is required",
        },
        { status: 400 }
      );
    }

    // Validate each quick answer
    for (const qa of body.quickAnswers) {
      if (!qa.id || !qa.text || !qa.type) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid quick answer: id, text, and type are required",
          },
          { status: 400 }
        );
      }
    }

    // Store the latest quick answers
    latestQuickAnswers = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all connected clients
    const message = `data: ${JSON.stringify(latestQuickAnswers)}\n\n`;
    clients.forEach((client) => {
      try {
        client.enqueue(new TextEncoder().encode(message));
      } catch (error) {
        // Remove disconnected clients
        clients.delete(client);
      }
    });

    const response: QuickAnswerResponse = {
      success: true,
      message: "Quick answers received and broadcasted successfully",
      receivedCount: body.quickAnswers.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing quick answer request:", error);
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

      // Send the latest quick answers immediately if available
      if (latestQuickAnswers) {
        const message = `data: ${JSON.stringify(latestQuickAnswers)}\n\n`;
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
