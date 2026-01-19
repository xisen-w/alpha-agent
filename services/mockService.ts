import { 
  IndustryAgentOutput, 
  NewsAgentOutput, 
  QuantAgentOutput, 
  JudgeOutput, 
  CompetitorAgentOutput,
  DebateAgentOutput,
  HedgingAgentOutput,
  BacktestAgentOutput,
  Decision, 
  Valuation, 
  Sentiment 
} from "../types";

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const mockGenerateTypedResponse = async <T>(
  model: string,
  prompt: string,
  schema: any
): Promise<T> => {
  console.log(`[MOCK] Generating response for model: ${model}`);
  // Simulate network latency (1-3 seconds)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const properties = schema?.properties || {};

  // Infer the agent type based on unique schema properties
  if (properties.sectorTrend) return getIndustryMock() as T;
  if (properties.sentiment) return getNewsMock() as T;
  if (properties.trendSignal) return getQuantMock() as T;
  if (properties.topCompetitors) return getCompetitorMock() as T;
  if (properties.primaryStrategy) return getHedgingMock() as T;
  if (properties.turns) return getDebateMock() as T;
  if (properties.lessons) return getBacktestMock() as T; // Backtest
  if (properties.decision) return getJudgeMock() as T;

  throw new Error("Mock service could not determine response type from schema");
};

function getIndustryMock(): IndustryAgentOutput {
  return {
    sectorTrend: getRandom(['Bullish', 'Neutral', 'Bearish']),
    marketOutlook: "The broader market index (S&P 500) is consolidating near all-time highs, though inflation data suggests caution.",
    industryGrowth: "The cloud computing sub-sector is projected to grow 18% YoY, driven by AI adoption.",
    regulatoryRisk: getRandom(['Low', 'Medium', 'High']),
    summary: "The industry is currently undergoing a structural shift driven by technological adoption. However, broad market volatility may limit near-term upside."
  };
}

function getNewsMock(): NewsAgentOutput {
  return {
    sentiment: getRandom([Sentiment.POSITIVE, Sentiment.NEUTRAL, Sentiment.NEGATIVE]),
    topEvents: [
      "Quarterly earnings beat expectations by 15%",
      "CEO announces strategic partnership with major tech firm",
      "Regulatory approval granted for new product line"
    ],
    impactHorizon: getRandom(['Short', 'Medium', 'Long']),
    summary: "Recent news flow has been dominated by positive earnings surprises and strategic expansion announcements, though some geopolitical headwinds remain."
  };
}

function getQuantMock(): QuantAgentOutput {
  return {
    currentPrice: 150.25 + Math.random() * 10,
    trendSignal: getRandom(['Strong Uptrend', 'Weak Uptrend', 'Neutral', 'Downtrend']),
    volatilitySignal: getRandom(['Low (Stable)', 'Medium', 'High (Risky)']),
    volumeSignal: getRandom(['High (Confirmed)', 'Neutral', 'Low (Diverging)']),
    valuationSignal: getRandom(['Cheap', 'Fair', 'Expensive']),
  };
}

function getBacktestMock(): BacktestAgentOutput {
  return {
    score: 75,
    bias: getRandom(['Optimistic', 'Neutral', 'Pessimistic']),
    lessons: [
      "We underestimated the impact of interest rate hikes on valuation multiples.",
      "Revenue growth persistence was overestimated in the previous quarter.",
      "The market reacted more negatively to regulatory news than fundamentally justified."
    ],
    pastPrediction: "Bullish divergence not confirmed by volume."
  };
}

function getJudgeMock(): JudgeOutput {
  const decision = getRandom([Decision.BUY, Decision.HOLD, Decision.AVOID, Decision.WATCH]);
  const currentPrice = 145.50;
  return {
    decision: decision,
    confidence: 0.6 + Math.random() * 0.3, // 0.6 - 0.9
    valuation: getRandom([Valuation.UNDERPRICED, Valuation.FAIR, Valuation.OVERPRICED]),
    marketConsensus: "The market has fully priced in the recent earnings beat and expects 10% growth.",
    uniqueInsight: "Our models suggest the market is underestimating the margin expansion from the new AI vertical, which acts as a hidden catalyst.",
    keyDrivers: [
      "Strong earnings momentum",
      "Favorable industry tailwinds",
      "Attractive relative valuation"
    ],
    risks: [
      "Macroeconomic volatility",
      "Potential regulatory headwinds"
    ],
    reasoning: `Based on the synthesis of all agents, the stock presents a ${decision} opportunity. The technicals align with the fundamental outlook, though caution is warranted due to external market factors.`,
    forecast: {
      currentPrice: currentPrice,
      targetPrice: currentPrice * 1.15,
      bullCase: currentPrice * 1.3,
      bearCase: currentPrice * 0.85,
      timeframe: "3 Months"
    }
  };
}

function getCompetitorMock(): CompetitorAgentOutput {
  return {
    topCompetitors: [
      { name: "MegaCorp Inc", ticker: "MCORP", comparison: "Larger market cap, slower growth" },
      { name: "InnovateTech", ticker: "INNO", comparison: "Higher valuation, better margins" },
      { name: "Legacy Systems", ticker: "LGCY", comparison: "Value play, high dividend yield" }
    ],
    marketPosition: getRandom(['Leader', 'Challenger', 'Niche Player'])
  };
}

function getHedgingMock(): HedgingAgentOutput {
  return {
    primaryStrategy: {
      type: "Protective Put",
      description: "Buy OTM put options to limit downside risk while maintaining upside potential.",
      cost: "Medium"
    },
    alternativeStrategy: {
      type: "Covered Call",
      description: "Sell OTM call options to generate income and offset potential minor losses.",
      cost: "Low"
    },
    rationale: "Given the current high implied volatility, a protective put offers the best insurance against a sharp downturn, though a covered call might be preferred if the outlook is strictly neutral."
  };
}

function getDebateMock(): DebateAgentOutput {
  return {
    topic: "Is the stock a buy at current levels?",
    turns: [
      { speaker: "Bull", argument: "The company's new AI initiative is driving margin expansion faster than the market realizes. Forward P/E is attractive." },
      { speaker: "Bear", argument: "That growth is already priced in. You are ignoring the regulatory cloud hanging over their biggest market." },
      { speaker: "Bull", argument: "Regulation is a known known. The balance sheet is fortress-like, capable of weathering any fine." },
      { speaker: "Bear", argument: "Cash flow is good, but user growth has stalled. Without new users, the multiple must compress." }
    ],
    conclusion: "The debate centers on whether recent growth initiatives can offset slowing user adoption and regulatory risks."
  };
}