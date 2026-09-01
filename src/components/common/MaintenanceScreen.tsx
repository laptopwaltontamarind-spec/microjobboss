import React from 'react';
import { 
  Wrench, 
  Clock, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  RefreshCw,
  Zap,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MaintenanceScreen: React.FC = () => {
  const { settings, setIsAuthModalOpen, setAuthModalMode, currentAdmin, setCurrentPortal } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Zap className="w-5 h-5 text-slate-950 font-black fill-slate-950" />
          </div>
          <span className="font-black text-2xl tracking-wider text-slate-100">MICROJOBBOSS</span>
        </div>

        {/* Main Maintenance Box */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6 text-center">
          {/* Animated Status Pill */}
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>সিস্টেম আপডেট ও সার্ভার মেইনটেন্যান্স চলমান</span>
          </div>

          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Wrench className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              সাইটের কাজ চলতেছে, কিছুক্ষণ অপেক্ষা করুন
            </h1>
            
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              <p className="text-amber-200/90">
                {settings.maintenanceNotice || 'সাইটের সিস্টেম আপডেট ও সার্ভার মেইনটেন্যান্স এর কাজ চলতেছে, কিছুক্ষণ অপেক্ষা করুন। খুব শীঘ্রই সাইট পুনরায় সচল হবে।'}
              </p>
            </div>
          </div>

          {/* Time Estimate Badge */}
          {settings.maintenanceEstimateTime && (
            <div className="inline-flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>আনুমানিক সময়: <strong className="text-amber-400 font-bold">{settings.maintenanceEstimateTime}</strong></span>
            </div>
          )}

          {/* User Assurance / Support Links */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <p className="text-xs text-slate-400">
              জরুরি প্রয়োজনে বা লাইভ আপডেটের জন্য আমাদের অফিশিয়াল চ্যানেলে যুক্ত থাকুন:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={settings.telegramSupportUrl || 'https://t.me/microjobboss_official'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-950 border border-sky-500/30 hover:border-sky-400 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold text-sky-300 hover:text-sky-200 transition-all shadow-sm"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram Channel Join</span>
              </a>

              <a
                href={settings.whatsappSupportUrl || 'https://wa.me/8801700000000'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp 24/7 Helpline</span>
              </a>
            </div>
          </div>

          {/* Auto Refresh Trigger */}
          <div className="flex items-center justify-center pt-1">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors py-1 px-3 rounded-lg hover:bg-slate-800/50 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>পেজ রিফ্রেশ করুন (Refresh Page)</span>
            </button>
          </div>
        </div>

        {/* Footer with subtle Admin / Staff Login trigger */}
        <div className="flex items-center justify-between px-3 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} MICROJOBBOSS. All Rights Reserved.</span>

          {currentAdmin ? (
            <button
              onClick={() => setCurrentPortal('admin')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Back to Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('admin_login');
                setIsAuthModalOpen(true);
              }}
              className="hover:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
