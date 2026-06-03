// netlify/functions/practice.js
const { GoogleGenAI } = require("@google/genai");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { rootGap, targetTopic, studentSignal } = JSON.parse(event.body);
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Based on the identified learning gap "${rootGap}" blocking progress in "${targetTopic}", generate a 5-step practice roadmap.
      Student state: ${studentSignal}

      Return a strict JSON format object:
      {
        "aiGenerated": true,
        "practice": [
          "Targeted question or task exploring ${rootGap}",
          "Bridge problem connecting ${rootGap} to basics",
          "Intermediate step combining concepts",
          "Application challenge matching ${targetTopic}",
          "Review step to test retention"
        ],
        "studyPlan": [
          "Phase 1 protocol focused on isolating the error",
          "Phase 2 integration workflow",
          "Phase 3 verification standard"
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: response.text
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};