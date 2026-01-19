import { useState, useCallback } from 'react';
import { 
  StockContext, 
  PipelineState, 
  AgentResponse,
  IndustryAgentOutput,
  NewsAgentOutput,
  QuantAgentOutput,
  JudgeOutput
} from '../types';
import { runIndustryAgent, runNewsAgent, runQuantAgent, runJudgeAgent } from './agents';

const INITIAL_AGENT_STATE: AgentResponse = {
  agentName: '',
  status: 'pending',
  timestamp: 0
};

type AgentKey = 'industry' | 'news' | 'quant' | 'judge';

export const useAgentOrchestrator = () => {
  const [state, setState] = useState<PipelineState>({
    stock: null,
    isRunning: false,
    industry: { ...INITIAL_AGENT_STATE, agentName: 'Industry Agent' },
    news: { ...INITIAL_AGENT_STATE, agentName: 'News Agent' },
    quant: { ...INITIAL_AGENT_STATE, agentName: 'Quant Agent' },
    judge: { ...INITIAL_AGENT_STATE, agentName: 'Judge Agent', status: 'pending' }, // Judge starts pending but waits for others
  });

  const resetState = (stock: StockContext) => {
    setState({
      stock,
      isRunning: true,
      industry: { ...INITIAL_AGENT_STATE, agentName: 'Industry Agent', status: 'pending' },
      news: { ...INITIAL_AGENT_STATE, agentName: 'News Agent', status: 'pending' },
      quant: { ...INITIAL_AGENT_STATE, agentName: 'Quant Agent', status: 'pending' },
      judge: { ...INITIAL_AGENT_STATE, agentName: 'Judge Agent', status: 'pending' },
    });
  };

  const updateAgent = (agent: AgentKey, data: Partial<AgentResponse>) => {
    setState(prev => ({
      ...prev,
      [agent]: { ...prev[agent], ...data, timestamp: Date.now() }
    }));
  };

  const runPipeline = useCallback(async (ticker: string) => {
    const stock: StockContext = { ticker };
    resetState(stock);

    try {
      // 1. Parallel Execution of Sub-Agents
      const [industryRes, newsRes, quantRes] = await Promise.allSettled([
        runIndustryAgent(stock).then(data => {
            updateAgent('industry', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('industry', { status: 'error', error: err.message });
            throw err;
        }),
        runNewsAgent(stock).then(data => {
            updateAgent('news', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('news', { status: 'error', error: err.message });
            throw err;
        }),
        runQuantAgent(stock).then(data => {
            updateAgent('quant', { status: 'success', data });
            return data;
        }).catch(err => {
            updateAgent('quant', { status: 'error', error: err.message });
            throw err;
        })
      ]);

      // 2. Check if we can proceed to Judge
      if (industryRes.status === 'fulfilled' && newsRes.status === 'fulfilled' && quantRes.status === 'fulfilled') {
        const industryData = industryRes.value;
        const newsData = newsRes.value;
        const quantData = quantRes.value;

        // 3. Run Judge Agent
        try {
            const judgeData = await runJudgeAgent(stock, industryData, newsData, quantData);
            updateAgent('judge', { status: 'success', data: judgeData });
        } catch (err: any) {
            updateAgent('judge', { status: 'error', error: err.message });
        }

      } else {
          // If any critical agent failed, Judge cannot proceed reliably
          updateAgent('judge', { status: 'error', error: 'Dependency agent failed' });
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