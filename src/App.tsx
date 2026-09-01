import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { LiveTickerBar } from './components/common/LiveTickerBar';
import { LandingPage } from './components/landing/LandingPage';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';
import { MaintenanceScreen } from './components/common/MaintenanceScreen';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentPortal, 
    setCurrentPortal,
    currentUser, 
    currentAdmin,
    settings,
    toastMessage, 
    setAuthModalMode, 
    setIsAuthModalOpen 
  } = useApp();

  // Listen for admin entry via URL Hash (#admin or #microjobboss.com.admin) and Keyboard Shortcut (Alt+A or Ctrl+Shift+A)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#admin-login' || hash.includes('admin')) {
        if (currentAdmin) {
          setCurrentPortal('admin');
        } else {
          setAuthModalMode('admin_login');
          setIsAuthModalOpen(true);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (currentAdmin) {
          setCurrentPortal('admin');
        } else {
          setAuthModalMode('admin_login');
          setIsAuthModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentAdmin, setCurrentPortal, setAuthModalMode, setIsAuthModalOpen]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-xs font-semibold max-w-sm ${
            toastMessage.type === 'success' ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200' :
            toastMessage.type === 'error' ? 'bg-rose-950/90 border-rose-700/80 text-rose-200' :
            'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />}
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Main Global Header (Hidden in Admin Portal) */}
      {!(currentPortal === 'admin' && currentAdmin) && <Header />}

      {/* Real-time Live Payouts Ticker Bar (Hidden in Admin Portal & Maintenance) */}
      {!(currentPortal === 'admin' && currentAdmin) && !settings.isMaintenanceMode && <LiveTickerBar />}

      {/* View Switcher: Maintenance Mode vs User Portal vs Admin Portal (Strictly Admin only) */}
      <main className="flex-1">
        {currentPortal === 'admin' && currentAdmin ? (
          <AdminPortal />
        ) : settings.isMaintenanceMode ? (
          <MaintenanceScreen />
        ) : (
          currentUser ? <UserDashboard /> : <LandingPage />
        )}
      </main>

      {/* Global Authentication & Password Reset Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
