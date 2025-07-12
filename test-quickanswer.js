// Test script para probar el sistema QuickAnswer
// Ejecutar con: node test-quickanswer.js

const testQuickAnswers = async () => {
  const baseUrl = "http://localhost:3000"; // Cambiar por tu URL

  const testData = {
    quickAnswers: [
      {
        id: "qa-1",
        text: "¿Cómo puedo ayudarte hoy?",
        type: "question",
        category: "general",
      },
      {
        id: "qa-2",
        text: "Necesito información sobre mi cuenta",
        type: "question",
        category: "account",
      },
      {
        id: "qa-3",
        text: "Sí, estoy de acuerdo",
        type: "confirmation",
        category: "responses",
      },
      {
        id: "qa-4",
        text: "No, necesito más detalles",
        type: "negation",
        category: "responses",
      },
      {
        id: "qa-5",
        text: "Ver mi perfil",
        type: "action",
        category: "profile",
      },
      {
        id: "qa-6",
        text: "Contactar soporte técnico",
        type: "help",
        category: "support",
      },
    ],
    sessionId: "test-session-123",
    userId: "test-user-456",
  };

  try {
    console.log("Enviando quick answers...");

    const response = await fetch(`${baseUrl}/api/quickanswer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Quick answers enviados exitosamente:");
      console.log("Respuesta:", result);
      console.log(`📊 Se enviaron ${result.receivedCount} quick answers`);
    } else {
      console.error("❌ Error al enviar quick answers:");
      console.error("Status:", response.status);
      console.error("Error:", result);
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
};

// Ejecutar el test
testQuickAnswers();
