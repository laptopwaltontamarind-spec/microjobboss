import React, { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Gift, 
  Coins, 
  Lock, 
  RefreshCcw, 
  HelpCircle, 
  MessageSquare, 
  ChevronRight,
  Calculator,
  Flame,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MiningPlan } from '../../types';

export const LandingPage: React.FC = () => {
  const { 
    miningPlans, 
    settings, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    currentUser, 
    setActiveUserTab,
    deposits,
    withdraws,
    liveTickers
  } = useApp();

  // Interactive ROI Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(2000);
  const dailyReturn = Math.round(calcAmount * 0.12);
  const totalReturn30Days = dailyReturn * 30;
  const netProfit30Days = totalReturn30Days - calcAmount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-900 bg-grid-pattern">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                  12.00% Daily Mining Return • 30-Day Cycle
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Empower Your Earnings with <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-rose-500 bg-clip-text text-transparent">
                  MICROJOBBOSS
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                Bangladesh’s premier automated micro-mining ecosystem. Deposit securely via <strong className="text-white">bKash, Nagad, Rocket, or mCash</strong>, receive 12% daily guaranteed profit directly into your wallet every 24 hours, and cash out instantly.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                {currentUser ? (
                  <button
                    onClick={() => setActiveUserTab('dashboard')}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Go to Mining Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthModalMode('register');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Start Mining Now (12% Daily)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-6 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>Member Login</span>
                    </button>
                  </>
                )}
              </div>

              {/* Micro Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant bKash/Nagad Payout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>৳{settings.referralBonusPerPlan || 40} Instant Refer Bonus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>24/7 Verified Support</span>
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Mining Simulator & Calculator */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Live ROI Profit Calculator</h3>
                      <p className="text-[11px] text-slate-400">Standard 12% / Day Active Node</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/30">
                    +12.00% / Day
                  </span>
                </div>

                {/* Amount Slider */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                      <span>Investment Amount:</span>
                      <span className="text-amber-400 font-mono text-sm font-bold">৳{calcAmount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={50000}
                      step={100}
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>Min: ৳100</span>
                      <span>৳10,000</span>
                      <span>Max: ৳50,000</span>
                    </div>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCalcAmount(amt)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                          calcAmount === amt
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>

                  {/* Result Box */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3 font-mono">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Daily Return (Every 24h):</span>
                      <span className="text-emerald-400 font-bold text-sm">+৳{dailyReturn.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Lock Duration:</span>
                      <span className="text-slate-200 font-bold">30 Days</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">30-Day Total Return:</span>
                      <span className="text-amber-400 font-extrabold text-base">৳{totalReturn30Days.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">Net Profit:</span>
                      <span className="text-emerald-400 font-bold font-sans">৳{netProfit30Days.toLocaleString()} (+360% ROI)</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setAuthModalMode('register');
                        setIsAuthModalOpen(true);
                      } else {
                        setActiveUserTab('plans');
                      }
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Activate Plan for ৳{calcAmount.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM METRICS STATS COUNTER */}
      <section className="py-12 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl text-center relative overflow-hidden group hover:border-amber-500/40 transition-colors">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
                {settings.totalMembersCount.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Total Active Members</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl text-center relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mx-auto mb-3">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                ৳{(settings.totalDepositsVolume / 100000).toFixed(2)} Lac+
              </p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Total Deposits Verified</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl text-center relative overflow-hidden group hover:border-rose-500/40 transition-colors">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl w-fit mx-auto mb-3">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
                ৳{(settings.totalWithdrawsVolume / 100000).toFixed(2)} Lac+
              </p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Total Withdraws Paid</p>
            </div>

            {/* Stat 4 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl text-center relative overflow-hidden group hover:border-sky-500/40 transition-colors">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">
                24 Hours
              </p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Daily Automated Claim Cycle</p>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTMENT PLANS SHOWCASE */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold tracking-wider uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              High-Yield Packages
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
              Standard 12% Daily Mining Packages
            </h2>
            <p className="text-slate-400 text-sm">
              All plans run on a 30-day smart cycle with instant daily payouts. At the end of 30 days, you can re-purchase any plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {miningPlans.map((plan, idx) => {
              const isStandard = plan.id === 'plan_standard_12';

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 relative flex flex-col justify-between transition-all ${
                    isStandard
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 transform lg:-translate-y-2'
                      : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">Daily Return</span>
                        <span className="text-2xl font-extrabold text-amber-400 font-mono">12.00%</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs">
                        <span className="text-slate-400">Lock Duration</span>
                        <span className="text-slate-200 font-bold font-mono">30 Days</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1 text-xs">
                        <span className="text-slate-400">Deposit Range</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          ৳{plan.minDeposit.toLocaleString()} - ৳{plan.maxDeposit.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {plan.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setAuthModalMode('register');
                        setIsAuthModalOpen(true);
                      } else {
                        setActiveUserTab('plans');
                      }
                    }}
                    className={`mt-6 w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isStandard
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 font-extrabold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Purchase & Activate</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SUPPORTED PAYMENT GATEWAYS */}
      <section className="py-16 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Multi-Gateway Deposit & Withdrawal
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Instant transactions with Bangladesh’s leading mobile financial services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* bKash */}
            <div className="bg-[#E2136E]/10 border border-[#E2136E]/30 rounded-2xl p-5 hover:border-[#E2136E] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-extrabold text-[#E2136E]">bKash Personal</span>
                <span className="text-[10px] bg-[#E2136E] text-white px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <p className="text-xs text-slate-300">Fast send money with instant TrxID validation.</p>
              <div className="mt-4 pt-3 border-t border-[#E2136E]/20 text-[11px] font-mono text-slate-400 space-y-1">
                <p>Min Deposit: ৳100</p>
                <p>Withdraw Speed: 5-15 Mins</p>
              </div>
            </div>

            {/* Nagad */}
            <div className="bg-[#F7941D]/10 border border-[#F7941D]/30 rounded-2xl p-5 hover:border-[#F7941D] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-extrabold text-[#F7941D]">Nagad Personal</span>
                <span className="text-[10px] bg-[#F7941D] text-slate-950 px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <p className="text-xs text-slate-300">Lowest fee mobile wallet with instant cashout.</p>
              <div className="mt-4 pt-3 border-t border-[#F7941D]/20 text-[11px] font-mono text-slate-400 space-y-1">
                <p>Min Deposit: ৳100</p>
                <p>Withdraw Speed: 5-15 Mins</p>
              </div>
            </div>

            {/* Rocket */}
            <div className="bg-[#8C3494]/10 border border-[#8C3494]/30 rounded-2xl p-5 hover:border-[#8C3494] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-extrabold text-[#C767D3]">DBBL Rocket</span>
                <span className="text-[10px] bg-[#8C3494] text-white px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <p className="text-xs text-slate-300">12-digit DBBL Rocket personal send money.</p>
              <div className="mt-4 pt-3 border-t border-[#8C3494]/20 text-[11px] font-mono text-slate-400 space-y-1">
                <p>Min Deposit: ৳100</p>
                <p>Withdraw Speed: 5-15 Mins</p>
              </div>
            </div>

            {/* mCash */}
            <div className="bg-[#00833E]/10 border border-[#00833E]/30 rounded-2xl p-5 hover:border-[#00833E] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-extrabold text-[#00C853]">IBBL mCash</span>
                <span className="text-[10px] bg-[#00833E] text-white px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <p className="text-xs text-slate-300">Islami Bank Bangladesh Limited mobile banking.</p>
              <div className="mt-4 pt-3 border-t border-[#00833E]/20 text-[11px] font-mono text-slate-400 space-y-1">
                <p>Min Deposit: ৳100</p>
                <p>Withdraw Speed: 5-15 Mins</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MLM REFERRAL COMMISSION PROGRAM */}
      <section className="py-16 bg-slate-900/60 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-rose-500/15 border border-amber-500/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Unique Referral Program (MLM)</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
                  Earn ৳{settings.referralBonusPerPlan || 40} Instant Bonus Every Time Your Referral Buys a Plan!
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  Share your unique referral link (e.g. <span className="font-mono text-amber-400 font-bold">microjobboss.com/register?ref=micr879F70</span>). Whenever someone joins and purchases a mining plan, you immediately get <strong className="text-white">৳{settings.referralBonusPerPlan || 40} cash commission</strong> credited to your balance with zero restrictions.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-xs">
                    <span className="text-slate-400">Direct Plan Bonus: </span>
                    <span className="text-amber-400 font-bold">৳{settings.referralBonusPerPlan || 40} / Plan</span>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-xs">
                    <span className="text-slate-400">Withdraw Limit: </span>
                    <span className="text-emerald-400 font-bold">No Minimums</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-slate-950/80 border border-amber-500/30 rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p className="text-xs text-slate-400">Sample Member Code</p>
                <p className="text-xl font-mono font-black text-amber-400 my-1">micr879F70</p>
                <p className="text-[11px] text-slate-500">Auto-generated for every member</p>

                <button
                  onClick={() => {
                    if (!currentUser) {
                      setAuthModalMode('register');
                      setIsAuthModalOpen(true);
                    } else {
                      setActiveUserTab('referrals');
                    }
                  }}
                  className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Get Your Referral Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-900 py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                  <Zap className="w-4 h-4 fill-slate-950" />
                </div>
                <span className="font-extrabold text-base text-slate-100">MICROJOBBOSS</span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                MICROJOBBOSS is a high-performance 12% daily mining platform supporting bKash, Nagad, Rocket, and mCash. Verified multi-gateway audit trail with 24/7 dedicated support desk.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveUserTab('dashboard')} className="hover:text-amber-400 transition-colors">
                    Mining Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveUserTab('plans')} className="hover:text-amber-400 transition-colors">
                    Standard 12% Plan
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveUserTab('wallet')} className="hover:text-amber-400 transition-colors">
                    Deposit & Withdraw
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveUserTab('referrals')} className="hover:text-amber-400 transition-colors">
                    Referral System
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Official Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href={settings.telegramSupportUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-sky-400" /> Telegram Channel
                  </a>
                </li>
                <li>
                  <a href={settings.whatsappSupportUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Helpline
                  </a>
                </li>
                <li>
                  <button onClick={() => setActiveUserTab('support')} className="hover:text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Member Complaint Desk
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} MICROJOBBOSS. All Rights Reserved.</p>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Domain: microjobboss.com</span>
              <span>•</span>
              <button 
                onClick={() => {
                  setAuthModalMode('admin_login');
                  setIsAuthModalOpen(true);
                }}
                className="text-emerald-400 hover:underline flex items-center gap-1 cursor-default text-left"
                title="System Security Node"
              >
                ● 100% Encrypted & Verified
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
