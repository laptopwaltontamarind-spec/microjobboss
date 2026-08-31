import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Layers, 
  Wallet, 
  History, 
  HelpCircle, 
  User as UserIcon, 
  Share2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Flame, 
  Coins, 
  ShieldCheck, 
  ExternalLink, 
  Lock, 
  MessageSquare, 
  Send, 
  Check, 
  AlertCircle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Gift,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GatewayType } from '../../types';

export const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeUserTab, 
    setActiveUserTab, 
    miningPlans, 
    userInvestments, 
    userDeposits, 
    userWithdraws, 
    userAuditLogs, 
    userTickets, 
    deposits,
    gateways, 
    buyMiningPlan, 
    claimMiningReward, 
    submitDeposit, 
    submitWithdraw, 
    createSupportTicket, 
    updateUserProfile,
    settings,
    users,
    toast
  } = useApp();

  // Deposit Form State
  const [selectedDepositGateway, setSelectedDepositGateway] = useState<GatewayType>('bKash');
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositSenderNumber, setDepositSenderNumber] = useState<string>('');
  const [depositTrxId, setDepositTrxId] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);

  // Withdraw Form State
  const [selectedWithdrawGateway, setSelectedWithdrawGateway] = useState<GatewayType>('bKash');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [withdrawRecipientNumber, setWithdrawRecipientNumber] = useState<string>(currentUser?.phone || '');

  // Plan Purchase Modal / State
  const [selectedPlanForBuy, setSelectedPlanForBuy] = useState<string>('plan_standard_12');
  const [planBuyAmount, setPlanBuyAmount] = useState<number>(1000);

  // Support / Complaint State
  const [supportSubject, setSupportSubject] = useState('');
  const [supportCategory, setSupportCategory] = useState<'deposit' | 'withdraw' | 'mining' | 'account' | 'other'>('deposit');
  const [supportMessage, setSupportMessage] = useState('');

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [showProfilePassword, setShowProfilePassword] = useState(false);

  // Real-time Clock for strict 24-hour mining cycle
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const activeInvestments = userInvestments.filter(i => i.status === 'active');
  const totalActiveCapital = activeInvestments.reduce((acc, curr) => acc + curr.investedAmount, 0);
  const totalDailyReturn = activeInvestments.reduce((acc, curr) => acc + curr.dailyReturnAmount, 0);

  // Helper to calculate exact 24-hour cooldown for any investment
  const getInvestmentCooldown = (inv: typeof userInvestments[0]) => {
    let nextClaimTimestamp = inv.nextClaimDate ? new Date(inv.nextClaimDate).getTime() : 0;
    if (!nextClaimTimestamp || isNaN(nextClaimTimestamp)) {
      const lastClaimTime = inv.lastClaimDate ? new Date(inv.lastClaimDate).getTime() : new Date(inv.startDate).getTime();
      nextClaimTimestamp = lastClaimTime + 24 * 60 * 60 * 1000;
    }
    const remainingMs = Math.max(0, nextClaimTimestamp - currentTime);
    const isReady = remainingMs <= 0 && inv.status === 'active' && inv.daysRemaining > 0;
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    return {
      remainingMs,
      isReady,
      hours,
      minutes,
      seconds,
      formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
  };

  const primaryActiveInv = activeInvestments[0] || null;
  const primaryCooldown = primaryActiveInv ? getInvestmentCooldown(primaryActiveInv) : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    toast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitDeposit(selectedDepositGateway, depositSenderNumber, depositAmount, depositTrxId);
    if (res.success) {
      setDepositSenderNumber('');
      setDepositTrxId('');
      setActiveUserTab('history');
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitWithdraw(selectedWithdrawGateway, withdrawRecipientNumber, withdrawAmount);
    if (res.success) {
      setActiveUserTab('history');
    }
  };

  const handlePlanPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const res = buyMiningPlan(selectedPlanForBuy, planBuyAmount);
    if (res.success) {
      setActiveUserTab('dashboard');
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createSupportTicket(supportSubject, supportCategory, supportMessage);
    if (res.success) {
      setSupportSubject('');
      setSupportMessage('');
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileName, profileEmail, profilePhone, profileNewPassword);
    setProfileNewPassword('');
  };

  const referralLink = `${window.location.origin}/?ref=${currentUser.memberCode}`;
  const downlineUsers = users.filter(u => u.referredBy === currentUser.memberCode);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT SIDEBAR NAVIGATION ================= */}
        <aside className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-6">
          {/* User Mini Profile Badge */}
          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950 font-black flex items-center justify-center text-base shadow-md shadow-amber-500/20">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-slate-100 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  {currentUser.memberCode}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-br from-amber-500/15 via-slate-950 to-slate-950 border border-amber-500/30 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Main Wallet Balance</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">Live</span>
            </div>
            <p className="text-2xl font-black text-amber-400 font-mono">
              ৳{currentUser.walletBalance.toLocaleString()}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setActiveUserTab('wallet')}
                className="py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" /> Deposit
              </button>
              <button
                onClick={() => setActiveUserTab('wallet')}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all"
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
              </button>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-4">
            {/* Group 1: Operations */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-2">
                Operations
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveUserTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeUserTab === 'dashboard'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Dashboard (মাইনিং)</span>
                </button>

                <button
                  onClick={() => setActiveUserTab('plans')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeUserTab === 'plans'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Investment Plan (১২% প্ল্যান)</span>
                </button>
              </div>
            </div>

            {/* Group 2: Wallet */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-2">
                Wallet (ওয়ালেট)
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveUserTab('wallet')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeUserTab === 'wallet'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Deposit & Withdraw (ওয়ালেট)</span>
                </button>

                <button
                  onClick={() => setActiveUserTab('history')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeUserTab === 'history'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Wallet History (হিস্ট্রি)</span>
                </button>
              </div>
            </div>

            {/* Group 3: Account */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-2">
                Account (অ্যাকাউন্ট)
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveUserTab('referrals')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeUserTab === 'referrals'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Referlink & MLM (৳৫০ বোনাস)</span>
                </button>

                <button
                  onClick={() => setActiveUserTab('support')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeUserTab === 'support'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help Center & Obijogh (অভিযোগ)</span>
                </button>

                <button
                  onClick={() => setActiveUserTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeUserTab === 'profile'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Profile (প্রোফাইল)</span>
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* ================= RIGHT MAIN CONTENT AREA ================= */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: MINING DASHBOARD */}
          {activeUserTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Top Mining Operation Status Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <Cpu className="w-5 h-5 animate-spin" />
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-slate-100">Live Mining Operation Node</h2>
                        <p className="text-xs text-slate-400">Guaranteed 12.00% Daily Yield Engine</p>
                      </div>
                    </div>

                    {/* Active Capital & Return Summary */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                        <p className="text-[11px] text-slate-400">Active Mining Capital</p>
                        <p className="text-lg font-black text-amber-400 font-mono mt-0.5">৳{totalActiveCapital.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                        <p className="text-[11px] text-slate-400">24-Hour Yield</p>
                        <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">+৳{totalDailyReturn.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* 24h Live Countdown Timer & Claim Button */}
                  <div className="md:col-span-5 bg-slate-950/90 border border-amber-500/40 p-4 rounded-xl text-center space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> ২৪ ঘণ্টা কাউন্টডাউন টাইমার
                      </p>
                      {primaryCooldown?.isReady ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                          ✓ READY TO CLAIM
                        </span>
                      ) : primaryActiveInv ? (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/20">
                          CYCLED 24H
                        </span>
                      ) : null}
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 font-mono font-black text-2xl text-slate-100">
                      <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                        {String(primaryCooldown ? primaryCooldown.hours : 0).padStart(2, '0')}
                        <span className="block text-[9px] font-sans font-normal text-slate-500">HRS</span>
                      </div>
                      <span className="text-amber-500">:</span>
                      <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                        {String(primaryCooldown ? primaryCooldown.minutes : 0).padStart(2, '0')}
                        <span className="block text-[9px] font-sans font-normal text-slate-500">MIN</span>
                      </div>
                      <span className="text-amber-500">:</span>
                      <div className={`bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg ${primaryCooldown?.isReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {String(primaryCooldown ? primaryCooldown.seconds : 0).padStart(2, '0')}
                        <span className="block text-[9px] font-sans font-normal text-slate-500">SEC</span>
                      </div>
                    </div>

                    {primaryActiveInv ? (
                      primaryCooldown?.isReady ? (
                        <button
                          onClick={() => claimMiningReward(primaryActiveInv.id)}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer transition-all animate-pulse"
                        >
                          <Coins className="w-4 h-4" />
                          <span>Claim 12% Mining Profit (৳{primaryActiveInv.dailyReturnAmount.toLocaleString()})</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 bg-slate-900/90 border border-slate-800 text-slate-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-85 select-none"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Mining In Progress ({primaryCooldown?.formatted} পর ক্লেইম উন্মুক্ত)</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => setActiveUserTab('plans')}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Buy 12% Plan to Start Mining</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Mining Contracts List */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>My Active Mining Contracts</span>
                  </h3>
                  <button
                    onClick={() => setActiveUserTab('plans')}
                    className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>+ Buy New Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {userInvestments.length === 0 ? (
                  <div className="text-center py-10 bg-slate-950/60 border border-dashed border-slate-800 rounded-xl space-y-3">
                    <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No active mining contracts yet.</p>
                    <button
                      onClick={() => setActiveUserTab('plans')}
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                    >
                      Browse 12% Mining Plans
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userInvestments.map((inv) => {
                      const cooldown = getInvestmentCooldown(inv);
                      const completedDays = Math.max(0, 30 - inv.daysRemaining);
                      const progressPercent = Math.min(100, Math.round((completedDays / 30) * 100));

                      return (
                        <div key={inv.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-bold text-slate-100">{inv.planName}</span>
                              <p className="text-[10px] text-slate-500 font-mono">ID: {inv.id}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {inv.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-lg text-center font-mono text-xs">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Locked</span>
                              <span className="font-bold text-slate-200">৳{inv.investedAmount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Daily (12%)</span>
                              <span className="font-bold text-emerald-400">+৳{inv.dailyReturnAmount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Remaining</span>
                              <span className="font-bold text-amber-400">{inv.daysRemaining} Days</span>
                            </div>
                          </div>

                          {/* 30-Day Cycle Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>Cycle Progress ({completedDays}/30 Days)</span>
                              <span>{progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                            <span>Claimed: ৳{inv.totalClaimed.toLocaleString()} / ৳{inv.totalExpectedReturn.toLocaleString()}</span>
                            {inv.status === 'active' ? (
                              cooldown.isReady ? (
                                <button
                                  onClick={() => claimMiningReward(inv.id)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-emerald-500/20 flex items-center gap-1 cursor-pointer transition-all"
                                >
                                  <Coins className="w-3.5 h-3.5" />
                                  <span>Claim ৳{inv.dailyReturnAmount.toLocaleString()}</span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-mono text-[10px]">
                                  <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                                  <span>Wait {cooldown.formatted}</span>
                                </div>
                              )
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Completed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INVESTMENT PLANS */}
          {activeUserTab === 'plans' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">Standard 12.00% Daily Mining Plans</h2>
                    <p className="text-xs text-slate-400">Lock period: 30 days. After 30 days, principal matures and you can re-purchase any plan.</p>
                  </div>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
                    Daily 12% Auto Payout
                  </span>
                </div>

                {/* Plan Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {miningPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanForBuy(plan.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                        selectedPlanForBuy === plan.id
                          ? 'bg-slate-950 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-sm text-slate-100">{plan.name}</span>
                        {selectedPlanForBuy === plan.id && (
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        )}
                      </div>

                      <div className="bg-slate-900 p-3 rounded-xl font-mono space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Daily ROI:</span>
                          <span className="text-amber-400 font-bold">12.00% / Day</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Lock Duration:</span>
                          <span className="text-slate-200 font-bold">30 Days</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Min - Max:</span>
                          <span className="text-emerald-400 font-bold">৳{plan.minDeposit} - ৳{plan.maxDeposit.toLocaleString()}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-3">{plan.description}</p>
                    </div>
                  ))}
                </div>

                {/* Purchase Configuration Form */}
                <form onSubmit={handlePlanPurchase} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 mt-6">
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Confirm Investment & Activate Hash Rate</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Investment Amount (৳100 - ৳1,00,000)
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={100000}
                        step={100}
                        required
                        value={planBuyAmount}
                        onChange={(e) => setPlanBuyAmount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-xs space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Your Wallet Balance:</span>
                        <span className="font-bold text-amber-400">৳{currentUser.walletBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Calculated Daily Profit:</span>
                        <span className="font-bold text-emerald-400">+৳{Math.round(planBuyAmount * 0.12).toLocaleString()} / day</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>30-Day Total Yield:</span>
                        <span className="font-bold text-amber-400">৳{(Math.round(planBuyAmount * 0.12) * 30).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Lock ৳{planBuyAmount.toLocaleString()} & Start 12% Daily Mining</span>
                    </button>
                    {currentUser.walletBalance < planBuyAmount && (
                      <button
                        type="button"
                        onClick={() => setActiveUserTab('wallet')}
                        className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl transition-all"
                      >
                        + Deposit Funds
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: WALLET (DEPOSIT & WITHDRAW) */}
          {activeUserTab === 'wallet' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* DEPOSIT FORM */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                      <ArrowDownLeft className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Deposit Money (ডিপোজিট)</h3>
                      <p className="text-[11px] text-slate-400">bKash / Nagad / Rocket / mCash</p>
                    </div>
                  </div>

                  {/* Gateway selector */}
                  <div className="grid grid-cols-4 gap-2">
                    {(['bKash', 'Nagad', 'Rocket', 'mCash'] as GatewayType[]).map((gw) => (
                      <button
                        key={gw}
                        type="button"
                        onClick={() => setSelectedDepositGateway(gw)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          selectedDepositGateway === gw
                            ? 'bg-slate-950 border-amber-500 text-amber-400 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {gw}
                      </button>
                    ))}
                  </div>

                  {/* Admin configured recipient number card */}
                  {gateways[selectedDepositGateway] && (
                    <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Official {selectedDepositGateway} Number:</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">
                          {gateways[selectedDepositGateway].accountType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg">
                        <span className="font-mono text-base font-bold text-slate-100 tracking-wider">
                          {gateways[selectedDepositGateway].accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(gateways[selectedDepositGateway].accountNumber)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                        >
                          {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {gateways[selectedDepositGateway].instructions}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleDepositSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Deposit Amount (৳)
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={100000}
                        required
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Your Sender Number (যে নম্বর থেকে পাঠিয়েছেন)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={depositSenderNumber}
                        onChange={(e) => setDepositSenderNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Transaction ID (TrxID)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BKL8829104"
                        value={depositTrxId}
                        onChange={(e) => setDepositTrxId(e.target.value)}
                        className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none uppercase ${
                          depositTrxId.trim().length >= 4 && deposits.some(d => d.trxId.trim().toUpperCase() === depositTrxId.trim().toUpperCase())
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-800 focus:border-amber-500'
                        }`}
                      />
                      {depositTrxId.trim().length >= 4 && deposits.some(d => d.trxId.trim().toUpperCase() === depositTrxId.trim().toUpperCase()) && (
                        <p className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          এই TrxID টি ইতিমধ্যে একবার ব্যবহৃত হয়েছে! একটি TrxID শুধুমাত্র একবারই ব্যবহার করা যাবে।
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={depositTrxId.trim().length >= 4 && deposits.some(d => d.trxId.trim().toUpperCase() === depositTrxId.trim().toUpperCase())}
                      className={`w-full py-3 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                        depositTrxId.trim().length >= 4 && deposits.some(d => d.trxId.trim().toUpperCase() === depositTrxId.trim().toUpperCase())
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer'
                      }`}
                    >
                      <ArrowDownLeft className="w-4 h-4" />
                      <span>Submit Deposit Request (৳{depositAmount.toLocaleString()})</span>
                    </button>
                  </form>
                </div>

                {/* WITHDRAW FORM */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Withdraw Money (উইথড্র)</h3>
                      <p className="text-[11px] text-slate-400">Available: ৳{currentUser.walletBalance.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Gateway selector */}
                  <div className="grid grid-cols-4 gap-2">
                    {(['bKash', 'Nagad', 'Rocket', 'mCash'] as GatewayType[]).map((gw) => (
                      <button
                        key={gw}
                        type="button"
                        onClick={() => setSelectedWithdrawGateway(gw)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          selectedWithdrawGateway === gw
                            ? 'bg-slate-950 border-rose-500 text-rose-400 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {gw}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleWithdrawSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Withdraw Amount (Min: ৳150 - Max: ৳50,000)
                      </label>
                      <input
                        type="number"
                        min={150}
                        max={50000}
                        required
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Your {selectedWithdrawGateway} Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={withdrawRecipientNumber}
                        onChange={(e) => setWithdrawRecipientNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    {/* Breakdown */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Withdraw Request:</span>
                        <span>৳{withdrawAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Withdraw Charge (15%):</span>
                        <span className="text-rose-400">-৳{(withdrawAmount * 0.15).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-200 font-bold pt-1 border-t border-slate-800">
                        <span>You will receive:</span>
                        <span className="text-emerald-400">৳{(withdrawAmount * 0.85).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={currentUser.walletBalance < withdrawAmount}
                      className={`w-full py-3 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                        currentUser.walletBalance >= withdrawAmount
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white shadow-rose-500/20 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Request Cashout (৳{withdrawAmount.toLocaleString()})</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WALLET HISTORY (AUDIT TRAIL) */}
          {activeUserTab === 'history' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">Wallet Transaction History & Audit Trail</h3>
                    <p className="text-[11px] text-slate-400">Complete record of deposits, withdrawals, mining yields and commissions</p>
                  </div>
                </div>
              </div>

              {userAuditLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No transaction audit records yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {userAuditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl flex items-center justify-between gap-4 text-xs transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          log.isCredit ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {log.isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">{log.title}</p>
                          <p className="text-[11px] text-slate-400">{log.description}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className={`font-bold text-sm block ${log.isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {log.isCredit ? '+' : '-'}৳{log.amount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Balance: ৳{log.balanceAfter.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: REFERLINK & MLM COMMISSION */}
          {activeUserTab === 'referrals' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">MLM Referral System & Commission</h3>
                      <p className="text-[11px] text-slate-400">Earn ৳50 direct commission on every plan purchased by your referrals</p>
                    </div>
                  </div>
                </div>

                {/* Referral Link Card */}
                <div className="bg-gradient-to-r from-amber-500/15 via-slate-950 to-slate-950 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">Your Unique Referral Link:</span>
                    <span className="font-mono text-amber-400 font-bold">Code: {currentUser.memberCode}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="w-full bg-transparent text-xs text-slate-200 font-mono focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(referralLink)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Total Referrals</span>
                      <span className="font-bold text-slate-200 text-base">{downlineUsers.length} Members</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Referral Bonus Earned</span>
                      <span className="font-bold text-amber-400 text-base">৳{currentUser.referralEarnings.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 block">Plan Buy Commission</span>
                      <span className="font-bold text-emerald-400 text-base">৳50 / Plan</span>
                    </div>
                  </div>
                </div>

                {/* Downline Members List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                    Downline Members ({downlineUsers.length})
                  </h4>

                  {downlineUsers.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
                      No members registered under your link yet. Share your code to earn ৳50 per plan!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {downlineUsers.map((u) => (
                        <div key={u.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-200">{u.name}</span>
                            <span className="text-slate-500 ml-2 font-mono">({u.memberCode})</span>
                            <p className="text-[10px] text-slate-500">Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                            Active Downline
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HELP CENTER & OBIJOGH BOX */}
          {activeUserTab === 'support' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Help Center & Complaint Box (অভিযোগ বক্স)</h3>
                      <p className="text-[11px] text-slate-400">Direct connection with Admin support team</p>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={settings.telegramSupportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-950 border border-sky-500/30 hover:border-sky-500 rounded-xl flex items-center gap-3 transition-all"
                  >
                    <div className="p-2.5 rounded-lg bg-sky-500/20 text-sky-400">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-100">Official Telegram Channel</p>
                      <p className="text-[10px] text-slate-400">Instant announcements & updates</p>
                    </div>
                  </a>

                  <a
                    href={settings.whatsappSupportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 rounded-xl flex items-center gap-3 transition-all"
                  >
                    <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-100">Official WhatsApp Helpline</p>
                      <p className="text-[10px] text-slate-400">24/7 direct chat with staff</p>
                    </div>
                  </a>
                </div>

                {/* Complaint Submission Form */}
                <form onSubmit={handleSupportSubmit} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3.5">
                  <h4 className="font-bold text-xs text-slate-200">Submit an Official Complaint / Issue</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Deposit approval delay for bKash"
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
                      <select
                        value={supportCategory}
                        onChange={(e) => setSupportCategory(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="deposit">Deposit Issue</option>
                        <option value="withdraw">Withdraw Issue</option>
                        <option value="mining">Mining ROI Question</option>
                        <option value="account">Account / Login</option>
                        <option value="other">Other Query</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Message (বিস্তারিত লিখুন)</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Please explain your issue clearly with TrxID / Number if applicable..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Submit Complaint to Admin
                  </button>
                </form>

                {/* Submitted Tickets History */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Your Ticket History</h4>
                  {userTickets.length === 0 ? (
                    <p className="text-xs text-slate-500">No support tickets submitted yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {userTickets.map((tkt) => (
                        <div key={tkt.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-100">{tkt.subject}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tkt.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {tkt.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-300">{tkt.message}</p>
                          {tkt.reply && (
                            <div className="bg-slate-900/90 border-l-2 border-amber-500 p-2.5 rounded-r-lg mt-2 text-amber-200">
                              <p className="text-[10px] font-bold text-amber-400">Admin Response:</p>
                              <p className="text-xs mt-0.5">{tkt.reply}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeUserTab === 'profile' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">{currentUser.name}</h3>
                  <p className="text-xs text-amber-400 font-mono">Member ID: {currentUser.memberCode}</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Password (leave blank to keep current)</label>
                  <div className="relative">
                    <input
                      type={showProfilePassword ? 'text' : 'password'}
                      placeholder="Enter new password if changing"
                      value={profileNewPassword}
                      onChange={(e) => setProfileNewPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfilePassword(!showProfilePassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
                      title={showProfilePassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showProfilePassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
