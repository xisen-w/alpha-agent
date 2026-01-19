import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface StockInputProps {
  onSearch: (ticker: string) => void;
  isLoading: boolean;
}

const StockInput: React.FC<StockInputProps> = ({ onSearch, isLoading }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-10">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700/50 shadow-xl">
          <Search className="w-5 h-5 ml-4 text-slate-400" />
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            disabled={isLoading}
            placeholder="Enter stock symbol (e.g., AAPL, 0700.HK, 600519.SH)..."
            className="w-full bg-transparent border-none text-slate-100 px-4 py-4 focus:outline-none focus:ring-0 placeholder-slate-500 font-mono tracking-wider uppercase text-lg"
          />
          <button
            type="submit"
            disabled={isLoading || !ticker}
            className={`mr-2 px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              isLoading || !ticker
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/50'
            }`}
          >
            {isLoading ? 'ANALYZING...' : 'RUN AGENTS'}
          </button>
        </div>
      </div>
      <div className="mt-3 flex gap-3 justify-center text-xs text-slate-500 font-mono">
        <span>SUGGESTED:</span>
        <button type="button" onClick={() => { setTicker('MSFT'); }} className="hover:text-emerald-400 transition-colors">MSFT</button>
        <button type="button" onClick={() => { setTicker('0700.HK'); }} className="hover:text-emerald-400 transition-colors">0700.HK</button>
        <button type="button" onClick={() => { setTicker('TSLA'); }} className="hover:text-emerald-400 transition-colors">TSLA</button>
        <button type="button" onClick={() => { setTicker('BTC-USD'); }} className="hover:text-emerald-400 transition-colors">BTC-USD</button>
      </div>
    </form>
  );
};

export default StockInput;