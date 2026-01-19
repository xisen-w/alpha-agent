import { useState, useCallback } from 'react';
import { 
  StockContext, 
  PipelineState, 
  AgentResponse,
  Language,
} from '../types';
import { 
  runIndustryAgent, 
  runNewsAgent, 
  runQuantAgent, 
  runJudgeAgent,
  runCompetitorAgent,
  runDebateAgent,
  runHedgingAgent,
  runBacktestAgent
} from './agents';

const INITIAL_AGENT_STATE: AgentResponse = {
  agentName: '',
  status: 'pending',
  timestamp: 0
};

type AgentKey = 'industry' | 'news' | 'quant' | 'judge' | 'competitor' | 'debate' | 'hedging' | 'backtest';

// Helper to prevent rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAgentOrchestrator = () => {
  const [state, setState] = useState<PipelineState>({
    stock: null,
    isRunning: false,
    industry: { ...INITIAL_AGENT_STATE, agentName: 'Industry Agent' },
    news: { ...INITIAL_AGENT_STATE, agentName: 'News Agent' },
    quant: { ...INITIAL_AGENT_STATE, agentName: 'Quant Agent' },
    competitor: { ...INITIAL_AGENT_STATE, agentName: 'Competitor Agent' },
    debate: { ...INITIAL_AGENT_STATE, agentName: 'Debate Agent' },
    hedging: { ...INITIAL_AGENT_STATE, agentName: 'Risk Agent' },
    backtest: { ...INITIAL_AGENT_STATE, agentName: 'Backtest Agent' },
    judge: { ...INITIAL_AGENT_STATE, agentName: 'Judge Agent', status: 'pending' },
  });

  const resetState = (stock: StockContext) => {
    setState({
      stock,
      isRunning: true,
      industry: { ...INITIAL_AGENT_STATE, agentName: 'Industry Agent', status: 'pending' },
      news: { ...INITIAL_AGENT_STATE, agentName: 'News Agent', status: 'pending' },
      quant: { ...INITIAL_AGENT_STATE, agentName: 'Quant Agent', status: 'pending' },
      competitor: { ...INITIAL_AGENT_STATE, agentName: 'Competitor Agent', status: 'pending' },
      debate: { ...INITIAL_AGENT_STATE, agentName: 'Debate Agent', status: 'pending' },
      hedging: { ...INITIAL_AGENT_STATE, agentName: 'Risk Agent', status: 'pending' },
      backtest: { ...INITIAL_AGENT_STATE, agentName: 'Backtest Agent', status: 'pending' },
      judge: { ...INITIAL_AGENT_STATE, agentName: 'Judge Agent', status: 'pending' },
    });
  };

  const updateAgent = (agent: AgentKey, data: Partial<AgentResponse>) => {
    setState(prev => ({
      ...prev,
      [agent]: { ...prev[agent], ...data, timestamp: Date.now() }
    }));
  };

  const runPipeline = useCallback(async (ticker: string, lang: Language) => {
    const stock: StockContext = { ticker };
    resetState(stock);

    try {
      // PHASE 1: CRITICAL SIGNAL AGENTS (Parallel)
      // These act as the foundation for the Judge
      const criticalPromise = Promise.allSettled([
        runIndustryAgent(stock, lang).then(data => {
            updateAgent('industry', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('industry', { status: 'error', error: err.message });
            throw err;
        }),
        runNewsAgent(stock, lang).then(data => {
            updateAgent('news', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('news', { status: 'error', error: err.message });
            throw err;
        }),
        runQuantAgent(stock, lang).then(data => {
            updateAgent('quant', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('quant', { status: 'error', error: err.message });
            throw err;
        })
      ]);

      // PHASE 2: SECONDARY AGENTS (Staggered to avoid Rate Limits)
      // We start these slightly later
      await delay(800); 
      
      const secondaryPromise = Promise.allSettled([
        runCompetitorAgent(stock, lang).then(data => {
            updateAgent('competitor', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('competitor', { status: 'error', error: err.message });
            return null; // Optional agent, return null on fail
        }),
        runHedgingAgent(stock, lang).then(data => {
            updateAgent('hedging', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('hedging', { status: 'error', error: err.message });
            return null; // Optional
        })
      ]);

      // PHASE 3: HEAVY LIFTING AGENTS (Debate & Backtest)
      // These are computationally expensive, so we run them last
      await delay(800);

      const heavyPromise = Promise.allSettled([
        runDebateAgent(stock, lang).then(data => {
            updateAgent('debate', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('debate', { status: 'error', error: err.message });
            return null;
        }),
        runBacktestAgent(stock, lang).then(data => {
            updateAgent('backtest', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('backtest', { status: 'error', error: err.message });
            return null;
        })
      ]);

      // Wait for everything to finish
      const [criticalResults, secondaryResults, heavyResults] = await Promise.all([
          criticalPromise,
          secondaryPromise,
          heavyPromise
      ]);

      // Extract results safely
      const industry = criticalResults[0].status === 'fulfilled' ? criticalResults[0].value : null;
      const news = criticalResults[1].status === 'fulfilled' ? criticalResults[1].value : null;
      const quant = criticalResults[2].status === 'fulfilled' ? criticalResults[2].value : null;

      const competitor = secondaryResults[0].status === 'fulfilled' ? secondaryResults[0].value : null;
      const hedging = secondaryResults[1].status === 'fulfilled' ? secondaryResults[1].value : null;

      const debate = heavyResults[0].status === 'fulfilled' ? heavyResults[0].value : null;
      const backtest = heavyResults[1].status === 'fulfilled' ? heavyResults[1].value : null;


      // JUDGE: Requires at least the Critical Signals to proceed
      if (industry && news && quant) {
        try {
            const judgeData = await runJudgeAgent(
                stock, 
                industry, 
                news, 
                quant,
                competitor,
                debate,
                hedging,
                backtest,
                lang
            );
            updateAgent('judge', { status: 'success', data: judgeData });
        } catch (err: any) {
            updateAgent('judge', { status: 'error', error: err.message });
        }
      } else {
          updateAgent('judge', { status: 'error', error: 'Critical agents failed. Synthesis aborted.' });
      }

    } catch (error) {
      console.error("Pipeline Error", error);
    } finally {
      setState(prev => ({ ...prev, isRunning: false }));
    }
  }, []);

  return {
    state,
    runPipeline
  };
};