import { GoogleGenAI, Schema, Type } from "@google/genai";
import { Tone, AIResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const checkApiKey = () => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }
};

/**
 * Shared Schema for robust JSON parsing
 */
const BASE_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    markdown: {
      type: Type.STRING,
      description: "The main text content/analysis in Markdown format."
    },
    chartData: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.NUMBER },
        }
      },
      description: "Data points extracted for visualization. 3-6 points max."
    },
    chartTitle: {
      type: Type.STRING,
      description: "A short title for the chart."
    }
  },
  required: ["markdown"]
};

/**
 * Feature 1: Document Summarizer
 */
export const summarizeDocument = async (
  fileBase64: string,
  mimeType: string,
  userPrompt: string
): Promise<AIResponse> => {
  checkApiKey();
  
  const effectivePrompt = userPrompt.trim() 
    ? userPrompt 
    : "Summarize the document. Also extract key quantitative metrics (like revenue, emissions, growth %) for a chart.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: fileBase64 } },
          { text: effectivePrompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: BASE_RESPONSE_SCHEMA,
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    return {
      markdown: json.markdown || "No summary generated.",
      chartData: json.chartData,
      chartType: 'bar', // Summaries usually compare distinct categories -> Bar Chart
      chartTitle: json.chartTitle || "Key Metrics"
    };
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("Failed to summarize document.");
  }
};

/**
 * Feature 2: Plain-Language Interpreter
 */
export const interpretTerm = async (term: string): Promise<AIResponse> => {
  checkApiKey();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Explain the term: "${term}". 
      Also, provide a breakdown of the concept's components or a "Complexity vs Impact" score for a chart.
      Use Markdown headers: ### The Concept, ### The Analogy, ### Why It Matters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: BASE_RESPONSE_SCHEMA,
        systemInstruction: "You are a visual learner's guide. Explain complex terms simply.",
      }
    });

    const json = JSON.parse(response.text || "{}");
    return {
      markdown: json.markdown || "Could not interpret term.",
      chartData: json.chartData,
      chartType: 'pie', // Concepts often break down into parts -> Pie Chart
      chartTitle: json.chartTitle || "Concept Composition"
    };
  } catch (error) {
    console.error("Interpretation error:", error);
    throw new Error("Failed to interpret the term.");
  }
};

/**
 * Feature 3: Data Storyteller
 */
export const generateDataStory = async (
  csvBase64: string,
  tone: Tone
): Promise<AIResponse> => {
  checkApiKey();

  const prompt = `Analyze this CSV data. Write a ${tone} news-style story.
  Also extract the main trend or time-series data for a chart.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'text/csv', data: csvBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: BASE_RESPONSE_SCHEMA,
      }
    });

    const json = JSON.parse(response.text || "{}");
    return {
      markdown: json.markdown || "No story generated.",
      chartData: json.chartData,
      chartType: 'line', // Stories over time -> Line Chart
      chartTitle: json.chartTitle || "Trend Analysis"
    };
  } catch (error) {
    console.error("Storytelling error:", error);
    throw new Error("Failed to generate story from data.");
  }
};