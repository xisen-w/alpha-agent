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

export type Language = 'EN' | 'CN';

export interface AgentResponse {
  agentName: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  timestamp: number;
}

export interface IndustryAgentOutput {
  sectorTrend: 'Bullish' | 'Neutral' | 'Bearish';
  marketOutlook: string; // New: Broader market context (e.g., S&P500 or HSI)
  regulatoryRisk: 'Low' | 'Medium' | 'High';
  summary: string;
}

export interface NewsAgentOutput {
  sentiment: Sentiment;
  topEvents: string[];
  impactHorizon: 'Short' | 'Medium' | 'Long';
  summary: string;
}

// Refactored to the "Dominant Metrics" philosophy
export interface QuantAgentOutput {
  currentPrice: number;
  // 1. Trend Strength (Primary Driver)
  trendSignal: 'Strong Uptrend' | 'Weak Uptrend' | 'Neutral' | 'Downtrend';
  // 2. Volatility / Stability (Risk Filter)
  volatilitySignal: 'Low (Stable)' | 'Medium' | 'High (Risky)';
  // 3. Volume Confirmation (Truth Serum)
  volumeSignal: 'High (Confirmed)' | 'Neutral' | 'Low (Diverging)';
  // 4. Valuation Sanity Check
  valuationSignal: 'Cheap' | 'Fair' | 'Expensive';
}

export interface PriceForecast {
  currentPrice: number; // Repeated for context
  targetPrice: number;
  bullCase: number;
  bearCase: number;
  timeframe: string;
}

export interface JudgeOutput {
  decision: Decision;
  confidence: number; // 0-1
  valuation: Valuation;
  keyDrivers: string[];
  risks: string[];
  reasoning: string;
  forecast: PriceForecast;
}

// --- New Agent Types ---

export interface CompetitorData {
  name: string;
  ticker: string;
  comparison: string;
}

export interface CompetitorAgentOutput {
  topCompetitors: CompetitorData[];
  marketPosition: 'Leader' | 'Challenger' | 'Laggard' | 'Niche Player';
}

export interface DebateTurn {
  speaker: 'Bull' | 'Bear';
  argument: string;
}

export interface DebateAgentOutput {
  topic: string;
  turns: DebateTurn[];
  conclusion: string;
}

export interface HedgingStrategy {
  type: string;
  description: string;
  cost: 'Low' | 'Medium' | 'High';
}

export interface HedgingAgentOutput {
  primaryStrategy: HedgingStrategy;
  alternativeStrategy: HedgingStrategy;
  rationale: string;
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
  // New agents
  competitor: AgentResponse;
  debate: AgentResponse;
  hedging: AgentResponse;
}