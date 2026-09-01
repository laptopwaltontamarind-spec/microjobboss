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
  LogOut
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
    canViewAuditLogs: true
  });

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

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Total Members</p>
          <p className="text-xl font-black text-slate-100 font-mono mt-1">{users.length}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Pending Deposits</p>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">{pendingDeposits.length}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Pending Withdraws</p>
          <p className="text-xl font-black text-rose-400 font-mono mt-1">{pendingWithdraws.length}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Reset Codes</p>
          <p className="text-xl font-black text-sky-400 font-mono mt-1">{pendingResets.length}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Open Tickets</p>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">{openTickets.length}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Banned Users</p>
          <p className="text-xl font-black text-red-500 font-mono mt-1">{bannedUsers.length}</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview & Tickers', icon: Flame },
          { id: 'deposits', label: `Deposits (${pendingDeposits.length})`, icon: ArrowDownLeft },
          { id: 'withdrawals', label: `Withdrawals (${pendingWithdraws.length})`, icon: ArrowUpRight },
          { id: 'members', label: 'Members Directory', icon: Users },
          { id: 'banned', label: `Banned Hub (${bannedUsers.length})`, icon: Ban },
          { id: 'gateways', label: 'Gateways (bKash/Nagad)', icon: CreditCard },
          { id: 'support', label: `Support Box (${openTickets.length})`, icon: MessageSquare },
          { id: 'resets', label: `Reset Codes (${pendingResets.length})`, icon: KeyRound },
          { id: 'moderators', label: 'Moderators & Staff', icon: UserPlus },
          { id: 'settings', label: 'Site Settings', icon: Sliders }
        ].map((tab) => {
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
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <span>bKash / Nagad / Rocket / mCash Deposit Approvals</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Pending: {pendingDeposits.length}
            </span>
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
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
              <span>Member Cashout & Withdrawal Queue</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Pending: {pendingWithdraws.length}
            </span>
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
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Full Members Directory ({regularUsers.length})</span>
            </h3>
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
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-rose-400" />
              <span>Create New Staff Moderator</span>
            </h3>

            <form onSubmit={handleCreateModerator} className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Staff Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mod Shakil"
                    value={modName}
                    onChange={(e) => setModName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={modPhone}
                    onChange={(e) => setModPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="mod@microjobboss.com"
                    value={modEmail}
                    onChange={(e) => setModEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={modPassword}
                    onChange={(e) => setModPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              {/* Granular Permission Toggles */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-2">Granular Role Permissions (একক বাটন কন্ট্রোল):</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={modPerms.canApproveDeposits}
                      onChange={(e) => setModPerms({ ...modPerms, canApproveDeposits: e.target.checked })}
                      className="accent-rose-500"
                    />
                    <span>Approve Deposits</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={modPerms.canApproveWithdrawals}
                      onChange={(e) => setModPerms({ ...modPerms, canApproveWithdrawals: e.target.checked })}
                      className="accent-rose-500"
                    />
                    <span>Approve Withdrawals</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={modPerms.canManageSupport}
                      onChange={(e) => setModPerms({ ...modPerms, canManageSupport: e.target.checked })}
                      className="accent-rose-500"
                    />
                    <span>Support / Complaint Desk</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={modPerms.canManageMembers}
                      onChange={(e) => setModPerms({ ...modPerms, canManageMembers: e.target.checked })}
                      className="accent-rose-500"
                    />
                    <span>Member Manager</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                + Add Staff Moderator
              </button>
            </form>
          </div>

          {/* Existing Moderators */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h4 className="font-bold text-xs text-slate-200">Active Moderators ({moderatorUsers.length})</h4>
            <div className="space-y-2">
              {moderatorUsers.map((m) => (
                <div key={m.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-100">{m.name}</span>
                    <span className="font-mono text-rose-400 font-bold ml-2">({m.memberCode})</span>
                    <p className="text-[10px] text-slate-500">{m.email} • {m.phone}</p>
                  </div>
                  <button
                    onClick={() => deleteModerator(m.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. OVERVIEW & LIVE TICKER CONTROLS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
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
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Platform Configurations & Global Notice</span>
          </h3>

          <div className="space-y-3 max-w-xl text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Announcement Notice Text</label>
              <textarea
                rows={2}
                value={settings.announcementNotice}
                onChange={(e) => updateSettings({ announcementNotice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Referral Bonus Per Plan (৳)</label>
              <input
                type="number"
                value={settings.referralBonusPerPlan}
                onChange={(e) => updateSettings({ referralBonusPerPlan: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Telegram Support URL</label>
              <input
                type="text"
                value={settings.telegramSupportUrl}
                onChange={(e) => updateSettings({ telegramSupportUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">WhatsApp Support URL</label>
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
