
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function translateText(
    text: string,
    sourceLanguageName: string,
    targetLanguageName: string
): Promise<string> {

    const sourceLangClause = sourceLanguageName === 'Auto-Detect'
        ? `from its original language`
        : `from ${sourceLanguageName}`;

    const prompt = `
        You are an expert multilingual translator.
        Translate the following text ${sourceLangClause} to ${targetLanguageName}.
        Your response must ONLY contain the translated text, with no additional commentary, formatting, or explanations.

        Text to translate:
        ---
        ${text}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            return `Error: Translation failed. ${error.message}`;
        }
        return "Error: An unknown error occurred during translation.";
    }
}
