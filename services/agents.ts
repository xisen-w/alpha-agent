import { Type } from "@google/genai";
import { 
  IndustryAgentOutput, 
  NewsAgentOutput, 
  QuantAgentOutput, 
  JudgeOutput, 
  StockContext,
  Decision,
  Valuation,
  Sentiment
} from "../types";
import { generateTypedResponse, MODEL_FAST, MODEL_REASONING } from "./geminiService";

// --- Industry Agent ---
export const runIndustryAgent = async (stock: StockContext): Promise<IndustryAgentOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      sectorTrend: { type: Type.STRING, enum: ['Bullish', 'Neutral', 'Bearish'] },
      macroOutlook: { type: Type.STRING },
      regulatoryRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
      summary: { type: Type.STRING },
    },
    required: ['sectorTrend', 'macroOutlook', 'regulatoryRisk', 'summary']
  };

  const prompt = `Analyze the industry outlook for ${stock.ticker}. 
  Identify the sector it belongs to.
  Assess macro trends affecting this sector (inflation, rates, growth).
  Identify any specific regulatory risks (especially if China/HK market).
  Provide a concise summary.`;

  return generateTypedResponse<IndustryAgentOutput>(
    MODEL_FAST,
    prompt,
    schema,
    "You are a Senior Industry Strategy Analyst. You focus on macroeconomics, sector cycles, and regulatory environments.",
    true // Use search to get real-time sector news
  );
};

// --- News Agent ---
export const runNewsAgent = async (stock: StockContext): Promise<NewsAgentOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      sentiment: { type: Type.STRING, enum: [Sentiment.POSITIVE, Sentiment.NEUTRAL, Sentiment.NEGATIVE] },
      topEvents: { type: Type.ARRAY, items: { type: Type.STRING } },
      impactHorizon: { type: Type.STRING, enum: ['Short', 'Medium', 'Long'] },
      summary: { type: Type.STRING },
    },
    required: ['sentiment', 'topEvents', 'impactHorizon', 'summary']
  };

  const prompt = `Search for the latest key news events for ${stock.ticker} in the last 30 days.
  Summarize the top 3 headlines.
  Determine the overall sentiment.
  Estimate if these events have short-term or long-term impact.`;

  return generateTypedResponse<NewsAgentOutput>(
    MODEL_FAST,
    prompt,
    schema,
    "You are a News Intelligence Officer. You scan global media for signals, ignoring noise and focusing on material events.",
    true // Essential for news
  );
};

// --- Quant Agent ---
export const runQuantAgent = async (stock: StockContext): Promise<QuantAgentOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      priceTrend: { type: Type.STRING, enum: ['Uptrend', 'Sideways', 'Downtrend'] },
      volatility: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
      valuationHeuristic: { type: Type.STRING, enum: [Valuation.UNDERPRICED, Valuation.FAIR, Valuation.OVERPRICED, Valuation.UNKNOWN] },
      keyLevels: { type: Type.STRING },
    },
    required: ['priceTrend', 'volatility', 'valuationHeuristic', 'keyLevels']
  };

  const prompt = `Find recent price data, P/E ratio, and market cap for ${stock.ticker}.
  Analyze the price trend (approximate based on recent data).
  Estimate volatility.
  Provide a heuristic valuation (Under/Fair/Over) based on historical averages for its sector.
  Identify key support/resistance levels if mentioned in search results.`;

  return generateTypedResponse<QuantAgentOutput>(
    MODEL_FAST, // Using fast model with search to simulate quant data retrieval
    prompt,
    schema,
    "You are a Quantitative Analyst. You look at price action, volume (liquidity), and relative valuation metrics.",
    true
  );
};

// --- Judge Agent ---
export const runJudgeAgent = async (
  stock: StockContext,
  industry: IndustryAgentOutput,
  news: NewsAgentOutput,
  quant: QuantAgentOutput
): Promise<JudgeOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      decision: { type: Type.STRING, enum: [Decision.BUY, Decision.HOLD, Decision.AVOID, Decision.WATCH] },
      confidence: { type: Type.NUMBER },
      valuation: { type: Type.STRING, enum: [Valuation.UNDERPRICED, Valuation.FAIR, Valuation.OVERPRICED, Valuation.UNKNOWN] },
      keyDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
      risks: { type: Type.ARRAY, items: { type: Type.STRING } },
      reasoning: { type: Type.STRING },
    },
    required: ['decision', 'confidence', 'valuation', 'keyDrivers', 'risks', 'reasoning']
  };

  const contextJSON = JSON.stringify({
    industryReport: industry,
    newsReport: news,
    quantReport: quant
  }, null, 2);

  const prompt = `Synthesize the following agent reports for ${stock.ticker} and make a final trading decision.
  
  AGENTS INPUT:
  ${contextJSON}
  
  REQUIREMENTS:
  1. Weigh conflicting signals (e.g., good quant but bad regulatory risk).
  2. If uncertainty is high, lower confidence and choose WATCH or HOLD.
  3. Be decisive but prudent.`;

  return generateTypedResponse<JudgeOutput>(
    MODEL_REASONING, // Use the stronger model for the final synthesis
    prompt,
    schema,
    "You are the Chief Investment Officer (CIO). You synthesize multi-agent intelligence into actionable decisions. You are skeptical, risk-aware, and data-driven."
  );
};