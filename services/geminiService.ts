import { GoogleGenAI } from "@google/genai";
import { EnhanceOptions } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const enhanceMarkdown = async (content: string, option: EnhanceOptions['type']): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API Key is missing.");
  }

  let prompt = "";
  switch (option) {
    case 'grammar':
      prompt = "Fix the grammar and spelling of the following markdown content. Keep the formatting exactly the same.";
      break;
    case 'funky':
      prompt = "Rewrite the following markdown content to be more energetic, funky, and enthusiastic. Use emojis where appropriate. Keep the markdown structure.";
      break;
    case 'professional':
      prompt = "Rewrite the following markdown content to be strictly professional, concise, and business-appropriate. Keep the markdown structure.";
      break;
    case 'summarize':
      prompt = "Create a summary section at the top of the following markdown content, and then list the original content below it.";
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${prompt}\n\n---\n\n${content}`,
    });
    
    return response.text || content;
  } catch (error) {
    console.error("Gemini Enhancement Error:", error);
    throw error;
  }
};
