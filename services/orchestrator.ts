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
  runHedgingAgent
} from './agents';

const INITIAL_AGENT_STATE: AgentResponse = {
  agentName: '',
  status: 'pending',
  timestamp: 0
};

type AgentKey = 'industry' | 'news' | 'quant' | 'judge' | 'competitor' | 'debate' | 'hedging';

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
      // 1. Parallel Execution of Independent Agents
      const [industryRes, newsRes, quantRes, compRes, debateRes, hedgeRes] = await Promise.allSettled([
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
        }),
        runCompetitorAgent(stock, lang).then(data => {
            updateAgent('competitor', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('competitor', { status: 'error', error: err.message });
            throw err;
        }),
        runDebateAgent(stock, lang).then(data => {
            updateAgent('debate', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('debate', { status: 'error', error: err.message });
            throw err;
        }),
        runHedgingAgent(stock, lang).then(data => {
            updateAgent('hedging', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('hedging', { status: 'error', error: err.message });
            throw err;
        })
      ]);

      // 2. Check if all agents succeeded to provide full context to Judge
      const allSucceeded = 
        industryRes.status === 'fulfilled' && 
        newsRes.status === 'fulfilled' && 
        quantRes.status === 'fulfilled' &&
        compRes.status === 'fulfilled' &&
        debateRes.status === 'fulfilled' &&
        hedgeRes.status === 'fulfilled';

      if (allSucceeded) {
        // 3. Run Judge Agent with FULL context
        try {
            const judgeData = await runJudgeAgent(
                stock, 
                industryRes.value, 
                newsRes.value, 
                quantRes.value,
                compRes.value,
                debateRes.value,
                hedgeRes.value,
                lang
            );
            updateAgent('judge', { status: 'success', data: judgeData });
        } catch (err: any) {
            updateAgent('judge', { status: 'error', error: err.message });
        }

      } else {
          updateAgent('judge', { status: 'error', error: 'One or more dependency agents failed. Synthesis aborted.' });
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