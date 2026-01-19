import { GoogleGenAI, Type } from "@google/genai";
import { mockGenerateTypedResponse } from "./mockService";

// Initialize Gemini Client
// Assumption: process.env.API_KEY is available in the environment
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// Determine if we should use the mock service
// We use mock if no API key is provided
const USE_MOCK = !apiKey || apiKey.trim() === '';

if (USE_MOCK) {
  console.warn("AlphaAgent: No API_KEY found. Running in MOCK mode.");
}

export const getGeminiClient = () => {
  return ai;
};

// Helper to generate content with a specific schema
export const generateTypedResponse = async <T>(
  model: string,
  prompt: string,
  schema: any,
  systemInstruction?: string,
  useSearch: boolean = false
): Promise<T> => {
  
  if (USE_MOCK) {
    return mockGenerateTypedResponse<T>(model, prompt, schema);
  }

  const tools = useSearch ? [{ googleSearch: {} }] : undefined;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        tools: tools,
        temperature: 0.2, // Low temperature for analytical consistency
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const MODEL_FAST = 'gemini-3-flash-preview';
export const MODEL_REASONING = 'gemini-3-pro-preview';