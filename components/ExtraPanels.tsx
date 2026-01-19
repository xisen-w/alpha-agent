import React from 'react';
import { CompetitorAgentOutput, HedgingAgentOutput, AgentResponse } from '../types';
import { Swords, ShieldCheck, ArrowRight } from 'lucide-react';

export const CompetitorPanel: React.FC<{ data: AgentResponse }> = ({ data }) => {
  const compData = data.data as CompetitorAgentOutput | undefined;
  if (data.status !== 'success' || !compData) return null;

  return (
    <div className="glass-panel rounded-xl p-6 border border-slate-800 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
          <Swords size={20} />
        </div>
        <h3 className="font-semibold text-slate-100">Competitive Landscape</h3>
      </div>
      
      <div className="mb-4">
         <span className="text-xs text-slate-500 font-mono uppercase">Market Position</span>
         <div className="text-lg font-medium text-slate-200 mt-1">{compData.marketPosition}</div>
      </div>

      <div className="space-y-3">
        {compData.topCompetitors.map((comp, idx) => (
            <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-orange-500/30 transition-colors">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-200 text-sm">{comp.ticker}</span>
                    <span className="text-xs text-slate-500">{comp.name}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-start gap-2">
                    <ArrowRight size={12} className="mt-0.5 text-orange-400 shrink-0" />
                    {comp.comparison}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export const HedgingPanel: React.FC<{ data: AgentResponse }> = ({ data }) => {
  const hedgeData = data.data as HedgingAgentOutput | undefined;
  if (data.status !== 'success' || !hedgeData) return null;

  return (
    <div className="glass-panel rounded-xl p-6 border border-slate-800 h-full">
       <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
          <ShieldCheck size={20} />
        </div>
        <h3 className="font-semibold text-slate-100">Risk Management</h3>
      </div>

      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-blue-900/10 border border-blue-500/20">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Primary Strategy</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">{hedgeData.primaryStrategy.cost} Cost</span>
            </div>
            <div className="text-sm font-semibold text-slate-200 mb-1">{hedgeData.primaryStrategy.type}</div>
            <p className="text-xs text-slate-400">{hedgeData.primaryStrategy.description}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alternative</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">{hedgeData.alternativeStrategy.cost} Cost</span>
            </div>
             <div className="text-sm font-semibold text-slate-300 mb-1">{hedgeData.alternativeStrategy.type}</div>
            <p className="text-xs text-slate-500">{hedgeData.alternativeStrategy.description}</p>
        </div>

        <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500 italic">"{hedgeData.rationale}"</p>
        </div>
      </div>
    </div>
  );
};