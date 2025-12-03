import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, chatInput, metadata } = body;

    if (!sessionId || !chatInput) {
      return NextResponse.json({ error: "sessionId and chatInput are required" }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL!;
    const bearerToken = process.env.N8N_BEARER_TOKEN!;

    console.log("🚀 Sending to n8n:", { sessionId, chatInput, metadata });

    // Forward the request to n8n
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        sessionId,
        chatInput,
        metadata, // Incluimos la metadata en el payload a n8n
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log("📥 Response from n8n:", JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error in chat API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
