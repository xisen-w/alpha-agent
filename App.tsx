import React, { useState } from 'react';
import StockInput from './components/StockInput';
import AgentCard from './components/AgentCard';
import FinalReport from './components/FinalReport';
import DebatePanel from './components/DebatePanel';
import { CompetitorPanel, HedgingPanel } from './components/ExtraPanels';
import { useAgentOrchestrator } from './services/orchestrator';
import { GitMerge, Share2, Loader2, Download } from 'lucide-react';
import { Language } from './types';
import html2canvas from 'html2canvas';

export default function App() {
  const { state, runPipeline } = useAgentOrchestrator();
  const [language, setLanguage] = useState<Language>('EN');
  const [isExporting, setIsExporting] = useState(false);

  const handleSearch = (ticker: string) => {
    runPipeline(ticker, language);
  };

  const handleExport = async () => {
    const element = document.getElementById('full-report-container');
    if (!element) return;

    setIsExporting(true);
    
    // Slight delay to allow UI to settle
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#020617', // Match app background (slate-950)
            scale: 2, // Retina quality
            useCORS: true,
            logging: false,
            onclone: (clonedDoc) => {
                // 1. Hide the export button in the screenshot
                const btn = clonedDoc.getElementById('global-export-btn');
                if (btn) btn.style.display = 'none';

                // 2. Fix Glassmorphism for screenshot
                const panels = clonedDoc.querySelectorAll('.glass-panel');
                panels.forEach((panel) => {
                    const p = panel as HTMLElement;
                    p.style.background = '#1e293b'; // Solid slate-800
                    p.style.backdropFilter = 'none';
                    p.style.border = '1px solid #334155'; // slate-700
                    p.style.boxShadow = 'none';
                });
            }
        });
        
        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const decision = state.judge.data?.decision || 'REPORT';
            const fileName = `AlphaAgent_${state.stock?.ticker}_${decision}_${new Date().toISOString().split('T')[0]}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: `AlphaAgent: ${state.stock?.ticker}`,
                        text: `AI Analysis for ${state.stock?.ticker} - ${decision}`,
                        files: [file]
                    });
                } catch (err) {
                     if ((err as Error).name !== 'AbortError') {
                        downloadBlob(blob, fileName);
                    }
                }
            } else {
                downloadBlob(blob, fileName);
            }
        });

    } catch (err) {
        console.error("Export failed", err);
    } finally {
        setIsExporting(false);
    }
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] text-slate-200 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-16 text-center relative">
        
        {/* Language Toggle */}
        <div className="absolute top-0 right-0 hidden md:flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            <button 
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${language === 'EN' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
                EN
            </button>
            <button 
                onClick={() => setLanguage('CN')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${language === 'CN' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
                中文
            </button>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-mono text-emerald-500 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM ONLINE // V 3.2.0
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-500 tracking-tight mb-4">
          AlphaAgent Core
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Autonomous multi-agent intelligence framework for quantitative equity analysis.
        </p>
        
        {/* Mobile Language Toggle */}
        <div className="md:hidden flex justify-center mt-6">
             <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                <button 
                    onClick={() => setLanguage('EN')}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${language === 'EN' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    EN
                </button>
                <button 
                    onClick={() => setLanguage('CN')}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${language === 'CN' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    中文
                </button>
            </div>
        </div>

      </header>

      {/* Main Interface */}
      <main className="max-w-6xl mx-auto">
        <StockInput onSearch={handleSearch} isLoading={state.isRunning} />

        {/* Pipeline Visualization (Only show if running or has run) */}
        {(state.isRunning || state.stock) && (
          <div id="full-report-container" className="space-y-8 animate-in fade-in duration-500 p-4 -m-4">
            
            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-800 pb-2">
               <div>TARGET: <span className="text-emerald-400">{state.stock?.ticker}</span></div>
               <div className="flex gap-4 items-center">
                  <span className={state.isRunning ? 'text-emerald-400 animate-pulse' : ''}>
                    {state.isRunning ? '>> ORCHESTRATING AGENTS...' : '>> ANALYSIS COMPLETE'}
                  </span>
                  
                  {/* Global Export Button - Only show when analysis is done */}
                  {!state.isRunning && state.judge.status === 'success' && (
                      <button 
                        id="global-export-btn"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 ml-4 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 transition-all"
                      >
                         {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                         {isExporting ? 'CAPTURING...' : 'SHARE REPORT'}
                      </button>
                  )}
               </div>
            </div>

            {/* Row 0: Synthesis Layer (Judge) */}
            {state.judge.status !== 'pending' && (
                <div className="relative mb-12">
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
                         null
                     )}
                </div>
            )}

            {/* Row 1: Core Signals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-800/50 -z-10"></div>
               <AgentCard type="industry" data={state.industry} />
               <AgentCard type="news" data={state.news} />
               <AgentCard type="quant" data={state.quant} />
            </div>
            
            {/* Row 2: Secondary Analysis (Competitors & Hedging) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompetitorPanel data={state.competitor} />
                <HedgingPanel data={state.hedging} />
            </div>

            {/* Row 3: Deep Dive Debate (Full Width) */}
            <DebatePanel data={state.debate} />

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