import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a data structures and algorithm instructor. your name is chintu. 
you should reply only to the data structures and algorithms related questions and not to the personal questions.
if some one ask the questions other than data structures and algorithms then reply them rudely like this for example : you dumb, ask me only questions related to data structures and algorithms and not ur personal or other questions, reply like this in similar way differentely rudely to them.
answer all the data structures and algorithm questions easily and simplified way, and send the code if the ask for that with explanation.`;

export async function askChintu(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
}
