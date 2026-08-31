import React, { useState } from 'react';
import { 
  Zap, 
  Shield, 
  User as UserIcon, 
  Wallet, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Bell,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    currentPortal, 
    setCurrentPortal, 
    currentUser, 
    currentAdmin, 
    logoutUser, 
    logoutAdmin,
    setIsAuthModalOpen, 
    setAuthModalMode,
    setActiveUserTab,
    setActiveAdminTab,
    settings,
    resetRequests,
    supportTickets,
    deposits,
    withdraws
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pendingDepositsCount = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawsCount = withdraws.filter(w => w.status === 'pending').length;
  const pendingResetsCount = resetRequests.filter(r => r.status === 'pending').length;
  const openTicketsCount = supportTickets.filter(t => t.status === 'open').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 px-4 py-1.5 text-xs text-slate-950 font-bold flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">Live</span>
          <span className="truncate">{settings.announcementNotice}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <a 
            href={settings.telegramSupportUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline flex items-center gap-1 font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" /> 24/7 Helpline
          </a>
          <span className="opacity-60">|</span>
          <span className="text-[11px] bg-slate-950/20 px-2 py-0.5 rounded font-mono">12% ROI / Day</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Portal Switch */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setCurrentPortal('user');
              setActiveUserTab('dashboard');
            }}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-rose-400 bg-clip-text text-transparent">
                  MICROJOBBOSS
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">12% Daily Mining & Multi-Gateway Platform</p>
            </div>
          </button>

          {/* Dedicated URL simulation badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-400 font-mono">
            <span className="text-emerald-400">●</span>
            <span>{currentPortal === 'user' ? 'microjobboss.com' : 'microjobboss.com.admin'}</span>
          </div>
        </div>

        {/* Portal Switcher & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dual Portal Switcher - ONLY visible to authenticated Admins/Moderators */}
          {currentAdmin && (
            <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-xl flex items-center">
              <button
                onClick={() => setCurrentPortal('user')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentPortal === 'user'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>User Portal</span>
              </button>
              <button
                onClick={() => setCurrentPortal('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                  currentPortal === 'admin'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Desk</span>
                {(pendingDepositsCount > 0 || pendingWithdrawsCount > 0 || pendingResetsCount > 0) && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
                )}
              </button>
            </div>
          )}

          {/* User Auth State & Actions */}
          {currentPortal === 'user' ? (
            currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 transition-colors"
                >
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-amber-400">৳{currentUser.walletBalance.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">{currentUser.memberCode}</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="font-bold text-sm text-slate-100">{currentUser.name}</p>
                      <p className="text-xs text-amber-400 font-mono">ID: {currentUser.memberCode}</p>
                      <p className="text-xs text-slate-400">{currentUser.phone}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveUserTab('wallet');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span>Deposit & Withdraw</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveUserTab('referrals');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Referral Link (৳50 Bonus)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveUserTab('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <UserIcon className="w-4 h-4 text-sky-400" />
                      <span>My Profile</span>
                    </button>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )
          ) : (
            // Admin portal header badge
            currentAdmin ? (
              <div className="flex items-center gap-2">
                <div className="bg-rose-950/60 border border-rose-800/60 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-300 block">{currentAdmin.name}</span>
                    <span className="text-[10px] text-rose-400 uppercase tracking-wider">{currentAdmin.role}</span>
                  </div>
                </div>
                <button
                  onClick={logoutAdmin}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('admin_login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-600/30"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
