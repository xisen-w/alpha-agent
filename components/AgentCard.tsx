import React from 'react';
import { AgentResponse } from '../types';
import { Activity, Globe, TrendingUp, Gavel, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AgentCardProps {
  type: 'industry' | 'news' | 'quant' | 'judge';
  data: AgentResponse;
}

const ICONS = {
  industry: Globe,
  news: Activity,
  quant: TrendingUp,
  judge: Gavel,
};

const COLORS = {
  industry: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
  news: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  quant: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
  judge: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
};

const AgentCard: React.FC<AgentCardProps> = ({ type, data }) => {
  const Icon = ICONS[type];
  const colorClass = COLORS[type];

  // Helper to render content based on schema
  const renderContent = () => {
    if (!data.data) return null;

    switch (type) {
      case 'industry':
        return (
          <div className="space-y-3 mt-4 text-sm">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400">Sector Trend</span>
              <span className={`font-mono ${data.data.sectorTrend === 'Bullish' ? 'text-emerald-400' : data.data.sectorTrend === 'Bearish' ? 'text-rose-400' : 'text-slate-200'}`}>
                {data.data.sectorTrend}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <div className="text-xs text-slate-500 mb-1">REGULATORY RISK</div>
                  <div className={`font-medium ${data.data.regulatoryRisk === 'High' ? 'text-rose-400' : 'text-slate-200'}`}>{data.data.regulatoryRisk}</div>
               </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">{data.data.summary}</p>
          </div>
        );
      case 'news':
        return (
          <div className="space-y-3 mt-4 text-sm">
             <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400">Sentiment</span>
              <span className={`font-mono ${data.data.sentiment === 'POSITIVE' ? 'text-emerald-400' : data.data.sentiment === 'NEGATIVE' ? 'text-rose-400' : 'text-slate-200'}`}>
                {data.data.sentiment}
              </span>
            </div>
            <div className="text-xs space-y-2">
                <span className="text-slate-500 block">TOP HEADLINES</span>
                {data.data.topEvents?.map((event: string, idx: number) => (
                    <div key={idx} className="pl-2 border-l-2 border-slate-700 text-slate-300">{event}</div>
                ))}
            </div>
             <p className="text-slate-300 leading-relaxed text-xs">{data.data.summary}</p>
          </div>
        );
      case 'quant':
        return (
          <div className="space-y-3 mt-4 text-sm">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400">Price Trend</span>
              <span className={`font-mono ${data.data.priceTrend === 'Uptrend' ? 'text-emerald-400' : data.data.priceTrend === 'Downtrend' ? 'text-rose-400' : 'text-slate-200'}`}>
                {data.data.priceTrend}
              </span>
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <div className="text-xs text-slate-500 mb-1">VALUATION</div>
                  <div className="font-medium text-slate-200">{data.data.valuationHeuristic}</div>
               </div>
               <div>
                  <div className="text-xs text-slate-500 mb-1">VOLATILITY</div>
                  <div className="font-medium text-slate-200">{data.data.volatility}</div>
               </div>
            </div>
             <div className="text-xs text-slate-400">
                <span className="text-slate-500 mr-2">LEVELS:</span>
                {data.data.keyLevels}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`glass-panel rounded-xl p-5 border transition-all duration-300 ${
        data.status === 'pending' ? 'opacity-60' : 'opacity-100'
    } ${type === 'judge' ? 'col-span-full md:col-span-3 border-emerald-500/30 bg-emerald-950/20' : 'col-span-1 border-slate-800'}`}>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon size={20} />
          </div>
          <h3 className="font-semibold text-slate-100">{data.agentName}</h3>
        </div>
        <div>
            {data.status === 'pending' && <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />}
            {data.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            {data.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
        </div>
      </div>

      {data.status === 'error' && (
          <div className="text-rose-400 text-xs mt-2 bg-rose-950/30 p-2 rounded">
              Error: {data.error}
          </div>
      )}

      {data.status === 'success' && renderContent()}
      
      {data.status === 'pending' && (
          <div className="h-24 flex items-center justify-center text-xs text-slate-600 font-mono animate-pulse">
              Running analysis...
          </div>
      )}

    </div>
  );
};

export default AgentCard;