import { Type } from "@google/genai";
import { 
  IndustryAgentOutput, 
  NewsAgentOutput, 
  QuantAgentOutput, 
  JudgeOutput, 
  CompetitorAgentOutput,
  DebateAgentOutput,
  HedgingAgentOutput,
  StockContext,
  Decision,
  Valuation,
  Sentiment,
  Language
} from "../types";
import { generateTypedResponse, MODEL_FAST, MODEL_REASONING } from "./geminiService";

// Helper for language instructions
const getLangInstruction = (lang: Language) => {
  return lang === 'CN' 
    ? "IMPORTANT: You MUST generate all free-text summaries, descriptions, and reasoning in SIMPLIFIED CHINESE. However, keep all ENUM values (e.g., 'Bullish', 'BUY', 'Strong Uptrend') strictly in ENGLISH to match the schema."
    : "Generate the response in English.";
};

// --- Industry Agent ---
export const runIndustryAgent = async (stock: StockContext, lang: Language): Promise<IndustryAgentOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      sectorTrend: { type: Type.STRING, enum: ['Bullish', 'Neutral', 'Bearish'] },
      marketOutlook: { type: Type.STRING },
      industryGrowth: { type: Type.STRING },
      regulatoryRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
      summary: { type: Type.STRING },
    },
    required: ['sectorTrend', 'marketOutlook', 'industryGrowth', 'regulatoryRisk', 'summary']
  };

  const prompt = `Analyze the industry and broader market outlook for ${stock.ticker}. 
  1. Identify the specific sub-sector (e.g., "EVs in China" or "Cloud Computing in US").
  2. IDENTIFY THE RELEVANT BROAD MARKET INDEX (e.g., S&P 500, HSI).
  3. Analyze the current trend of that BROAD market index.
  4. Analyze the SPECIFIC INDUSTRY growth dynamics (e.g., market size, CAGR, demand drivers, saturation).
  5. Assess specific regulatory risks.
  6. Provide a summary combining the broad market backdrop and specific industry dynamics.
  
  ${getLangInstruction(lang)}`;

  return generateTypedResponse<IndustryAgentOutput>(
    MODEL_FAST,
    prompt,
    schema,
    "You are a Senior Macro Strategist.",
    true 
  );
};

// --- News Agent ---
export const runNewsAgent = async (stock: StockContext, lang: Language): Promise<NewsAgentOutput> => {
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
  
  ${getLangInstruction(lang)}`;

  return generateTypedResponse<NewsAgentOutput>(
    MODEL_FAST,
    prompt,
    schema,
    "You are a News Intelligence Officer.",
    true 
  );
};

// --- Quant Agent ---
export const runQuantAgent = async (stock: StockContext, lang: Language): Promise<QuantAgentOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      currentPrice: { type: Type.NUMBER },
      trendSignal: { type: Type.STRING, enum: ['Strong Uptrend', 'Weak Uptrend', 'Neutral', 'Downtrend'] },
      volatilitySignal: { type: Type.STRING, enum: ['Low (Stable)', 'Medium', 'High (Risky)'] },
      volumeSignal: { type: Type.STRING, enum: ['High (Confirmed)', 'Neutral', 'Low (Diverging)'] },
      valuationSignal: { type: Type.STRING, enum: ['Cheap', 'Fair', 'Expensive'] }
    },
    required: ['currentPrice', 'trendSignal', 'volatilitySignal', 'volumeSignal', 'valuationSignal']
  };

  const prompt = `Perform a technical and quantitative audit on ${stock.ticker} focusing on 4 Dominant Metrics. 
  
  1. TREND STRENGTH: Compare Current Price to 50-Day MA.
  2. VOLATILITY: Check Beta or daily range.
  3. VOLUME: Check participation.
  4. VALUATION: Check P/E vs history.

  ${getLangInstruction(lang)}`;

  return generateTypedResponse<QuantAgentOutput>(
    MODEL_FAST,
    prompt,
    schema,
    "You are a Disciplined Quantitative Trader.",
    true
  );
};

// --- Competitor Agent ---
export const runCompetitorAgent = async (stock: StockContext, lang: Language): Promise<CompetitorAgentOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      topCompetitors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            ticker: { type: Type.STRING },
            comparison: { type: Type.STRING }
          }
        }
      },
      marketPosition: { type: Type.STRING, enum: ['Leader', 'Challenger', 'Laggard', 'Niche Player'] }
    },
    required: ['topCompetitors', 'marketPosition']
  };

  const prompt = `Identify top 3 competitors for ${stock.ticker}. 
  For each competitor, provide their name, ticker, and a 1-sentence comparison.
  Determine ${stock.ticker}'s overall market position.
  
  ${getLangInstruction(lang)}`;

  return generateTypedResponse<CompetitorAgentOutput>(
    MODEL_FAST,
    prompt,
    schema,
    "You are a Competitive Intelligence Specialist.",
    true
  );
};

// --- Hedging Agent ---
export const runHedgingAgent = async (stock: StockContext, lang: Language): Promise<HedgingAgentOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      primaryStrategy: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          description: { type: Type.STRING },
          cost: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
        }
      },
      alternativeStrategy: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          description: { type: Type.STRING },
          cost: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
        }
      },
      rationale: { type: Type.STRING }
    },
    required: ['primaryStrategy', 'alternativeStrategy', 'rationale']
  };

  const prompt = `Suggest a hedging strategy for a long position in ${stock.ticker}.
  Provide a primary and alternative strategy.
  
  ${getLangInstruction(lang)}`;

  return generateTypedResponse<HedgingAgentOutput>(
    MODEL_REASONING,
    prompt,
    schema,
    "You are a Risk Manager.",
    false // No search needed for general hedging theory usually, but could be enabled. Keeping false for speed/reasoning.
  );
};

// --- Debate Agent ---
export const runDebateAgent = async (stock: StockContext, lang: Language): Promise<DebateAgentOutput> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING },
      turns: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            speaker: { type: Type.STRING, enum: ['Bull', 'Bear'] },
            argument: { type: Type.STRING }
          }
        }
      },
      conclusion: { type: Type.STRING }
    },
    required: ['topic', 'turns', 'conclusion']
  };

  const prompt = `Simulate a short intense debate between a Bull (optimist) and a Bear (skeptic) regarding ${stock.ticker}.
  Topic: Is ${stock.ticker} a good buy right now?
  The debate should have 4 turns.
  
  ${getLangInstruction(lang)}`;

  return generateTypedResponse<DebateAgentOutput>(
    MODEL_REASONING,
    prompt,
    schema,
    "You are a debate simulator."
  );
};

// --- Judge Agent ---
export const runJudgeAgent = async (
  stock: StockContext,
  industry: IndustryAgentOutput,
  news: NewsAgentOutput,
  quant: QuantAgentOutput,
  competitor: CompetitorAgentOutput,
  debate: DebateAgentOutput,
  hedging: HedgingAgentOutput,
  lang: Language
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
      forecast: {
        type: Type.OBJECT,
        properties: {
          currentPrice: { type: Type.NUMBER },
          targetPrice: { type: Type.NUMBER },
          bullCase: { type: Type.NUMBER },
          bearCase: { type: Type.NUMBER },
          timeframe: { type: Type.STRING }
        },
        required: ['currentPrice', 'targetPrice', 'bullCase', 'bearCase', 'timeframe']
      }
    },
    required: ['decision', 'confidence', 'valuation', 'keyDrivers', 'risks', 'reasoning', 'forecast']
  };

  // Compile all context
  const contextJSON = JSON.stringify({
    industryReport: industry,
    newsReport: news,
    quantReport: quant,
    competitorReport: competitor,
    debateSummary: debate.conclusion,
    riskManagement: hedging
  }, null, 2);

  const prompt = `Synthesize all agent reports for ${stock.ticker} into a final decision.
  
  CONTEXT:
  ${contextJSON}
  
  TASKS:
  1. Weigh conflicting signals.
  2. Decide Buy/Hold/Avoid.
  3. Generate a Price Forecast (Target, Bull Case, Bear Case).
  
  ${getLangInstruction(lang)}`;

  return generateTypedResponse<JudgeOutput>(
    MODEL_REASONING, 
    prompt,
    schema,
    "You are the CIO. You make the final call."
  );
};