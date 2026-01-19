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
  marketOutlook: string; 
  industryGrowth: string; 
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
  currentPrice: number;
  trendSignal: 'Strong Uptrend' | 'Weak Uptrend' | 'Neutral' | 'Downtrend';
  volatilitySignal: 'Low (Stable)' | 'Medium' | 'High (Risky)';
  volumeSignal: 'High (Confirmed)' | 'Neutral' | 'Low (Diverging)';
  valuationSignal: 'Cheap' | 'Fair' | 'Expensive';
}

export interface BacktestAgentOutput {
  score: number; // 0-100 how accurate the past model would have been
  bias: 'Optimistic' | 'Pessimistic' | 'Neutral';
  lessons: string[]; // The 3 lessons learned
  pastPrediction: string;
}

export interface PriceForecast {
  currentPrice: number;
  targetPrice: number;
  bullCase: number;
  bearCase: number;
  timeframe: string;
}

export interface JudgeOutput {
  decision: Decision;
  confidence: number;
  valuation: Valuation;
  keyDrivers: string[]; // Keep for compatibility
  risks: string[]; // Keep for compatibility
  
  // New "Priced In" vs "Alpha" Analysis
  marketConsensus: string; // What everyone knows (Priced In)
  uniqueInsight: string; // What we see that others don't (Alpha)
  
  reasoning: string;
  forecast: PriceForecast;
}

// --- Other Agent Types ---

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
  backtest: AgentResponse; // New
  judge: AgentResponse;
  competitor: AgentResponse;
  debate: AgentResponse;
  hedging: AgentResponse;
}