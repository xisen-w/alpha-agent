import { 
  IndustryAgentOutput, 
  NewsAgentOutput, 
  QuantAgentOutput, 
  JudgeOutput, 
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
  if (properties.sectorTrend) {
    return getIndustryMock() as T;
  }
  if (properties.sentiment) {
    return getNewsMock() as T;
  }
  if (properties.priceTrend) {
    return getQuantMock() as T;
  }
  if (properties.decision) {
    return getJudgeMock() as T;
  }

  throw new Error("Mock service could not determine response type from schema");
};

function getIndustryMock(): IndustryAgentOutput {
  return {
    sectorTrend: getRandom(['Bullish', 'Neutral', 'Bearish']),
    macroOutlook: getRandom([
      "Inflation pressures are easing, creating a favorable environment for growth stocks.",
      "Rising interest rates continue to put pressure on valuations in this sector.",
      "Global supply chain improvements are boosting margins across the industry."
    ]),
    regulatoryRisk: getRandom(['Low', 'Medium', 'High']),
    summary: "The industry is currently undergoing a structural shift driven by technological adoption and changing consumer preferences. Key players are consolidating market share."
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
    priceTrend: getRandom(['Uptrend', 'Sideways', 'Downtrend']),
    volatility: getRandom(['Low', 'Medium', 'High']),
    valuationHeuristic: getRandom([Valuation.UNDERPRICED, Valuation.FAIR, Valuation.OVERPRICED]),
    keyLevels: "Support at $142.50, Resistance at $155.00"
  };
}

function getJudgeMock(): JudgeOutput {
  const decision = getRandom([Decision.BUY, Decision.HOLD, Decision.AVOID, Decision.WATCH]);
  return {
    decision: decision,
    confidence: 0.6 + Math.random() * 0.3, // 0.6 - 0.9
    valuation: getRandom([Valuation.UNDERPRICED, Valuation.FAIR, Valuation.OVERPRICED]),
    keyDrivers: [
      "Strong earnings momentum",
      "Favorable industry tailwinds",
      "Attractive relative valuation"
    ],
    risks: [
      "Macroeconomic volatility",
      "Potential regulatory headwinds"
    ],
    reasoning: `Based on the synthesis of all agents, the stock presents a ${decision} opportunity. The technicals align with the fundamental outlook, though caution is warranted due to external market factors.`
  };
}