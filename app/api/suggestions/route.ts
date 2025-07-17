import { NextRequest, NextResponse } from "next/server";
import { SuggestionPayload, SuggestionResponse } from "@/types/Suggestion";

// Mapa de sessionId -> Set de controladores conectados para esa sesión
const clients = new Map<string, Set<ReadableStreamDefaultController>>();

// Mapa de sessionId -> Últimas sugerencias enviadas para esa sesión
const latestSuggestions = new Map<string, SuggestionPayload>();

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

    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload: sessionId is required",
        },
        { status: 400 }
      );
    }

    // Store the latest suggestions for this session
    const suggestionsWithTimestamp = {
      ...body,
      timestamp: new Date().toISOString(),
    };
    latestSuggestions.set(sessionId, suggestionsWithTimestamp);

    // Broadcast only to clients connected for this session
    const message = `data: ${JSON.stringify(suggestionsWithTimestamp)}\n\n`;
    const sessionClients = clients.get(sessionId);
    if (sessionClients) {
      sessionClients.forEach((client) => {
        try {
          client.enqueue(new TextEncoder().encode(message));
        } catch (error) {
          // Remove disconnected clients that failed
          sessionClients.delete(client);
        }
      });
    }

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

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("sessionId query parameter is required", {
      status: 400,
    });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Añadir este controlador al grupo de la sesión
      if (!clients.has(sessionId)) {
        clients.set(sessionId, new Set());
      }
      clients.get(sessionId)!.add(controller);

      // Enviar inmediatamente las últimas sugerencias si las hay
      const last = latestSuggestions.get(sessionId);
      if (last) {
        const message = `data: ${JSON.stringify(last)}\n\n`;
        controller.enqueue(encoder.encode(message));
      }

      // Mensaje inicial de conexión
      const initMessage = `data: ${JSON.stringify({
        type: "connected",
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(initMessage));
    },
    cancel(controller) {
      const set = clients.get(sessionId);
      if (set) {
        set.delete(controller);
        if (set.size === 0) {
          clients.delete(sessionId);
          latestSuggestions.delete(sessionId);
        }
      }
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
