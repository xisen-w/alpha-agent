import React from 'react';
import { JudgeOutput, Decision } from '../types';
import { ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';

interface FinalReportProps {
  data: JudgeOutput;
}

const FinalReport: React.FC<FinalReportProps> = ({ data }) => {
  const getDecisionColor = (d: Decision) => {
    switch (d) {
      case Decision.BUY: return 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
      case Decision.AVOID: return 'text-rose-400 border-rose-500 bg-rose-500/10';
      default: return 'text-amber-400 border-amber-500 bg-amber-500/10';
    }
  };

  const scorePercentage = Math.round(data.confidence * 100);

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
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

      {/* Reasoning Block */}
      <div className="md:col-span-8 glass-panel rounded-2xl p-8 border-t-4 border-t-slate-800">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-400" />
            Executive Summary
        </h3>
        <p className="text-slate-300 leading-relaxed text-sm mb-6 border-l-2 border-slate-700 pl-4">
            {data.reasoning}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};

export default FinalReport;