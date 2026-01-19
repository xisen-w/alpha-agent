import React from 'react';
import StockInput from './components/StockInput';
import AgentCard from './components/AgentCard';
import FinalReport from './components/FinalReport';
import { useAgentOrchestrator } from './services/orchestrator';
import { Cpu, Layers, GitMerge } from 'lucide-react';

export default function App() {
  const { state, runPipeline } = useAgentOrchestrator();

  return (
    <div className="min-h-screen bg-slate-950 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] text-slate-200 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-mono text-emerald-500 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM ONLINE // V 3.0.1
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-500 tracking-tight mb-4">
          AlphaAgent Core
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Autonomous multi-agent intelligence framework for quantitative equity analysis.
        </p>
      </header>

      {/* Main Interface */}
      <main className="max-w-6xl mx-auto">
        <StockInput onSearch={runPipeline} isLoading={state.isRunning} />

        {/* Pipeline Visualization (Only show if running or has run) */}
        {(state.isRunning || state.stock) && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-800 pb-2">
               <div>TARGET: <span className="text-emerald-400">{state.stock?.ticker}</span></div>
               <div className="flex gap-4">
                  <span className={state.isRunning ? 'text-emerald-400 animate-pulse' : ''}>
                    {state.isRunning ? '>> ORCHESTRATING AGENTS...' : '>> ANALYSIS COMPLETE'}
                  </span>
               </div>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
               {/* Connecting Lines (Decorative) */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-800/50 -z-10"></div>

               <AgentCard type="industry" data={state.industry} />
               <AgentCard type="news" data={state.news} />
               <AgentCard type="quant" data={state.quant} />
            </div>

            {/* Synthesis Layer */}
            {state.judge.status !== 'pending' && (
                <div className="relative">
                     <div className="flex justify-center my-4">
                        <div className="bg-slate-900 p-2 rounded-full border border-slate-800 text-slate-600">
                            <GitMerge className="w-5 h-5 rotate-180" />
                        </div>
                     </div>
                     {state.judge.status === 'success' && state.judge.data ? (
                        <FinalReport data={state.judge.data} />
                     ) : state.judge.status === 'error' ? (
                        <div className="text-center p-8 border border-rose-900/30 bg-rose-950/10 rounded-xl text-rose-400">
                            Judge Agent failed to synthesize report.
                        </div>
                     ) : (
                         <div className="text-center text-slate-600 font-mono text-xs">
                             Waiting for sub-agents...
                         </div>
                     )}
                </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-24 text-center text-slate-600 text-xs font-mono">
        <p>POWERED BY GEMINI 3 FLASH PREVIEW • MULTI-AGENT ARCHITECTURE</p>
        <p className="mt-2 opacity-50">NOT FINANCIAL ADVICE. FOR DEMONSTRATION PURPOSES ONLY.</p>
      </footer>

    </div>
  );
}