// netlify/functions/chat.js
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
    const { message, syllabus, studentSignal, rootGap, targetTopic } = JSON.parse(event.body);
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are F.R.I.D.A.Y., a technical mentor helping an engineering student navigate an educational roadblock.
      Context:
      - Current Gap Identified: ${rootGap}
      - Target Destination: ${targetTopic}
      - Background Signal: ${studentSignal}
      - Course Syllabus: ${syllabus}

      The student asks: "${message}"
      Provide a highly encouraging, direct, and non-pretentious response guiding them through the concepts. Keep it scannable.

      Return a strict JSON object structure:
      {
        "reply": "Your markdown-formatted message answer text goes here."
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