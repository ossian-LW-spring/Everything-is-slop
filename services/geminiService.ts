import { GoogleGenAI } from "@google/genai";
import { Modifier } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateSlop = async (
  currentText: string,
  modifier: Modifier
): Promise<string> => {
  const ai = getAI();
  
  if (!ai) {
    // Fallback if no API key
    return fallbackSlop(currentText, modifier);
  }

  try {
    const prompt = `
      You are a satirical 'Slop Generator' engine in a dystopian 2060.
      Your goal is to degrade the following text based on a specific instruction.
      Keep the core meaning (mostly) but ruin the style.
      
      Original Text: "${currentText}"
      
      Instruction: ${modifier.promptInstruction}
      
      Return ONLY the rewritten text. No explanations.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallbackSlop(currentText, modifier);
  }
};

export const generateReaction = async (
  slopText: string,
  opponentName: string,
  score: number
): Promise<string> => {
    const ai = getAI();
    if (!ai) return `${opponentName}: "Hmm... ${score > 50 ? 'Valid vibes.' : 'Sus.'}"`;

    try {
        const prompt = `
          Roleplay as ${opponentName}, a character in a dystopian 2060 who worships inefficiency and hates logic.
          Evaluate the following statement from a student/citizen.
          
          Statement: "${slopText}"
          
          If the statement is emotional, poorly written, and full of slang, praise it.
          If it is logical, concise, or smart, hate it.
          
          Current Slop Score (0-100, where 100 is pure trash): ${score}
          
          Keep the response short (under 20 words). Use 2020s slang as if it were archaic formal English.
        `;
    
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
    
        return response.text?.trim() || "";
    } catch (error) {
        return "System Error: Inquisitor rebooting...";
    }
}

// Fallback logic for demo purposes if API fails
const fallbackSlop = (text: string, modifier: Modifier): string => {
  const prefixes = ["Like, ", "Honestly, ", "No cap, ", "Yo, "];
  const suffixes = [" 💀", " 😭", " (emotional damage)", " #vibes"];
  
  switch (modifier.type) {
    case 'EMOTION':
      return `I'm literally shaking rn but... ${text} It reminds me of my trauma.`;
    case 'TRIBALISM':
      return `${text} AND IT'S ALL THE EAST SECTOR'S FAULT!!`;
    case 'BRAINROT':
      return `Skibidi dop dop yes yes! ${text} GYATT!!`;
    case 'INEFFICIENCY':
      return `Umm, so like... ${text}... if that makes sense?`;
    default:
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${text}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }
};