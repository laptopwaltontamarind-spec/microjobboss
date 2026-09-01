import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  UserCheck, 
  KeyRound, 
  Wallet, 
  Settings, 
  Edit3, 
  MessageSquare, 
  UserPlus, 
  Trash2, 
  Sliders, 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  Plus, 
  Filter, 
  Flame, 
  CreditCard,
  Lock,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  Eye,
  Check,
  ChevronDown,
  ExternalLink,
  LogOut,
  Wrench,
  CheckSquare,
  Square,
  TrendingUp,
  TrendingDown,
  Coins,
  DollarSign,
  Activity,
  PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, GatewayType, SupportTicket } from '../../types';

export const AdminPortal: React.FC = () => {
  const {
    currentAdmin,
    activeAdminTab,
    setActiveAdminTab,
    setCurrentPortal,
    logoutAdmin,
    users,
    deposits,
    withdraws,
    supportTickets,
    resetRequests,
    gateways,
    settings,
    approveDeposit,
    rejectDeposit,
    approveWithdraw,
    rejectWithdraw,
    adjustMemberWallet,
    banMember,
    unbanMember,
    deleteMember,
    editMemberDetails,
    updateGatewayConfig,
    replySupportTicket,
    approvePasswordReset,
    rejectPasswordReset,
    addModerator,
    updateModeratorPermissions,
    deleteModerator,
    updateSettings,
    addManualTicker,
    setIsAuthModalOpen,
    setAuthModalMode,
    toast
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<User | null>(null);

  // Wallet adjustment modal state
  const [walletDeltaAmount, setWalletDeltaAmount] = useState<number>(500);
  const [walletAdjustType, setWalletAdjustType] = useState<'increase' | 'decrease'>('increase');
  const [walletAdjustReason, setWalletAdjustReason] = useState<string>('Bonus / Manual adjustment');

  // Member Edit modal state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Ban modal state
  const [banReasonInput, setBanReasonInput] = useState('Suspicious activity / Fake TrxID');

  // Support Reply state
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [ticketStatusSelect, setTicketStatusSelect] = useState<SupportTicket['status']>('resolved');

  // Password reset approval state
  const [tempPasswordInput, setTempPasswordInput] = useState('user123');

  // Moderator creation state
  const [modName, setModName] = useState('');
  const [modPhone, setModPhone] = useState('');
  const [modEmail, setModEmail] = useState('');
  const [modPassword, setModPassword] = useState('mod123');
  const [modPerms, setModPerms] = useState({
    canApproveDeposits: true,
    canApproveWithdrawals: true,
    canManageMembers: false,
    canAdjustWallet: false,
    canManageSupport: true,
    canEditGateways: false,
    canViewAuditLogs: true,
    canManageMaintenance: false
  });

  // Moderator edit modal state
  const [editingModerator, setEditingModerator] = useState<User | null>(null);
  const [editModPerms, setEditModPerms] = useState({
    canApproveDeposits: true,
    canApproveWithdrawals: true,
    canManageMembers: false,
    canAdjustWallet: false,
    canManageSupport: true,
    canEditGateways: false,
    canViewAuditLogs: true,
    canManageMaintenance: false
  });

  // Quick maintenance control state
  const [maintenanceText, setMaintenanceText] = useState(settings.maintenanceNotice || 'সাইটের কাজ চলতেছে, কিছুক্ষণ অপেক্ষা করুন।');
  const [maintenanceEstimate, setMaintenanceEstimate] = useState(settings.maintenanceEstimateTime || '15-30 মিনিট');

  // Manual live ticker injection state
  const [tickerPhone, setTickerPhone] = useState('01798123456');
  const [tickerAmount, setTickerAmount] = useState(2500);
  const [tickerType, setTickerType] = useState<'deposit' | 'withdraw'>('deposit');
  const [tickerGateway, setTickerGateway] = useState<GatewayType>('bKash');

  if (!currentAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Admin Authorization Required</h2>
        <p className="text-xs text-slate-400">
          This portal is restricted to authorized Super Admins and Staff Moderators of MICROJOBBOSS.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('admin_login');
            setIsAuthModalOpen(true);
          }}
          className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 cursor-pointer transition-all"
        >
          Sign In to Admin Portal
        </button>
      </div>
    );
  }

  // Filtered members by search
  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      u.memberCode.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  const bannedUsers = users.filter(u => u.isBanned);
  const regularUsers = filteredUsers.filter(u => u.role === 'user');
  const moderatorUsers = users.filter(u => u.role === 'moderator');
  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdraws = withdraws.filter(w => w.status === 'pending');
  const pendingResets = resetRequests.filter(r => r.status === 'pending');
  const openTickets = supportTickets.filter(t => t.status === 'open' || t.status === 'in_progress');

  // Platform Aggregate Totals (Financial & Member Statistics)
  const totalMembersCount = users.length;
  const activeMembersCount = users.filter(u => !u.isBanned && u.role === 'user').length;
  const bannedMembersCount = users.filter(u => u.isBanned).length;
  const totalUserWalletsBalance = users.reduce((sum, u) => sum + (Number(u.balance) || 0), 0);

  // Deposit Totals
  const totalDepositsApprovedAmount = deposits
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalDepositsApprovedCount = deposits.filter(d => d.status === 'approved').length;
  const totalDepositsPendingAmount = deposits
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalDepositsPendingCount = deposits.filter(d => d.status === 'pending').length;
  const totalDepositsAllCount = deposits.length;

  // Withdrawal Totals
  const totalWithdrawalsApprovedAmount = withdraws
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
  const totalWithdrawalsApprovedCount = withdraws.filter(w => w.status === 'approved').length;
  const totalWithdrawalsPendingAmount = withdraws
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
  const totalWithdrawalsPendingCount = withdraws.filter(w => w.status === 'pending').length;
  const totalWithdrawalsAllCount = withdraws.length;

  // Net Cash Flow / Reserve
  const netPlatformReserve = totalDepositsApprovedAmount - totalWithdrawalsApprovedAmount;

  // Gateway-specific breakdown helper
  const getGatewayFinancials = (gw: GatewayType) => {
    const depApproved = deposits.filter(d => d.gateway === gw && d.status === 'approved').reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const depApprovedCount = deposits.filter(d => d.gateway === gw && d.status === 'approved').length;
    const depPending = deposits.filter(d => d.gateway === gw && d.status === 'pending').reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const withApproved = withdraws.filter(w => w.gateway === gw && w.status === 'approved').reduce((s, w) => s + (Number(w.amount) || 0), 0);
    const withApprovedCount = withdraws.filter(w => w.gateway === gw && w.status === 'approved').length;
    const withPending = withdraws.filter(w => w.gateway === gw && w.status === 'pending').reduce((s, w) => s + (Number(w.amount) || 0), 0);
    return { depApproved, depApprovedCount, depPending, withApproved, withApprovedCount, withPending };
  };

  const openMemberDetail = (user: User) => {
    setSelectedMember(user);
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditEmail(user.email);
    setEditPassword(user.password || '');
  };

  const handleAdjustWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    const delta = walletAdjustType === 'increase' ? Number(walletDeltaAmount) : -Number(walletDeltaAmount);
    adjustMemberWallet(selectedMember.id, delta, walletAdjustReason);
    setSelectedMember(null);
  };

  const handleEditMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    editMemberDetails(selectedMember.id, {
      name: editName,
      phone: editPhone,
      email: editEmail,
      password: editPassword
    });
    setSelectedMember(null);
  };

  const handleBanMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    banMember(selectedMember.id, banReasonInput);
    setSelectedMember(null);
  };

  const handleCreateModerator = (e: React.FormEvent) => {
    e.preventDefault();
    addModerator(modName, modPhone, modEmail, modPassword, modPerms);
    setModName('');
    setModPhone('');
    setModEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Admin Summary Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100">MICROJOBBOSS Admin Backoffice</h2>
              <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/30">
                {currentAdmin.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Operator: {currentAdmin.name} ({currentAdmin.memberCode}) • Realtime Management
            </p>
          </div>
        </div>

        {/* Global Member Quick Search Input & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Member ID / Phone / Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPortal('user')}
              className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              title="Switch to User Portal view"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>User Site</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="flex-1 sm:flex-none px-3 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-600/40 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              title="Logout Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK MAINTENANCE MODE CONTROLLER */}
      <div className={`p-5 rounded-2xl border transition-all ${
        settings.isMaintenanceMode 
          ? 'bg-amber-950/40 border-amber-500/50 shadow-xl shadow-amber-500/10' 
          : 'bg-slate-900/80 border-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${settings.isMaintenanceMode ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100">
                  সিস্টেম মেইনটেন্যান্স ও নোটিস কন্ট্রোল (Site Maintenance Mode)
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  settings.isMaintenanceMode 
                    ? 'bg-amber-500 text-slate-950 font-black animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {settings.isMaintenanceMode ? '🔴 MAINTENANCE IS ACTIVE' : '🟢 SITE IS LIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {settings.isMaintenanceMode 
                  ? 'সাইটে মেইনটেন্যান্স চালু আছে। সাধারণ ইউজাররা নোটিস পেজ দেখবে, তবে অ্যাডমিন স্বাভাবিকভাবে কাজ করতে পারবে।'
                  : 'সাইটের কোনো আপডেট বা সাজানোর কাজ করার সময় এখানে ১-ক্লিকে মেইনটেন্যান্স মোড অন করে কাস্টম নোটিস লিখে দিতে পারেন।'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                const nextState = !settings.isMaintenanceMode;
                updateSettings({ 
                  isMaintenanceMode: nextState,
                  maintenanceNotice: maintenanceText,
                  maintenanceEstimateTime: maintenanceEstimate
                });
                toast(
                  nextState 
                    ? 'মেইনটেন্যান্স মোড চালু করা হয়েছে! ভিজিটররা নোটিস দেখতে পাবে।' 
                    : 'মেইনটেন্যান্স মোড বন্ধ করা হয়েছে! সাইট সম্পূর্ণ লাইভ।', 
                  nextState ? 'info' : 'success'
                );
              }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md ${
                settings.isMaintenanceMode
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-600/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>{settings.isMaintenanceMode ? 'Turn OFF Maintenance (সাইট লাইভ করুন)' : 'Turn ON Maintenance (কাজ চলছে নোটিস দিন)'}</span>
            </button>
          </div>
        </div>

        {/* Maintenance message customization dropdown / input */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-8">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              মেইনটেন্যান্স নোটিস টেক্সট (ইউজাররা যা দেখতে পাবে):
            </label>
            <input
              type="text"
              value={maintenanceText}
              onChange={(e) => setMaintenanceText(e.target.value)}
              placeholder="e.g. সাইটের কাজ চলতেছে, কিছুক্ষণ অপেক্ষা করুন।"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              আনুমানিক সময়:
            </label>
            <input
              type="text"
              value={maintenanceEstimate}
              onChange={(e) => setMaintenanceEstimate(e.target.value)}
              placeholder="15-30 মিনিট"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="button"
              onClick={() => {
                updateSettings({
                  maintenanceNotice: maintenanceText,
                  maintenanceEstimateTime: maintenanceEstimate
                });
                toast('নোটিস সফলভাবে আপডেট হয়েছে!', 'success');
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer transition-colors"
            >
              Save Notice
            </button>
          </div>
        </div>
      </div>

      {/* PRIMARY EXECUTIVE KPI STATS BAR */}
      <div className="space-y-3">
        {/* Top 3 High-Impact Cards (User requested: Total Member, Total Deposit, Total Withdraw) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. TOTAL MEMBERS */}
          <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>মোট মেম্বার (Total Members)</span>
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight">
                    {totalMembersCount}
                  </span>
                  <span className="text-xs font-bold text-slate-400">জন নিবন্ধিত</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                সক্রিয়: <strong className="text-emerald-400">{activeMembersCount}</strong> জন
              </span>
              <span className="text-slate-400">
                ব্যান: <strong className="text-rose-400">{bannedMembersCount}</strong> জন
              </span>
              <span className="text-slate-400">
                স্টাফ: <strong className="text-amber-400">{moderatorUsers.length}</strong> জন
              </span>
            </div>
          </div>

          {/* 2. TOTAL DEPOSITS MADE */}
          <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>মোট ডিপোজিট হয়েছে (Total Deposits)</span>
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight">
                    ৳{totalDepositsApprovedAmount.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400/80">BDT</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                অনুমোদিত: <strong className="text-emerald-400">{totalDepositsApprovedCount}</strong> টি
              </span>
              <span className="text-slate-400">
                পেন্ডিং: <strong className="text-amber-400">৳{totalDepositsPendingAmount.toLocaleString()}</strong> ({pendingDeposits.length} টি)
              </span>
            </div>
          </div>

          {/* 3. TOTAL WITHDRAWALS PAID */}
          <div className="bg-gradient-to-br from-rose-950/80 to-slate-900 border border-rose-500/30 p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" />
                  <span>মোট উইথড্র দেওয়া হয়েছে (Total Withdraw)</span>
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-rose-300 font-mono tracking-tight">
                    ৳{totalWithdrawalsApprovedAmount.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-rose-400/80">BDT</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                পেইড সম্পন্ন: <strong className="text-emerald-400">{totalWithdrawalsApprovedCount}</strong> টি
              </span>
              <span className="text-slate-400">
                পেন্ডিং: <strong className="text-amber-400">৳{totalWithdrawalsPendingAmount.toLocaleString()}</strong> ({pendingWithdraws.length} টি)
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Metric Quick Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>নিট ক্যাশ রিজার্ভ (Net Reserve)</span>
            </p>
            <p className={`text-base sm:text-lg font-black font-mono mt-1 ${netPlatformReserve >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
              ৳{netPlatformReserve.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">মোট ডিপোজিট - মোট উইথড্র</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-purple-400" />
              <span>মেম্বার ওয়ালেট ফান্ড (In-System)</span>
            </p>
            <p className="text-base sm:text-lg font-black text-purple-300 font-mono mt-1">
              ৳{totalUserWalletsBalance.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">মেম্বারদের মোট ওয়ালেট ব্যালেন্স</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>অপেক্ষমান কাজ (Pending Queue)</span>
            </p>
            <p className="text-base sm:text-lg font-black text-amber-400 font-mono mt-1">
              {pendingDeposits.length + pendingWithdraws.length} টি
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              ডিপোজিট: {pendingDeposits.length} | উইথড্র: {pendingWithdraws.length}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>সাপোর্ট ও রিসেট (Helpdesk)</span>
            </p>
            <p className="text-base sm:text-lg font-black text-emerald-400 font-mono mt-1">
              {openTickets.length + pendingResets.length} টি
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              টিকেট: {openTickets.length} | পাসওয়ার্ড: {pendingResets.length}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs (Filtered by Role & Granular Permissions) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview & Tickers', icon: Flame, visible: true },
          { id: 'deposits', label: `Deposits (${pendingDeposits.length})`, icon: ArrowDownLeft, visible: currentAdmin.role === 'admin' || currentAdmin.moderatorPermissions?.canApproveDeposits },
          { id: 'withdrawals', label: `Withdrawals (${pendingWithdraws.length})`, icon: ArrowUpRight, visible: currentAdmin.role === 'admin' || currentAdmin.moderatorPermissions?.canApproveWithdrawals },
          { id: 'members', label: 'Members Directory', icon: Users, visible: currentAdmin.role === 'admin' || currentAdmin.moderatorPermissions?.canManageMembers },
          { id: 'banned', label: `Banned Hub (${bannedUsers.length})`, icon: Ban, visible: currentAdmin.role === 'admin' || currentAdmin.moderatorPermissions?.canManageMembers },
          { id: 'gateways', label: 'Gateways (bKash/Nagad)', icon: CreditCard, visible: currentAdmin.role === 'admin' || currentAdmin.moderatorPermissions?.canEditGateways },
          { id: 'support', label: `Support Box (${openTickets.length})`, icon: MessageSquare, visible: currentAdmin.role === 'admin' || currentAdmin.moderatorPermissions?.canManageSupport },
          { id: 'resets', label: `Reset Codes (${pendingResets.length})`, icon: KeyRound, visible: currentAdmin.role === 'admin' || currentAdmin.moderatorPermissions?.canManageMembers },
          { id: 'moderators', label: 'Moderators & Staff', icon: UserPlus, visible: currentAdmin.role === 'admin' },
          { id: 'settings', label: 'Site Settings', icon: Sliders, visible: currentAdmin.role === 'admin' || currentAdmin.moderatorPermissions?.canManageMaintenance }
        ].filter(t => t.visible).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. DEPOSIT REQUESTS REVIEW */}
      {activeAdminTab === 'deposits' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                <span>bKash / Nagad / Rocket / mCash ডিপোজিট ভেরিফিকেশন ও অ্যাপ্রুভাল</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                মেম্বারদের পাঠানো ডিপোজিট রিকোয়েস্ট ট্রানজেকশন আইডি মিলিয়ে অ্যাপ্রুভ করুন।
              </p>
            </div>
            {/* Quick Deposit Stats */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase">মোট ডিপোজিট হয়েছে</span>
                <span className="text-xs font-black text-emerald-300 font-mono">
                  ৳{totalDepositsApprovedAmount.toLocaleString()} ({totalDepositsApprovedCount}টি)
                </span>
              </div>
              <div className="bg-amber-950/80 border border-amber-700/60 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">পেন্ডিং ডিপোজিট</span>
                <span className="text-xs font-black text-amber-300 font-mono">
                  ৳{totalDepositsPendingAmount.toLocaleString()} ({pendingDeposits.length}টি)
                </span>
              </div>
            </div>
          </div>

          {deposits.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No deposit requests recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Gateway</th>
                    <th className="py-2.5 px-3">Sender Number</th>
                    <th className="py-2.5 px-3">TrxID</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-200 block">{dep.userName}</span>
                        <span className="text-[10px] text-amber-400 font-mono">{dep.memberCode}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-300">{dep.gateway}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {dep.senderNumber}
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-400 font-bold">
                        {dep.trxId}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        ৳{dep.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dep.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                          dep.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-amber-500/20 text-amber-400 animate-pulse'
                        }`}>
                          {dep.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {dep.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approveDeposit(dep.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] rounded flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => rejectDeposit(dep.id, 'Payment not received in account')}
                              className="px-2 py-1 bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-800 text-[11px] rounded flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">
                            Processed: {dep.processedBy || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. WITHDRAWAL REQUESTS REVIEW */}
      {activeAdminTab === 'withdrawals' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-rose-400" />
                <span>মেম্বার উইথড্র ও ক্যাশআউট রিকোয়েস্ট প্রসেসিং</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                মেম্বারদের বিকাশ/নগদ অ্যাকাউন্টে টাকা পাঠিয়ে রিকোয়েস্ট 'Approve & Paid' করুন।
              </p>
            </div>
            {/* Quick Withdraw Stats */}
            <div className="flex items-center gap-2">
              <div className="bg-rose-950/80 border border-rose-700/60 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-rose-400 font-bold block uppercase">মোট উইথড্র দেওয়া হয়েছে</span>
                <span className="text-xs font-black text-rose-300 font-mono">
                  ৳{totalWithdrawalsApprovedAmount.toLocaleString()} ({totalWithdrawalsApprovedCount}টি)
                </span>
              </div>
              <div className="bg-amber-950/80 border border-amber-700/60 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">পেন্ডিং উইথড্র</span>
                <span className="text-xs font-black text-amber-300 font-mono">
                  ৳{totalWithdrawalsPendingAmount.toLocaleString()} ({pendingWithdraws.length}টি)
                </span>
              </div>
            </div>
          </div>

          {withdraws.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No withdrawal requests recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Payment Number</th>
                    <th className="py-2.5 px-3">Requested</th>
                    <th className="py-2.5 px-3">Net Payout</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {withdraws.map((wth) => (
                    <tr key={wth.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-200 block">{wth.userName}</span>
                        <span className="text-[10px] text-amber-400 font-mono">{wth.memberCode}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-300">{wth.gateway}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-400 font-bold">
                        {wth.recipientNumber}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        ৳{wth.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        ৳{wth.netAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          wth.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                          wth.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-amber-500/20 text-amber-400 animate-pulse'
                        }`}>
                          {wth.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {wth.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approveWithdraw(wth.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] rounded flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve & Paid
                            </button>
                            <button
                              onClick={() => rejectWithdraw(wth.id, 'Incorrect account number / limit')}
                              className="px-2 py-1 bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-800 text-[11px] rounded flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" /> Reject & Refund
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">
                            Processed: {wth.processedBy || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. MEMBERS DIRECTORY */}
      {activeAdminTab === 'members' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>মেম্বার ডিরেক্টরি ও ইউজার লিস্ট (Members Directory)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                সকল মেম্বারের প্রোফাইল, ব্যালেন্স, ডিপোজিট-উইথড্র হিস্ট্রি ও অ্যাকাউন্ট স্ট্যাটাস।
              </p>
            </div>
            {/* Quick Members Stats */}
            <div className="flex items-center gap-2">
              <div className="bg-indigo-950/80 border border-indigo-700/60 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-indigo-400 font-bold block uppercase">মোট মেম্বার</span>
                <span className="text-xs font-black text-indigo-300 font-mono">
                  {totalMembersCount} জন (সক্রিয়: {activeMembersCount})
                </span>
              </div>
              <div className="bg-purple-950/80 border border-purple-700/60 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-purple-400 font-bold block uppercase">মেম্বার ওয়ালেট মূলধন</span>
                <span className="text-xs font-black text-purple-300 font-mono">
                  ৳{totalUserWalletsBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Member ID</th>
                  <th className="py-2.5 px-3">Name & Phone</th>
                  <th className="py-2.5 px-3">Wallet Balance</th>
                  <th className="py-2.5 px-3">Deposited</th>
                  <th className="py-2.5 px-3">Withdrawn</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {regularUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">
                      {user.memberCode}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-200 block">{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{user.phone}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">
                      ৳{user.walletBalance.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      ৳{user.totalDeposited.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      ৳{user.totalWithdrawn.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {user.isBanned ? 'BANNED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openMemberDetail(user)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700 cursor-pointer"
                        >
                          Manage & Edit
                        </button>
                        <button
                          onClick={() => setMemberToDelete(user)}
                          title="Delete Member"
                          className="p-1 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/60 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. BANNED MEMBERS HUB */}
      {activeAdminTab === 'banned' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-red-400 flex items-center gap-2">
              <Ban className="w-4 h-4" />
              <span>Banned Members Hub ({bannedUsers.length})</span>
            </h3>
            <p className="text-xs text-slate-400">Members in this list are blocked from logging in or withdrawing.</p>
          </div>

          {bannedUsers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No banned members currently.
            </div>
          ) : (
            <div className="space-y-3">
              {bannedUsers.map((bUser) => (
                <div key={bUser.id} className="bg-slate-950 border border-red-900/40 p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{bUser.name}</span>
                      <span className="font-mono text-amber-400 font-bold">({bUser.memberCode})</span>
                      <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">BANNED</span>
                    </div>
                    <p className="text-slate-400 mt-1 font-mono text-[11px]">Phone: {bUser.phone} • Email: {bUser.email}</p>
                    <p className="text-red-300/90 mt-1 font-sans text-xs">Reason: {bUser.banReason || 'Rule violation'}</p>
                  </div>

                  <button
                    onClick={() => unbanMember(bUser.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Unban Member</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. PAYMENT GATEWAYS SETTINGS */}
      {activeAdminTab === 'gateways' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Official Recipient Numbers (bKash / Nagad / Rocket / mCash)</span>
            </h3>
            <p className="text-xs text-slate-400">Configure numbers shown to members during deposit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(gateways)).map((gwKey) => {
              const gw = gateways[gwKey];
              return (
                <div key={gwKey} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-100">{gw.name}</span>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={gw.isActive}
                        onChange={(e) => updateGatewayConfig(gwKey, { isActive: e.target.checked })}
                        className="accent-amber-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Official Wallet Number</label>
                    <input
                      type="text"
                      value={gw.accountNumber}
                      onChange={(e) => updateGatewayConfig(gwKey, { accountNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Deposit (৳)</label>
                      <input
                        type="number"
                        value={gw.minDeposit}
                        onChange={(e) => updateGatewayConfig(gwKey, { minDeposit: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Account Type</label>
                      <select
                        value={gw.accountType}
                        onChange={(e) => updateGatewayConfig(gwKey, { accountType: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                      >
                        <option value="Personal">Personal</option>
                        <option value="Merchant">Merchant</option>
                        <option value="Agent">Agent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Instructions</label>
                    <textarea
                      rows={2}
                      value={gw.instructions}
                      onChange={(e) => updateGatewayConfig(gwKey, { instructions: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[11px] text-slate-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. SUPPORT / COMPLAINT BOX (OBIJOGH DESK) */}
      {activeAdminTab === 'support' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Member Complaint / Obijogh Inbox ({supportTickets.length})</span>
            </h3>
          </div>

          {supportTickets.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No complaints submitted.</p>
          ) : (
            <div className="space-y-3">
              {supportTickets.map((tkt) => (
                <div key={tkt.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-100">{tkt.subject}</span>
                      <span className="text-slate-500 ml-2 font-mono">({tkt.memberCode} - {tkt.userName})</span>
                      <p className="text-[10px] text-slate-500">Category: {tkt.category.toUpperCase()} • {new Date(tkt.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tkt.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {tkt.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-300 bg-slate-900/80 p-3 rounded-lg">{tkt.message}</p>

                  {tkt.reply && (
                    <div className="bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-lg text-emerald-300">
                      <span className="font-bold block text-[10px]">Your Response:</span>
                      <span>{tkt.reply}</span>
                    </div>
                  )}

                  {/* Reply Action Form */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Type admin resolution or instructions..."
                      defaultValue={tkt.reply || ''}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          replySupportTicket(tkt.id, e.target.value.trim(), 'resolved');
                        }
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                    />
                    <button
                      onClick={(e) => {
                        const input = (e.currentTarget.previousSibling as HTMLInputElement);
                        if (input && input.value) {
                          replySupportTicket(tkt.id, input.value, 'resolved');
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Reply & Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. PASSWORD RESET REQUESTS */}
      {activeAdminTab === 'resets' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-sky-400" />
              <span>Password Reset Verification Desk</span>
            </h3>
            <span className="text-xs text-slate-400">
              When members click "Forgot Password", their security reset code arrives here.
            </span>
          </div>

          {resetRequests.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No password reset requests pending.</p>
          ) : (
            <div className="space-y-3">
              {resetRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">Phone: {req.phone}</span>
                      <span className="text-amber-400 font-mono font-bold">({req.memberCode})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400">Security Code:</span>
                      <span className="font-mono text-amber-400 font-black bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {req.resetCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => approvePasswordReset(req.id, 'user123')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Approve (Set to "user123")
                        </button>
                        <button
                          onClick={() => rejectPasswordReset(req.id)}
                          className="px-2 py-1.5 bg-slate-800 text-slate-400 hover:text-white text-xs rounded-lg"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <span className="text-emerald-400 font-bold text-[11px]">
                        ✓ Approved ({req.newPassword || 'user123'})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. MODERATOR MANAGEMENT */}
      {activeAdminTab === 'moderators' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-rose-400" />
                  <span>মডারেটর ও স্টাফ ম্যানেজমেন্ট (Moderator Task Delegation)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  অ্যাডমিন যে কোনো নির্দিষ্ট কাজ (ডিপোজিট, উইথড্র, সাপোর্ট ইত্যাদি) নির্দিষ্ট মডারেটরকে দায়িত্ব হিসেবে ভাগ করে দিতে পারবেন।
                </p>
              </div>
              <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-3 py-1 rounded-lg border border-rose-500/30">
                Active Staff: {moderatorUsers.length}
              </span>
            </div>

            <form onSubmit={handleCreateModerator} className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-200">নতুন মডারেটর যোগ করুন (Add New Moderator)</span>
                
                {/* 1-Click Role Presets */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="text-slate-500 font-bold mr-1">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setModPerms({
                      canApproveDeposits: true,
                      canApproveWithdrawals: false,
                      canManageSupport: false,
                      canManageMembers: false,
                      canAdjustWallet: false,
                      canEditGateways: false,
                      canViewAuditLogs: true,
                      canManageMaintenance: false
                    })}
                    className="px-2 py-1 bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700 text-slate-300 border border-slate-700 rounded-md cursor-pointer transition-colors"
                  >
                    ডিপোজিট ভেরিফায়ার
                  </button>
                  <button
                    type="button"
                    onClick={() => setModPerms({
                      canApproveDeposits: false,
                      canApproveWithdrawals: true,
                      canManageSupport: false,
                      canManageMembers: false,
                      canAdjustWallet: false,
                      canEditGateways: false,
                      canViewAuditLogs: true,
                      canManageMaintenance: false
                    })}
                    className="px-2 py-1 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-700 text-slate-300 border border-slate-700 rounded-md cursor-pointer transition-colors"
                  >
                    উইথড্র অফিসার
                  </button>
                  <button
                    type="button"
                    onClick={() => setModPerms({
                      canApproveDeposits: false,
                      canApproveWithdrawals: false,
                      canManageSupport: true,
                      canManageMembers: false,
                      canAdjustWallet: false,
                      canEditGateways: false,
                      canViewAuditLogs: true,
                      canManageMaintenance: false
                    })}
                    className="px-2 py-1 bg-slate-800 hover:bg-sky-950 hover:text-sky-300 hover:border-sky-700 text-slate-300 border border-slate-700 rounded-md cursor-pointer transition-colors"
                  >
                    সাপোর্ট হেল্পডেস্ক
                  </button>
                  <button
                    type="button"
                    onClick={() => setModPerms({
                      canApproveDeposits: false,
                      canApproveWithdrawals: false,
                      canManageSupport: false,
                      canManageMembers: true,
                      canAdjustWallet: true,
                      canEditGateways: false,
                      canViewAuditLogs: true,
                      canManageMaintenance: false
                    })}
                    className="px-2 py-1 bg-slate-800 hover:bg-amber-950 hover:text-amber-300 hover:border-amber-700 text-slate-300 border border-slate-700 rounded-md cursor-pointer transition-colors"
                  >
                    মেম্বার ম্যানেজার
                  </button>
                  <button
                    type="button"
                    onClick={() => setModPerms({
                      canApproveDeposits: true,
                      canApproveWithdrawals: true,
                      canManageSupport: true,
                      canManageMembers: true,
                      canAdjustWallet: true,
                      canEditGateways: true,
                      canViewAuditLogs: true,
                      canManageMaintenance: true
                    })}
                    className="px-2 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-200 border border-rose-600/50 rounded-md cursor-pointer transition-colors font-bold"
                  >
                    সব দায়িত্ব (All Tasks)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">স্টাফ নাম (Staff Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mod Shakil"
                    value={modName}
                    onChange={(e) => setModName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">ফোন নম্বর (Phone / Login ID)</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={modPhone}
                    onChange={(e) => setModPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 placeholder:text-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">ইমেইল (Email)</label>
                  <input
                    type="email"
                    required
                    placeholder="mod@microjobboss.com"
                    value={modEmail}
                    onChange={(e) => setModEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">পাসওয়ার্ড (Login Password)</label>
                  <input
                    type="text"
                    required
                    value={modPassword}
                    onChange={(e) => setModPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Granular Task Assignment Checkboxes */}
              <div>
                <p className="text-[11px] font-bold text-slate-300 mb-2">
                  মডারেটরের দায়িত্ব নির্ধারণ করুন (Admin Decides Moderator Tasks):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modPerms.canApproveDeposits ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={modPerms.canApproveDeposits}
                      onChange={(e) => setModPerms({ ...modPerms, canApproveDeposits: e.target.checked })}
                      className="mt-0.5 accent-emerald-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-200">ডিপোজিট অ্যাপ্রুভ</span>
                      <span className="text-[10px] text-slate-400">bKash/Nagad ডিপোজিট চেক ও ভেরিফাই</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modPerms.canApproveWithdrawals ? 'bg-rose-950/30 border-rose-700/60 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={modPerms.canApproveWithdrawals}
                      onChange={(e) => setModPerms({ ...modPerms, canApproveWithdrawals: e.target.checked })}
                      className="mt-0.5 accent-rose-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-200">উইথড্র অ্যাপ্রুভ</span>
                      <span className="text-[10px] text-slate-400">টাকা পাঠানো ও পেইড মার্ক করা</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modPerms.canManageSupport ? 'bg-sky-950/30 border-sky-700/60 text-sky-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={modPerms.canManageSupport}
                      onChange={(e) => setModPerms({ ...modPerms, canManageSupport: e.target.checked })}
                      className="mt-0.5 accent-sky-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-200">সাপোর্ট ও অভিযোগ</span>
                      <span className="text-[10px] text-slate-400">ইউজারদের মেসেজের রিপ্লাই দেওয়া</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modPerms.canManageMembers ? 'bg-amber-950/30 border-amber-700/60 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={modPerms.canManageMembers}
                      onChange={(e) => setModPerms({ ...modPerms, canManageMembers: e.target.checked })}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-200">মেম্বার ডিরেক্টরি</span>
                      <span className="text-[10px] text-slate-400">মেম্বার তথ্য দেখা, ব্যান ও আনব্যান</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modPerms.canAdjustWallet ? 'bg-purple-950/30 border-purple-700/60 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={modPerms.canAdjustWallet}
                      onChange={(e) => setModPerms({ ...modPerms, canAdjustWallet: e.target.checked })}
                      className="mt-0.5 accent-purple-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-200">ব্যালেন্স এডজাস্ট</span>
                      <span className="text-[10px] text-slate-400">মেম্বার ওয়ালেটে টাকা যোগ/বিয়োগ</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modPerms.canEditGateways ? 'bg-teal-950/30 border-teal-700/60 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={modPerms.canEditGateways}
                      onChange={(e) => setModPerms({ ...modPerms, canEditGateways: e.target.checked })}
                      className="mt-0.5 accent-teal-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-200">গেটওয়ে কনফিগ</span>
                      <span className="text-[10px] text-slate-400">bKash/Nagad নম্বর ও স্ট্যাটাস বদল</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modPerms.canManageMaintenance ? 'bg-orange-950/30 border-orange-700/60 text-orange-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={modPerms.canManageMaintenance}
                      onChange={(e) => setModPerms({ ...modPerms, canManageMaintenance: e.target.checked })}
                      className="mt-0.5 accent-orange-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-200">মেইনটেন্যান্স কন্ট্রোল</span>
                      <span className="text-[10px] text-slate-400">সাইট আপডেট নোটিস দেওয়া ও অন/অফ</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modPerms.canViewAuditLogs ? 'bg-indigo-950/30 border-indigo-700/60 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={modPerms.canViewAuditLogs}
                      onChange={(e) => setModPerms({ ...modPerms, canViewAuditLogs: e.target.checked })}
                      className="mt-0.5 accent-indigo-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-200">অডিট লগ</span>
                      <span className="text-[10px] text-slate-400">প্ল্যাটফর্ম অ্যাক্টিভিটি হিস্ট্রি দেখা</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Create Staff Moderator</span>
              </button>
            </form>
          </div>

          {/* Existing Moderators with Task Badges & Edit Action */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Active Moderators & Designated Tasks ({moderatorUsers.length})</span>
            </h4>
            
            {moderatorUsers.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">কোনো মডারেটর যোগ করা হয়নি। উপরের ফর্ম ব্যবহার করে মডারেটর তৈরি করুন।</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moderatorUsers.map((m) => {
                  const p = m.moderatorPermissions || {};
                  return (
                    <div key={m.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl space-y-3 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-sm">{m.name}</span>
                            <span className="font-mono text-rose-400 font-bold text-xs bg-rose-950/60 border border-rose-900/50 px-2 py-0.5 rounded">
                              {m.memberCode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-1">
                            📞 {m.phone} • ✉️ {m.email}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Password: <span className="text-slate-300 font-bold">{m.password || 'mod123'}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingModerator(m);
                              setEditModPerms(m.moderatorPermissions || {
                                canApproveDeposits: true,
                                canApproveWithdrawals: true,
                                canManageMembers: false,
                                canAdjustWallet: false,
                                canManageSupport: true,
                                canEditGateways: false,
                                canViewAuditLogs: true,
                                canManageMaintenance: false
                              });
                            }}
                            className="p-2 text-amber-400 hover:bg-amber-950/50 border border-amber-500/30 hover:border-amber-400 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                            title="Edit Tasks / Permissions"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Tasks</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteModerator(m.id)}
                            className="p-2 text-rose-400 hover:bg-rose-950/50 border border-rose-500/30 hover:border-rose-400 rounded-xl transition-colors cursor-pointer"
                            title="Delete Moderator"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Active Task Badges */}
                      <div className="pt-2 border-t border-slate-850">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">অ্যাসাইন করা দায়িত্বসমূহ (Assigned Tasks):</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.canApproveDeposits && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                              ✓ ডিপোজিট চেক
                            </span>
                          )}
                          {p.canApproveWithdrawals && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
                              ✓ উইথড্র প্রসেস
                            </span>
                          )}
                          {p.canManageSupport && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/60">
                              ✓ সাপোর্ট হেল্পডেস্ক
                            </span>
                          )}
                          {p.canManageMembers && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                              ✓ মেম্বার ম্যানেজার
                            </span>
                          )}
                          {p.canAdjustWallet && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                              ✓ ওয়ালেট এডজাস্ট
                            </span>
                          )}
                          {p.canEditGateways && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60">
                              ✓ গেটওয়ে কনফিগ
                            </span>
                          )}
                          {p.canManageMaintenance && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-800/60">
                              ✓ মেইনটেন্যান্স কন্ট্রোল
                            </span>
                          )}
                          {p.canViewAuditLogs && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                              ✓ অডিট লগ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. OVERVIEW & FINANCIAL ANALYTICS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Detailed Financial & Member Analytics Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-400" />
                  <span>প্ল্যাটফর্ম সার্বিক আর্থিক ও মেম্বার সারাংশ (Platform Analytics)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  মোট মেম্বার সংখ্যা, সর্বমোট ডিপোজিট ও উইথড্র ব্যালেন্সের রিয়েল-টাইম হিসাব।
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('deposits')}
                  className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  ডিপোজিট দেখুন ({pendingDeposits.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('withdrawals')}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-700/60 text-rose-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  উইথড্র দেখুন ({pendingWithdraws.length})
                </button>
              </div>
            </div>

            {/* Financial Flow Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>মোট ডিপোজিট (Approved Inflow)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{totalDepositsApprovedCount} Txns</span>
                </div>
                <p className="text-2xl font-black text-emerald-300 font-mono">
                  ৳{totalDepositsApprovedAmount.toLocaleString()}
                </p>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-850">
                  <span>অপেক্ষমান ডিপোজিট:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    ৳{totalDepositsPendingAmount.toLocaleString()} ({pendingDeposits.length}টি)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4" />
                    <span>মোট উইথড্র প্রদান (Paid Outflow)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{totalWithdrawalsApprovedCount} Txns</span>
                </div>
                <p className="text-2xl font-black text-rose-300 font-mono">
                  ৳{totalWithdrawalsApprovedAmount.toLocaleString()}
                </p>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-850">
                  <span>অপেক্ষমান উইথড্র:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    ৳{totalWithdrawalsPendingAmount.toLocaleString()} ({pendingWithdraws.length}টি)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>প্ল্যাটফর্ম নিট ফান্ড (Net Balance)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Inflow - Outflow</span>
                </div>
                <p className={`text-2xl font-black font-mono ${netPlatformReserve >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                  ৳{netPlatformReserve.toLocaleString()}
                </p>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-850">
                  <span>মেম্বারদের ওয়ালেট ফান্ড:</span>
                  <span className="text-purple-400 font-mono font-bold">
                    ৳{totalUserWalletsBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Gateway Wise Deposit & Withdraw Breakdown Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-300 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>পেমেন্ট মেথড অনুযায়ী ডিপোজিট ও উইথড্র হিসাব (Gateway Wise Financial Breakdown)</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">গেটওয়ে (Gateway)</th>
                      <th className="p-3 text-emerald-400">মোট ডিপোজিট হয়েছে (Approved)</th>
                      <th className="p-3 text-amber-400">পেন্ডিং ডিপোজিট</th>
                      <th className="p-3 text-rose-400">মোট উইথড্র দেওয়া হয়েছে (Paid)</th>
                      <th className="p-3 text-amber-400">পেন্ডিং উইথড্র</th>
                      <th className="p-3 text-right">নেট ক্যাশ ফ্লো</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    {(['bKash', 'Nagad', 'Rocket', 'mCash'] as GatewayType[]).map((gwName) => {
                      const stat = getGatewayFinancials(gwName);
                      const gwNet = stat.depApproved - stat.withApproved;
                      return (
                        <tr key={gwName} className="hover:bg-slate-850/60 transition-colors">
                          <td className="p-3 font-bold text-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>{gwName}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-400">
                            ৳{stat.depApproved.toLocaleString()}
                            <span className="text-[10px] text-slate-500 font-normal ml-1">({stat.depApprovedCount} টি)</span>
                          </td>
                          <td className="p-3 font-mono text-amber-400">
                            ৳{stat.depPending.toLocaleString()}
                          </td>
                          <td className="p-3 font-mono font-bold text-rose-400">
                            ৳{stat.withApproved.toLocaleString()}
                            <span className="text-[10px] text-slate-500 font-normal ml-1">({stat.withApprovedCount} টি)</span>
                          </td>
                          <td className="p-3 font-mono text-amber-400">
                            ৳{stat.withPending.toLocaleString()}
                          </td>
                          <td className={`p-3 font-mono font-black text-right ${gwNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ৳{gwNet.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-950 font-bold text-slate-200 border-t border-slate-800">
                    <tr>
                      <td className="p-3">সর্বমোট (Grand Total)</td>
                      <td className="p-3 font-mono text-emerald-400 font-black">
                        ৳{totalDepositsApprovedAmount.toLocaleString()}
                      </td>
                      <td className="p-3 font-mono text-amber-400">
                        ৳{totalDepositsPendingAmount.toLocaleString()}
                      </td>
                      <td className="p-3 font-mono text-rose-400 font-black">
                        ৳{totalWithdrawalsApprovedAmount.toLocaleString()}
                      </td>
                      <td className="p-3 font-mono text-amber-400">
                        ৳{totalWithdrawalsPendingAmount.toLocaleString()}
                      </td>
                      <td className={`p-3 font-mono font-black text-right ${netPlatformReserve >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ৳{netPlatformReserve.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Member Demographics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">মোট নিবন্ধিত মেম্বার</p>
                <p className="text-xl font-black text-indigo-400 font-mono mt-1">{totalMembersCount} জন</p>
                <p className="text-[10px] text-slate-500">সমস্ত ইউজার ও মডারেটর</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">সক্রিয় সাধারণ মেম্বার</p>
                <p className="text-xl font-black text-emerald-400 font-mono mt-1">{activeMembersCount} জন</p>
                <p className="text-[10px] text-slate-500">নিয়মিত একাউন্ট</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">ব্যানকৃত মেম্বার</p>
                <p className="text-xl font-black text-rose-400 font-mono mt-1">{bannedMembersCount} জন</p>
                <p className="text-[10px] text-slate-500">অস্থায়ী/স্থায়ী ব্যান</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">স্টাফ / মডারেটর</p>
                <p className="text-xl font-black text-amber-400 font-mono mt-1">{moderatorUsers.length} জন</p>
                <p className="text-[10px] text-slate-500">ম্যানেজমেন্ট টিম</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Live Deposit & Withdraw Feed Injector</span>
            </h3>
            <p className="text-xs text-slate-400">
              Inject or boost live activity on the public landing page live ticker bar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Type</label>
                <select
                  value={tickerType}
                  onChange={(e) => setTickerType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                >
                  <option value="deposit">Deposit (+)</option>
                  <option value="withdraw">Withdraw (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={tickerPhone}
                  onChange={(e) => setTickerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  value={tickerAmount}
                  onChange={(e) => setTickerAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Gateway</label>
                <select
                  value={tickerGateway}
                  onChange={(e) => setTickerGateway(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="mCash">mCash</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => addManualTicker(tickerType, tickerPhone, tickerAmount, tickerGateway)}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                >
                  + Add to Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. SITE SETTINGS */}
      {activeAdminTab === 'settings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Platform Configurations & Global Notice</span>
          </h3>

          {/* Maintenance Mode Detailed Config */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  <span>Site Maintenance Mode (সাইটের কাজ চলার সময় অফ/নোটিস অপশন)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  সাইটে কাজ করার সময় পুরো সাইট বন্ধ না করে ইউজারদের জন্য নোটিস মেসেজ প্রদর্শন করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextState = !settings.isMaintenanceMode;
                  updateSettings({ isMaintenanceMode: nextState });
                  toast(nextState ? 'মেইনটেন্যান্স মোড অন করা হয়েছে' : 'মেইনটেন্যান্স মোড অফ করা হয়েছে', 'info');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.isMaintenanceMode
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {settings.isMaintenanceMode ? 'Currently ON (Click to Disable)' : 'Currently OFF (Click to Enable)'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  মেইনটেন্যান্স নোটিস টেক্সট (Notice Message):
                </label>
                <textarea
                  rows={2}
                  value={settings.maintenanceNotice || ''}
                  onChange={(e) => updateSettings({ maintenanceNotice: e.target.value })}
                  placeholder="সাইটের কাজ চলতেছে, কিছুক্ষণ অপেক্ষা করুন।"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  আনুমানিক সময় (Estimated Duration):
                </label>
                <input
                  type="text"
                  value={settings.maintenanceEstimateTime || ''}
                  onChange={(e) => updateSettings({ maintenanceEstimateTime: e.target.value })}
                  placeholder="15-30 মিনিট"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-xl text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Announcement Notice Text (মারকিউ নোটিস)</label>
              <textarea
                rows={2}
                value={settings.announcementNotice}
                onChange={(e) => updateSettings({ announcementNotice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Referral Bonus Per Plan (৳) - রেফারেল বোনাস
              </label>
              <input
                type="number"
                value={settings.referralBonusPerPlan}
                onChange={(e) => updateSettings({ referralBonusPerPlan: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
              />
              <p className="text-[10px] text-amber-400 mt-1">
                ✓ বর্তমানে প্রতি প্ল্যান পার্চেসে রেফারার ৳{settings.referralBonusPerPlan} বোনাস ইনস্ট্যান্ট পাবে।
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Telegram Official Channel / Support URL</label>
              <input
                type="text"
                value={settings.telegramSupportUrl}
                onChange={(e) => updateSettings({ telegramSupportUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">WhatsApp 24/7 Helpline Support URL</label>
              <input
                type="text"
                value={settings.whatsappSupportUrl}
                onChange={(e) => updateSettings({ whatsappSupportUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: 360-DEGREE MEMBER MANAGEMENT ================= */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-100">{selectedMember.name}</h3>
                <p className="text-xs text-amber-400 font-mono">Member ID: {selectedMember.memberCode}</p>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Quick Balance Adjustment */}
            <form onSubmit={handleAdjustWalletSubmit} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-slate-200 block">Adjust Member Wallet Balance (টাকা বাড়ানো / কমানো)</span>
              
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={walletAdjustType}
                  onChange={(e) => setWalletAdjustType(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                >
                  <option value="increase">Increase (+ Credit)</option>
                  <option value="decrease">Decrease (- Debit)</option>
                </select>

                <input
                  type="number"
                  required
                  placeholder="Amount"
                  value={walletDeltaAmount}
                  onChange={(e) => setWalletDeltaAmount(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                />

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Apply Balance
                </button>
              </div>
            </form>

            {/* Edit Info Form */}
            <form onSubmit={handleEditMemberSubmit} className="space-y-3 text-xs">
              <span className="font-bold text-slate-200 block">Edit Member Details & Login Password</span>
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                />
                <input
                  type="text"
                  placeholder="Password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                />
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const m = selectedMember;
                      setSelectedMember(null);
                      setMemberToDelete(m);
                    }}
                    className="py-2 px-3 bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account</span>
                  </button>
                </div>

                {selectedMember.isBanned ? (
                  <button
                    type="button"
                    onClick={() => {
                      unbanMember(selectedMember.id);
                      setSelectedMember(null);
                    }}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg cursor-pointer"
                  >
                    Unban Member
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      banMember(selectedMember.id, banReasonInput);
                      setSelectedMember(null);
                    }}
                    className="py-2 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Ban Member
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT MODERATOR TASKS / PERMISSIONS ================= */}
      {editingModerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>মডারেটর দায়িত্ব পরিবর্তন (Update Moderator Tasks)</span>
                </h3>
                <p className="text-xs text-amber-400 font-mono mt-0.5">
                  {editingModerator.name} ({editingModerator.memberCode}) • {editingModerator.phone}
                </p>
              </div>
              <button
                onClick={() => setEditingModerator(null)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Role Preset Quick Toggles inside Modal */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-bold mr-1">দ্রুত সেট করুন:</span>
              <button
                type="button"
                onClick={() => setEditModPerms({
                  canApproveDeposits: true,
                  canApproveWithdrawals: false,
                  canManageSupport: false,
                  canManageMembers: false,
                  canAdjustWallet: false,
                  canEditGateways: false,
                  canViewAuditLogs: true,
                  canManageMaintenance: false
                })}
                className="px-2 py-1 bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 border border-slate-700 rounded cursor-pointer"
              >
                ডিপোজিট ভেরিফায়ার
              </button>
              <button
                type="button"
                onClick={() => setEditModPerms({
                  canApproveDeposits: false,
                  canApproveWithdrawals: true,
                  canManageSupport: false,
                  canManageMembers: false,
                  canAdjustWallet: false,
                  canEditGateways: false,
                  canViewAuditLogs: true,
                  canManageMaintenance: false
                })}
                className="px-2 py-1 bg-slate-900 hover:bg-rose-950 hover:text-rose-300 text-slate-300 border border-slate-700 rounded cursor-pointer"
              >
                উইথড্র অফিসার
              </button>
              <button
                type="button"
                onClick={() => setEditModPerms({
                  canApproveDeposits: false,
                  canApproveWithdrawals: false,
                  canManageSupport: true,
                  canManageMembers: false,
                  canAdjustWallet: false,
                  canEditGateways: false,
                  canViewAuditLogs: true,
                  canManageMaintenance: false
                })}
                className="px-2 py-1 bg-slate-900 hover:bg-sky-950 hover:text-sky-300 text-slate-300 border border-slate-700 rounded cursor-pointer"
              >
                সাপোর্ট হেল্পডেস্ক
              </button>
              <button
                type="button"
                onClick={() => setEditModPerms({
                  canApproveDeposits: true,
                  canApproveWithdrawals: true,
                  canManageSupport: true,
                  canManageMembers: true,
                  canAdjustWallet: true,
                  canEditGateways: true,
                  canViewAuditLogs: true,
                  canManageMaintenance: true
                })}
                className="px-2 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-200 border border-rose-600/50 rounded cursor-pointer font-bold"
              >
                সব দায়িত্ব (All Tasks)
              </button>
            </div>

            {/* Checkbox Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs max-h-72 overflow-y-auto pr-1">
              <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                editModPerms.canApproveDeposits ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={editModPerms.canApproveDeposits}
                  onChange={(e) => setEditModPerms({ ...editModPerms, canApproveDeposits: e.target.checked })}
                  className="mt-0.5 accent-emerald-500"
                />
                <div>
                  <span className="font-bold block text-slate-200">ডিপোজিট ভেরিফিকেশন ও অ্যাপ্রুভ</span>
                  <span className="text-[10px] text-slate-400">bKash/Nagad পেমেন্ট চেক ও ব্যালেন্স যোগ</span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                editModPerms.canApproveWithdrawals ? 'bg-rose-950/40 border-rose-700 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={editModPerms.canApproveWithdrawals}
                  onChange={(e) => setEditModPerms({ ...editModPerms, canApproveWithdrawals: e.target.checked })}
                  className="mt-0.5 accent-rose-500"
                />
                <div>
                  <span className="font-bold block text-slate-200">উইথড্র রিকোয়েস্ট প্রসেস</span>
                  <span className="text-[10px] text-slate-400">মেম্বারদের টাকা পাঠানো ও পেইড করা</span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                editModPerms.canManageSupport ? 'bg-sky-950/40 border-sky-700 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={editModPerms.canManageSupport}
                  onChange={(e) => setEditModPerms({ ...editModPerms, canManageSupport: e.target.checked })}
                  className="mt-0.5 accent-sky-500"
                />
                <div>
                  <span className="font-bold block text-slate-200">সাপোর্ট ও কমপ্লেন রিপ্লাই</span>
                  <span className="text-[10px] text-slate-400">ইউজারদের হেল্পডেস্ক টিকেটের উত্তর দেওয়া</span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                editModPerms.canManageMembers ? 'bg-amber-950/40 border-amber-700 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={editModPerms.canManageMembers}
                  onChange={(e) => setEditModPerms({ ...editModPerms, canManageMembers: e.target.checked })}
                  className="mt-0.5 accent-amber-500"
                />
                <div>
                  <span className="font-bold block text-slate-200">মেম্বার ডিরেক্টরি ও ব্যান</span>
                  <span className="text-[10px] text-slate-400">মেম্বার প্রোফাইল এডিট ও ব্যান/আনব্যান</span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                editModPerms.canAdjustWallet ? 'bg-purple-950/40 border-purple-700 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={editModPerms.canAdjustWallet}
                  onChange={(e) => setEditModPerms({ ...editModPerms, canAdjustWallet: e.target.checked })}
                  className="mt-0.5 accent-purple-500"
                />
                <div>
                  <span className="font-bold block text-slate-200">ব্যালেন্স এডজাস্টমেন্ট</span>
                  <span className="text-[10px] text-slate-400">মেম্বার ওয়ালেটে ম্যানুয়ালি টাকা ক্রেডিট/ডেবিট</span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                editModPerms.canEditGateways ? 'bg-teal-950/40 border-teal-700 text-teal-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={editModPerms.canEditGateways}
                  onChange={(e) => setEditModPerms({ ...editModPerms, canEditGateways: e.target.checked })}
                  className="mt-0.5 accent-teal-500"
                />
                <div>
                  <span className="font-bold block text-slate-200">পেমেন্ট গেটওয়ে সেটিংস</span>
                  <span className="text-[10px] text-slate-400">bKash/Nagad মার্চেন্ট/পার্সোনাল নম্বর বদল</span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                editModPerms.canManageMaintenance ? 'bg-orange-950/40 border-orange-700 text-orange-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={editModPerms.canManageMaintenance}
                  onChange={(e) => setEditModPerms({ ...editModPerms, canManageMaintenance: e.target.checked })}
                  className="mt-0.5 accent-orange-500"
                />
                <div>
                  <span className="font-bold block text-slate-200">মেইনটেন্যান্স কন্ট্রোল</span>
                  <span className="text-[10px] text-slate-400">সাইট মেইনটেন্যান্স অন/অফ ও নোটিস আপডেট</span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                editModPerms.canViewAuditLogs ? 'bg-indigo-950/40 border-indigo-700 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={editModPerms.canViewAuditLogs}
                  onChange={(e) => setEditModPerms({ ...editModPerms, canViewAuditLogs: e.target.checked })}
                  className="mt-0.5 accent-indigo-500"
                />
                <div>
                  <span className="font-bold block text-slate-200">অডিট হিস্ট্রি ও লগ</span>
                  <span className="text-[10px] text-slate-400">অ্যাডমিন অ্যাকশন লগ পর্যালোচনা</span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingModerator(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  updateModeratorPermissions(editingModerator.id, editModPerms);
                  setEditingModerator(null);
                }}
                className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-lg shadow-amber-500/25"
              >
                দায়িত্ব সংরক্ষণ করুন (Save Tasks)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PERMANENT DELETE CONFIRMATION ================= */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-900/60 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-slate-100">সদস্য অ্যাকাউন্ট মুছে ফেলবেন?</h3>
              <p className="text-xs text-slate-300">
                আপনি কি নিশ্চিত যে <span className="text-amber-400 font-bold font-mono">{memberToDelete.name} ({memberToDelete.memberCode})</span> এর অ্যাকাউন্ট ও যাবতীয় ডেটা স্থায়ীভাবে ডিলিট করতে চান?
              </p>
              <p className="text-[11px] text-red-400 font-semibold bg-red-950/50 border border-red-900/40 p-2.5 rounded-lg mt-2 text-left">
                ⚠️ এই অ্যাকশনটি অপরিবর্তনযোগ্য। ইউজারের ওয়ালেট ব্যালেন্স, মাইনিং প্ল্যান ও ট্রানজেকশন হিস্ট্রি স্থায়ীভাবে মুছে যাবে।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteMember(memberToDelete.id);
                  setMemberToDelete(null);
                }}
                className="py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, ডিলিট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
