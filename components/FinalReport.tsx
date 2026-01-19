import React from 'react';
import { JudgeOutput } from '../types';
import { TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface FinalReportProps {
  data: JudgeOutput;
}

const FinalReport: React.FC<FinalReportProps> = ({ data }) => {
  const scorePercentage = Math.round(data.confidence * 100);

  // Calculate percentages for the range bar
  const { currentPrice, targetPrice, bullCase, bearCase } = data.forecast;
  const totalRange = bullCase - bearCase;
  
  const getPos = (price: number) => {
    return Math.max(0, Math.min(100, ((price - bearCase) / totalRange) * 100));
  };

  const currentPos = getPos(currentPrice);
  const targetPos = getPos(targetPrice);

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
      </div>

      {/* Analysis & Forecast Block */}
      <div className="md:col-span-8 space-y-6">
          
          {/* Price Forecast Visualization */}
          <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Price Forecast <span className="text-xs font-mono text-slate-500 ml-2">({data.forecast.timeframe})</span>
                 </h3>
                 <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Current</div>
                    <div className="text-xl font-bold text-slate-100">${currentPrice.toFixed(2)}</div>
                 </div>
              </div>

              {/* Range Visualization */}
              <div className="relative h-12 w-full mt-8 mb-2">
                  {/* Base Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 rounded-full transform -translate-y-1/2"></div>
                  
                  {/* Range Bar (Bear to Bull) */}
                  <div className="absolute top-1/2 h-1 bg-indigo-500/30 rounded-full transform -translate-y-1/2"
                       style={{ left: '0%', width: '100%' }}></div>

                  {/* Bear Case Marker */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1" style={{ left: '0%' }}>
                      <div className="w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900 shadow-lg shadow-rose-900/50"></div>
                      <div className="text-xs font-mono text-rose-400 mt-2">${bearCase.toFixed(0)}</div>
                      <div className="text-[10px] text-slate-600 uppercase">Bear</div>
                  </div>

                  {/* Bull Case Marker */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 flex flex-col items-center gap-1" style={{ right: '0%' }}>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg shadow-emerald-900/50"></div>
                      <div className="text-xs font-mono text-emerald-400 mt-2">${bullCase.toFixed(0)}</div>
                      <div className="text-[10px] text-slate-600 uppercase">Bull</div>
                  </div>

                  {/* Current Price Marker */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10" 
                       style={{ left: `${currentPos}%` }}>
                      <div className="w-4 h-4 bg-slate-100 rounded-full border-4 border-slate-900 shadow-xl"></div>
                      <div className="absolute -top-8 bg-slate-800 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap">
                          Now: ${currentPrice.toFixed(2)}
                      </div>
                  </div>

                   {/* Target Price Marker */}
                   <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1" 
                       style={{ left: `${targetPos}%` }}>
                      <div className="w-3 h-3 bg-indigo-400 rounded-full border-2 border-slate-900"></div>
                      <div className="text-xs font-mono text-indigo-400 mt-8">${targetPrice.toFixed(0)}</div>
                      <div className="text-[10px] text-slate-600 uppercase mt-0">Target</div>
                  </div>
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
          </div>
      </div>

    </div>
  );
};

export default FinalReport;