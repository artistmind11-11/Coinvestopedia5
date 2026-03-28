import { GoogleGenAI } from "@google/genai";

export interface InsightResult {
  text: string;
  sources?: { title: string; uri: string }[];
}

export const getMarketInsight = async (topic: string): Promise<InsightResult> => {
  if (!process.env.API_KEY) {
    return { text: "Market insights are unavailable. Please configure your API key to view AI-powered analysis." };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a brief, 2-3 sentence market sentiment analysis for ${topic}. Focus strictly on recent news in stock, forex, crypto, bonds, or financial politics.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Analysis unavailable.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));

    return { text, sources: sources.length > 0 ? sources : undefined };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Unable to fetch live insights at this moment." };
  }
};

export const analyzeAssetMovement = async (
  asset: string, 
  movementType: string, 
  amount: string,
  fromAddress?: string,
  toAddress?: string
): Promise<InsightResult> => {
  if (!process.env.API_KEY) {
    return { text: "Analysis unavailable. Configure API Key." };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const fromStr = fromAddress || 'Unknown Wallet';
    const toStr = toAddress || 'Unknown Wallet';

    const prompt = `A large ${movementType} of ${amount} in ${asset} just occurred from ${fromStr} to ${toStr}. 
    
    Analyze this specific movement in the context of:
    1. Accumulation vs. Distribution:
       - Inflow (Wallet -> Exchange) often suggests potential selling pressure (dump/distribution).
       - Outflow (Exchange -> Wallet) often suggests holding (accumulation) or bullish sentiment.
       - Transfer (Exchange <-> Exchange) might indicate arbitrage or liquidity management.
       - Transfer (Wallet <-> Wallet) might be OTC deals or wallet reorganization.
    
    2. Market Sentiment: Search for recent ${asset} news (price action, partnerships, upgrades) to see if this whale movement aligns with a pump or dump.

    Provide a 2-3 sentence summary: Is this likely accumulation, distribution, or neutral? What does it imply for the price?`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Analysis unavailable.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));

    return { text, sources: sources.length > 0 ? sources : undefined };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Unable to analyze movement at this moment." };
  }
};