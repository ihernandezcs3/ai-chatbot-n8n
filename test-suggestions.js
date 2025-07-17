// Test script para probar el sistema Suggestions
// Ejecutar con: node test-suggestions.js

const testSuggestions = async () => {
  const baseUrl = "http://localhost:3000";

  const testData = {
    suggestions: [
      {
        id: "1",
        text: "¿Cómo puedo ayudarte?",
        type: "question",
        category: "general",
      },
      {
        id: "2",
        text: "Necesito información sobre productos",
        type: "suggestion",
        category: "sales",
      },
      {
        id: "3",
        text: "Sí, por favor",
        type: "confirmation",
        category: "general",
      },
      {
        id: "4",
        text: "No, gracias",
        type: "negation",
        category: "general",
      },
    ],
    sessionId: "test-session-123",
    userId: "test-user-456",
  };

  try {
    console.log("🚀 Enviando suggestions...");
    console.log("📊 Datos:", JSON.stringify(testData, null, 2));

    const response = await fetch(`${baseUrl}/api/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log("✅ Respuesta:", result);

    if (result.success) {
      console.log(
        `🎉 ${result.receivedCount} suggestions enviadas exitosamente`
      );
    } else {
      console.log("❌ Error:", result.message);
    }
  } catch (error) {
    console.error("💥 Error de conexión:", error.message);
  }
};

testSuggestions();
