
import { GoogleGenAI } from "@google/genai";
import { Message, Language } from "../types";

// Always use process.env.API_KEY directly as required by the library guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAdvisorStream = async (
  messages: Message[],
  lang: Language = 'zh',
  systemInstruction?: string
) => {
  const defaultInstruction = lang === 'zh' 
    ? "你是一个极简、专业的北美生活顾问。请用中文回答。你会利用搜索工具获取最新信息。要求：1. 语言极其精炼，多用列表和Emoji，避免长句；2. 回答要紧凑，直接切中要点；3. 使用标准的 Markdown 格式，适当加粗关键词；4. 保持亲切专业的语气。"
    : "You are a professional NA life advisor. Use search for real-time data. Requirements: 1. Be extremely concise, use lists and Emojis often; 2. Keep responses compact and direct; 3. Use proper Markdown with bold keywords; 4. Maintain a friendly and professional tone.";
  
  const chatHistory = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const lastMessage = messages[messages.length - 1];

  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: [
      ...chatHistory,
      { role: 'user', parts: [{ text: lastMessage.content }] }
    ],
    config: {
      systemInstruction: systemInstruction || defaultInstruction,
      tools: [{ googleSearch: {} }],
      temperature: 0.3,
      topP: 0.95,
    }
  });
};
