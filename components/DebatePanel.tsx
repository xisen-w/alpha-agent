import React from 'react';
import { DebateAgentOutput, AgentResponse } from '../types';
import { MessageSquare, ThumbsUp, ThumbsDown, User } from 'lucide-react';

interface DebatePanelProps {
  data: AgentResponse;
}

const DebatePanel: React.FC<DebatePanelProps> = ({ data }) => {
  const debateData = data.data as DebateAgentOutput | undefined;

  if (data.status !== 'success' || !debateData) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <MessageSquare size={24} />
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-100">The War Room</h3>
            <p className="text-xs text-slate-400 font-mono">MULTI-AGENT DEBATE SIMULATION</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {debateData.turns.map((turn, idx) => (
          <div key={idx} className={`flex gap-4 ${turn.speaker === 'Bear' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                turn.speaker === 'Bull' 
                ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-900/30 border-rose-500/30 text-rose-400'
            }`}>
                {turn.speaker === 'Bull' ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
            </div>

            {/* Bubble */}
            <div className={`flex-1 p-4 rounded-2xl text-sm leading-relaxed ${
                turn.speaker === 'Bull'
                ? 'bg-slate-800/50 rounded-tl-none border border-emerald-500/10'
                : 'bg-slate-800/50 rounded-tr-none border border-rose-500/10'
            }`}>
                <div className={`text-xs font-bold mb-1 ${turn.speaker === 'Bull' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {turn.speaker.toUpperCase()} ARGUMENT
                </div>
                <p className="text-slate-300">{turn.argument}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 p-4 rounded-xl border border-indigo-500/20 text-sm">
        <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider block mb-2">Moderator Conclusion</span>
        <p className="text-slate-400 italic">"{debateData.conclusion}"</p>
      </div>
    </div>
  );
};

export default DebatePanel;