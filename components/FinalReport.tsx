import React from 'react';
import { JudgeOutput, BacktestAgentOutput } from '../types';
import { TrendingUp, AlertTriangle, Target, Lightbulb, Users, Eye } from 'lucide-react';

interface FinalReportProps {
  data: JudgeOutput;
  backtestData?: BacktestAgentOutput;
}

const FinalReport: React.FC<FinalReportProps> = ({ data, backtestData }) => {
  const scorePercentage = Math.round(data.confidence * 100);

  // --- Robust Visualization Math ---
  const { currentPrice, targetPrice, bullCase, bearCase } = data.forecast;
  
  // 1. Determine the absolute min and max of the chart to ensure everything fits
  const allValues = [currentPrice, targetPrice, bullCase, bearCase].filter(v => v !== undefined && !isNaN(v));
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  
  // Add 15% padding for labels
  const minValue = minVal * 0.85; 
  const maxValue = maxVal * 1.15; 
  const range = maxValue - minValue || 1; // Prevent divide by zero

  // 2. Helper to convert price to percentage position
  const getPos = (price: number) => {
    return ((price - minValue) / range) * 100;
  };

  const currentPos = getPos(currentPrice);
  const targetPos = getPos(targetPrice);
  const bullPos = getPos(bullCase);
  const bearPos = getPos(bearCase);

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative group">
      
      {/* Main Decision Block */}
      <div className="md:col-span-4 glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center border-t-4 border-t-slate-700 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 ${
            data.decision === 'BUY' ? 'bg-emerald-500' : data.decision === 'AVOID' ? 'bg-rose-500' : 'bg-amber-500'
        }`}></div>
        
        <div className="text-slate-400 text-xs font-mono mb-2 uppercase tracking-widest">Recommendation</div>
        <div className={`text-5xl font-bold mb-4 tracking-tight ${
            data.decision === 'BUY' ? 'text-emerald-400' : data.decision === 'AVOID' ? 'text-rose-400' : 'text-amber-400'
        }`}>
            {data.decision}
        </div>
        
        <div className="flex items-center gap-2 mb-6">
            <span className="text-slate-400 text-sm">Confidence</span>
            <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${scorePercentage > 70 ? 'bg-emerald-500' : scorePercentage > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${scorePercentage}%` }}
                ></div>
            </div>
            <span className="text-slate-200 text-sm font-mono">{scorePercentage}%</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono text-slate-300">
            <span>VALUATION:</span>
            <span className={data.valuation === 'UNDERPRICED' ? 'text-emerald-400' : data.valuation === 'OVERPRICED' ? 'text-rose-400' : 'text-slate-300'}>
                {data.valuation}
            </span>
        </div>

        {/* Reality Check Mini-Panel */}
        {backtestData && (
             <div className="mt-8 w-full bg-slate-900/50 rounded-lg p-3 border border-slate-800 text-left animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-3 h-3 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase">Systematic Bias Check</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Historical Accuracy</span>
                    <span className="font-mono text-indigo-300">{backtestData.score}/100</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-500">Detected Bias</span>
                    <span className={`font-mono ${
                        backtestData.bias === 'Optimistic' ? 'text-rose-400' : 
                        backtestData.bias === 'Pessimistic' ? 'text-emerald-400' : 'text-slate-300'
                    }`}>{backtestData.bias}</span>
                </div>
            </div>
        )}
      </div>

      {/* Analysis & Forecast Block */}
      <div className="md:col-span-8 space-y-6">
          
          {/* Price Forecast Visualization */}
          <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Price Forecast <span className="text-xs font-mono text-slate-500 ml-2">(3 MONTHS)</span>
                 </h3>
                 <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Current</div>
                    <div className="text-xl font-bold text-slate-100">${currentPrice.toFixed(2)}</div>
                 </div>
              </div>

              {/* Advanced Range Visualization */}
              <div className="relative h-20 w-full mt-8 mb-2">
                  {/* Axis Line */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 transform -translate-y-1/2"></div>
                  
                  {/* Range Bar (Bear to Bull) */}
                  <div className="absolute top-1/2 h-2 bg-indigo-500/10 rounded-full transform -translate-y-1/2 border border-indigo-500/20"
                       style={{ 
                           left: `${bearPos}%`, 
                           width: `${bullPos - bearPos}%` 
                       }}></div>

                  {/* Bear Case Marker */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group/bear transition-all duration-300" 
                       style={{ left: `${bearPos}%` }}>
                      <div className="w-px h-8 bg-rose-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-rose-500 border border-slate-900"></div>
                      <div className="text-[10px] font-mono text-rose-400 mt-2">${bearCase.toFixed(0)}</div>
                      <div className="text-[9px] text-slate-600 uppercase">Bear</div>
                  </div>

                  {/* Bull Case Marker */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group/bull transition-all duration-300" 
                       style={{ left: `${bullPos}%` }}>
                      <div className="w-px h-8 bg-emerald-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 border border-slate-900"></div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-2">${bullCase.toFixed(0)}</div>
                      <div className="text-[9px] text-slate-600 uppercase">Bull</div>
                  </div>

                  {/* Current Price Marker */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10 transition-all duration-300" 
                       style={{ left: `${currentPos}%` }}>
                      <div className="absolute -top-10 bg-slate-800 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap shadow-xl">
                          Now: ${currentPrice.toFixed(2)}
                      </div>
                      <div className="w-0.5 h-10 bg-slate-200"></div>
                  </div>

                   {/* Target Price Marker */}
                   <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-20 transition-all duration-300" 
                       style={{ left: `${targetPos}%` }}>
                      <div className="w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-950 shadow-lg shadow-indigo-500/50 animate-pulse"></div>
                      <div className="text-xs font-bold font-mono text-indigo-400 mt-4">${targetPrice.toFixed(0)}</div>
                      <div className="text-[9px] text-slate-500 uppercase font-semibold">Target</div>
                  </div>
              </div>
          </div>

          {/* New Consensus vs Insight Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="glass-panel p-5 rounded-xl border-l-2 border-l-slate-600">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Market Consensus</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed italic opacity-80">
                        "{data.marketConsensus}"
                    </p>
               </div>
               <div className="glass-panel p-5 rounded-xl border-l-2 border-l-indigo-500 bg-indigo-500/5">
                    <div className="flex items-center gap-2 mb-3 text-indigo-400">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Alpha (Unique Insight)</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                        "{data.uniqueInsight}"
                    </p>
               </div>
          </div>

          {/* Reasoning & Risks */}
          <div className="glass-panel rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thesis</h4>
            <p className="text-slate-300 leading-relaxed text-sm mb-6">
                {data.reasoning}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                    <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Key Drivers
                    </h4>
                    <ul className="space-y-2">
                        {data.keyDrivers.map((driver, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-emerald-500/50 mt-1">•</span> {driver}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Risk Factors
                    </h4>
                    <ul className="space-y-2">
                        {data.risks.map((risk, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-rose-500/50 mt-1">•</span> {risk}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Backtest Lessons */}
            {backtestData && backtestData.lessons.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Historical Lessons Applied
                    </h4>
                    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                        <ul className="space-y-2">
                             {backtestData.lessons.map((lesson: string, i: number) => (
                                <li key={i} className="text-xs text-slate-400 flex items-start gap-2 italic">
                                    <span className="text-indigo-500/50 mt-1">→</span> "{lesson}"
                                </li>
                             ))}
                        </ul>
                    </div>
                </div>
            )}
          </div>
      </div>

    </div>
  );
};

export default FinalReport;