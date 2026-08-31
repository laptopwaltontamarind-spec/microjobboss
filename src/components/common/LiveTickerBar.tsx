import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ShieldCheck, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GatewayType } from '../../types';

const GATEWAY_STYLES: Record<GatewayType, { bg: string; text: string; border: string }> = {
  bKash: {
    bg: 'bg-[#E2136E]/15',
    text: 'text-[#E2136E]',
    border: 'border-[#E2136E]/30'
  },
  Nagad: {
    bg: 'bg-[#F7941D]/15',
    text: 'text-[#F7941D]',
    border: 'border-[#F7941D]/30'
  },
  Rocket: {
    bg: 'bg-[#8C3494]/15',
    text: 'text-[#C767D3]',
    border: 'border-[#8C3494]/30'
  },
  mCash: {
    bg: 'bg-[#00833E]/15',
    text: 'text-[#00C853]',
    border: 'border-[#00833E]/30'
  }
};

export const LiveTickerBar: React.FC = () => {
  const { liveTickers } = useApp();

  return (
    <div className="bg-slate-900/90 border-y border-slate-800/80 py-2.5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Fixed Tag */}
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Live Payouts</span>
        </div>

        {/* Marquee Content */}
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-xs">
          {liveTickers.slice(0, 10).map((item) => {
            const style = GATEWAY_STYLES[item.gateway] || GATEWAY_STYLES.bKash;
            const isDeposit = item.type === 'deposit';

            return (
              <div
                key={item.id}
                className="inline-flex items-center gap-2 bg-slate-950/70 border border-slate-800 hover:border-slate-700 px-3 py-1 rounded-lg text-slate-300 transition-all"
              >
                <div className={`p-1 rounded-full ${isDeposit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {isDeposit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                </div>

                <span className="font-mono text-slate-400">{item.userMask}</span>
                
                <span className={`font-bold ${isDeposit ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isDeposit ? '+' : '-'}৳{item.amount.toLocaleString()}
                </span>

                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                  {item.gateway}
                </span>

                <span className="text-[10px] text-slate-500 font-sans">{item.timeAgo}</span>
              </div>
            );
          })}
        </div>

        {/* Security verification tag */}
        <div className="hidden md:flex flex-shrink-0 items-center gap-1 text-[11px] text-emerald-400/90 pl-2 border-l border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Audited Real Payouts</span>
        </div>
      </div>
    </div>
  );
};
