export enum Decision {
  BUY = 'BUY',
  HOLD = 'HOLD',
  AVOID = 'AVOID',
  WATCH = 'WATCH'
}

export enum Valuation {
  UNDERPRICED = 'UNDERPRICED',
  FAIR = 'FAIR',
  OVERPRICED = 'OVERPRICED',
  UNKNOWN = 'UNKNOWN'
}

export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE'
}

export interface AgentResponse {
  agentName: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  timestamp: number;
}

export interface IndustryAgentOutput {
  sectorTrend: 'Bullish' | 'Neutral' | 'Bearish';
  macroOutlook: string;
  regulatoryRisk: 'Low' | 'Medium' | 'High';
  summary: string;
}

export interface NewsAgentOutput {
  sentiment: Sentiment;
  topEvents: string[];
  impactHorizon: 'Short' | 'Medium' | 'Long';
  summary: string;
}

export interface QuantAgentOutput {
  priceTrend: 'Uptrend' | 'Sideways' | 'Downtrend';
  volatility: 'Low' | 'Medium' | 'High';
  valuationHeuristic: Valuation;
  keyLevels: string;
}

export interface JudgeOutput {
  decision: Decision;
  confidence: number; // 0-1
  valuation: Valuation;
  keyDrivers: string[];
  risks: string[];
  reasoning: string;
}

export interface StockContext {
  ticker: string;
  market?: string;
}

export interface PipelineState {
  stock: StockContext | null;
  isRunning: boolean;
  industry: AgentResponse;
  news: AgentResponse;
  quant: AgentResponse;
  judge: AgentResponse;
}