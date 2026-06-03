// netlify/functions/analyze.js
const { GoogleGenAI } = require("@google/genai");

exports.handler = async (event) => {
  // Handle CORS Preflight Requests
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

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "Missing GEMINI_API_KEY configuration on Netlify." }) 
      };
    }

    const { syllabus, studentSignal, targetTopic } = JSON.parse(event.body);
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are F.R.I.D.A.Y., an advanced swarm-intelligence diagnostic tool for engineering education.
      Analyze this student signal against the syllabus. Find the earliest missing mathematical prerequisite.

      Syllabus Content: ${syllabus}
      Target Topic: ${targetTopic}
      Student Signal: ${studentSignal}

      You must return STRICTLY a raw JSON object matching this exact shape. Do not wrap it in markdown code blocks:
      {
        "title": "Student: stuck on ${targetTopic}",
        "confidence": 90,
        "rootGap": "The core fundamental skill missing",
        "explanation": "Clear one-sentence explanation of where the logic broke.",
        "path": ["algebra", "functions", "limits", "derivatives"],
        "recommendations": ["Action item 1", "Action item 2", "Action item 3"]
      }
      
      Note: The path elements MUST correspond to valid low-case node keys present in the app architecture (e.g., "algebra", "functions", "graphs", "limits", "derivatives", "optimization", "integrals", "trig").
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