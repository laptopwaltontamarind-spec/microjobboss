import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  MiningPlan, 
  UserInvestment, 
  DepositTransaction, 
  WithdrawTransaction, 
  WalletAuditLog, 
  SupportTicket, 
  PasswordResetRequest, 
  GatewayConfigItem, 
  LiveTickerItem, 
  PlatformSettings,
  GatewayType
} from '../types';
import { 
  DEFAULT_USERS, 
  DEFAULT_MINING_PLANS, 
  DEFAULT_GATEWAYS, 
  DEFAULT_INVESTMENTS, 
  DEFAULT_DEPOSITS, 
  DEFAULT_WITHDRAWS, 
  DEFAULT_AUDIT_LOGS, 
  DEFAULT_TICKERS, 
  DEFAULT_SUPPORT_TICKETS, 
  DEFAULT_RESET_REQUESTS, 
  DEFAULT_SETTINGS 
} from '../data/initialData';

interface AppContextType {
  // Navigation & Portal View
  currentPortal: 'user' | 'admin';
  setCurrentPortal: (portal: 'user' | 'admin') => void;
  activeUserTab: 'dashboard' | 'plans' | 'wallet' | 'history' | 'support' | 'profile' | 'referrals';
  setActiveUserTab: (tab: 'dashboard' | 'plans' | 'wallet' | 'history' | 'support' | 'profile' | 'referrals') => void;
  activeAdminTab: 'overview' | 'members' | 'banned' | 'deposits' | 'withdrawals' | 'gateways' | 'support' | 'resets' | 'moderators' | 'settings';
  setActiveAdminTab: (tab: 'overview' | 'members' | 'banned' | 'deposits' | 'withdrawals' | 'gateways' | 'support' | 'resets' | 'moderators' | 'settings') => void;
  
  // Auth
  currentUser: User | null;
  currentAdmin: User | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot' | 'admin_login';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot' | 'admin_login') => void;
  loginUser: (identifier: string, pass: string) => { success: boolean; message: string };
  registerUser: (name: string, phone: string, email: string, pass: string, refCode?: string) => { success: boolean; message: string };
  logoutUser: () => void;
  loginAdmin: (identifier: string, pass: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  requestPasswordReset: (phoneOrEmail: string) => { success: boolean; message: string; code?: string };
  
  // Data Lists
  users: User[];
  miningPlans: MiningPlan[];
  investments: UserInvestment[];
  deposits: DepositTransaction[];
  withdraws: WithdrawTransaction[];
  auditLogs: WalletAuditLog[];
  supportTickets: SupportTicket[];
  resetRequests: PasswordResetRequest[];
  gateways: Record<string, GatewayConfigItem>;
  liveTickers: LiveTickerItem[];
  settings: PlatformSettings;

  // Mining & User Actions
  buyMiningPlan: (planId: string, amount: number) => { success: boolean; message: string };
  claimMiningReward: (investmentId: string) => { success: boolean; message: string; earned?: number };
  submitDeposit: (gateway: GatewayType, senderNumber: string, amount: number, trxId: string) => { success: boolean; message: string };
  submitWithdraw: (gateway: GatewayType, recipientNumber: string, amount: number) => { success: boolean; message: string };
  createSupportTicket: (subject: string, category: SupportTicket['category'], message: string) => { success: boolean; message: string };
  updateUserProfile: (name: string, email: string, phone: string, newPassword?: string) => { success: boolean; message: string };

  // Admin Controls
  approveDeposit: (depositId: string) => void;
  rejectDeposit: (depositId: string, reason: string) => void;
  approveWithdraw: (withdrawId: string) => void;
  rejectWithdraw: (withdrawId: string, reason: string) => void;
  adjustMemberWallet: (userId: string, deltaAmount: number, reason: string) => void;
  banMember: (userId: string, reason: string) => void;
  unbanMember: (userId: string) => void;
  editMemberDetails: (userId: string, updates: Partial<User>) => void;
  updateGatewayConfig: (gatewayKey: string, config: Partial<GatewayConfigItem>) => void;
  replySupportTicket: (ticketId: string, reply: string, status: SupportTicket['status']) => void;
  approvePasswordReset: (requestId: string, newTemporaryPassword?: string) => void;
  rejectPasswordReset: (requestId: string) => void;
  addModerator: (name: string, phone: string, email: string, pass: string, permissions: User['moderatorPermissions']) => void;
  updateModeratorPermissions: (userId: string, permissions: User['moderatorPermissions']) => void;
  deleteModerator: (userId: string) => void;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  addManualTicker: (type: 'deposit' | 'withdraw', phone: string, amount: number, gateway: GatewayType) => void;
  
  // Helpers
  userInvestments: UserInvestment[];
  userDeposits: DepositTransaction[];
  userWithdraws: WithdrawTransaction[];
  userAuditLogs: WalletAuditLog[];
  userTickets: SupportTicket[];
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  toastMessage: { msg: string; type: 'success' | 'error' | 'info' } | null;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USERS: 'mjb_live_v5_users',
  INVESTMENTS: 'mjb_live_v5_investments',
  DEPOSITS: 'mjb_live_v5_deposits',
  WITHDRAWS: 'mjb_live_v5_withdraws',
  AUDIT_LOGS: 'mjb_live_v5_audit_logs',
  SUPPORT: 'mjb_live_v5_support',
  RESETS: 'mjb_live_v5_resets',
  GATEWAYS: 'mjb_live_v5_gateways',
  TICKERS: 'mjb_live_v5_tickers',
  SETTINGS: 'mjb_live_v5_settings',
  CURRENT_USER_ID: 'mjb_live_v5_current_user_id',
  CURRENT_ADMIN_ID: 'mjb_live_v5_current_admin_id',
  PORTAL: 'mjb_live_v5_portal'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPortal, setCurrentPortal] = useState<'user' | 'admin'>(() => {
    if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
      return 'admin';
    }
    return 'user';
  });

  const [activeUserTab, setActiveUserTab] = useState<'dashboard' | 'plans' | 'wallet' | 'history' | 'support' | 'profile' | 'referrals'>('dashboard');
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'members' | 'banned' | 'deposits' | 'withdrawals' | 'gateways' | 'support' | 'resets' | 'moderators' | 'settings'>('overview');

  // Auth UI
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'admin_login'>('login');
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const toast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // State Entities
  const [users, setUsers] = useState<User[]>(() => {
    const stored = getStorage<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
    // Ensure Super Admin always exists with the latest configured credentials
    const adminIndex = stored.findIndex(u => u.role === 'admin' || u.email.toLowerCase() === 'adminshykot@gmail.com');
    if (adminIndex === -1) {
      return [...DEFAULT_USERS, ...stored];
    } else {
      // Sync admin credentials
      const updated = [...stored];
      updated[adminIndex] = {
        ...updated[adminIndex],
        email: 'adminSHYKOT@gmail.com',
        password: 'adminSHYKOT',
        name: 'Super Admin Shykot'
      };
      return updated;
    }
  });

  const [miningPlans] = useState<MiningPlan[]>(DEFAULT_MINING_PLANS);
  const [investments, setInvestments] = useState<UserInvestment[]>(() => getStorage<UserInvestment[]>(STORAGE_KEYS.INVESTMENTS, DEFAULT_INVESTMENTS));
  const [deposits, setDeposits] = useState<DepositTransaction[]>(() => getStorage<DepositTransaction[]>(STORAGE_KEYS.DEPOSITS, DEFAULT_DEPOSITS));
  const [withdraws, setWithdraws] = useState<WithdrawTransaction[]>(() => getStorage<WithdrawTransaction[]>(STORAGE_KEYS.WITHDRAWS, DEFAULT_WITHDRAWS));
  const [auditLogs, setAuditLogs] = useState<WalletAuditLog[]>(() => getStorage<WalletAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS));
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => getStorage<SupportTicket[]>(STORAGE_KEYS.SUPPORT, DEFAULT_SUPPORT_TICKETS));
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>(() => getStorage<PasswordResetRequest[]>(STORAGE_KEYS.RESETS, DEFAULT_RESET_REQUESTS));
  const [gateways, setGateways] = useState<Record<string, GatewayConfigItem>>(() => getStorage<Record<string, GatewayConfigItem>>(STORAGE_KEYS.GATEWAYS, DEFAULT_GATEWAYS));
  const [liveTickers, setLiveTickers] = useState<LiveTickerItem[]>(() => getStorage<LiveTickerItem[]>(STORAGE_KEYS.TICKERS, DEFAULT_TICKERS));
  const [settings, setSettings] = useState<PlatformSettings>(() => getStorage<PlatformSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));

  // Current Logged-in Entities (Clean start for live site: no auto-login to demo users)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => getStorage<string | null>(STORAGE_KEYS.CURRENT_USER_ID, null));
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(() => getStorage<string | null>(STORAGE_KEYS.CURRENT_ADMIN_ID, null));

  // Sync to local storage
  useEffect(() => { setStorage(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => { setStorage(STORAGE_KEYS.INVESTMENTS, investments); }, [investments]);
  useEffect(() => { setStorage(STORAGE_KEYS.DEPOSITS, deposits); }, [deposits]);
  useEffect(() => { setStorage(STORAGE_KEYS.WITHDRAWS, withdraws); }, [withdraws]);
  useEffect(() => { setStorage(STORAGE_KEYS.AUDIT_LOGS, auditLogs); }, [auditLogs]);
  useEffect(() => { setStorage(STORAGE_KEYS.SUPPORT, supportTickets); }, [supportTickets]);
  useEffect(() => { setStorage(STORAGE_KEYS.RESETS, resetRequests); }, [resetRequests]);
  useEffect(() => { setStorage(STORAGE_KEYS.GATEWAYS, gateways); }, [gateways]);
  useEffect(() => { setStorage(STORAGE_KEYS.TICKERS, liveTickers); }, [liveTickers]);
  useEffect(() => { setStorage(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setStorage(STORAGE_KEYS.PORTAL, currentPortal); }, [currentPortal]);
  useEffect(() => { setStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUserId); }, [currentUserId]);
  useEffect(() => { setStorage(STORAGE_KEYS.CURRENT_ADMIN_ID, currentAdminId); }, [currentAdminId]);

  // Derived current active entities
  const currentUser = users.find(u => u.id === currentUserId) || null;
  const currentAdmin = users.find(u => u.id === currentAdminId && (u.role === 'admin' || u.role === 'moderator')) || null;

  // Filtered for current user
  const userInvestments = currentUser ? investments.filter(i => i.userId === currentUser.id) : [];
  const userDeposits = currentUser ? deposits.filter(d => d.userId === currentUser.id) : [];
  const userWithdraws = currentUser ? withdraws.filter(w => w.userId === currentUser.id) : [];
  const userAuditLogs = currentUser ? auditLogs.filter(a => a.userId === currentUser.id) : [];
  const userTickets = currentUser ? supportTickets.filter(s => s.userId === currentUser.id) : [];

  // Live ticker generator interval (adds realistic activity every 35 seconds if live)
  useEffect(() => {
    const timer = setInterval(() => {
      const gatewaysList: GatewayType[] = ['bKash', 'Nagad', 'Rocket', 'mCash'];
      const randomGateway = gatewaysList[Math.floor(Math.random() * gatewaysList.length)];
      const isDeposit = Math.random() > 0.4;
      const prefixes = ['017', '018', '019', '016', '013', '014'];
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const maskedPhone = `${randomPrefix}****${randomSuffix}`;
      const amount = isDeposit 
        ? [500, 1000, 2000, 3500, 5000, 10000, 25000][Math.floor(Math.random() * 7)]
        : [300, 600, 1200, 2400, 4800, 8500][Math.floor(Math.random() * 6)];

      const newItem: LiveTickerItem = {
        id: 'tk_' + Date.now(),
        type: isDeposit ? 'deposit' : 'withdraw',
        userMask: maskedPhone,
        amount,
        gateway: randomGateway,
        timeAgo: 'Just now',
        timestamp: Date.now()
      };

      setLiveTickers(prev => [newItem, ...prev.slice(0, 19)]);
    }, 28000);

    return () => clearInterval(timer);
  }, []);

  // Auth Operations
  const loginUser = (identifier: string, pass: string) => {
    const trimmed = identifier.trim().toLowerCase();
    const user = users.find(u => 
      (u.phone === identifier.trim() || 
       u.email.toLowerCase() === trimmed || 
       u.memberCode.toLowerCase() === trimmed) && 
      u.password === pass
    );

    if (!user) {
      return { success: false, message: 'Invalid phone/email/member ID or password.' };
    }

    if (user.isBanned) {
      return { 
        success: false, 
        message: `Your account has been BANNED by Admin. Reason: ${user.banReason || 'Policy violation'}. Contact support.` 
      };
    }

    setCurrentUserId(user.id);
    setIsAuthModalOpen(false);
    toast(`Welcome back, ${user.name}!`, 'success');
    return { success: true, message: 'Login successful' };
  };

  const registerUser = (name: string, phone: string, email: string, pass: string, refCode?: string) => {
    if (!name.trim() || !phone.trim() || !email.trim() || !pass.trim()) {
      return { success: false, message: 'Please fill in all registration fields.' };
    }

    // Check duplicate phone or email
    const exists = users.some(u => u.phone === phone.trim() || u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      return { success: false, message: 'A user with this phone number or email already exists.' };
    }

    // Generate unique member code (e.g. micr879F70)
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const memberCode = `micr${randomNum}${randomHex}`;

    // Verify referrer
    let validReferrer: User | undefined;
    if (refCode && refCode.trim()) {
      validReferrer = users.find(u => 
        u.referralCode.toLowerCase() === refCode.trim().toLowerCase() ||
        u.memberCode.toLowerCase() === refCode.trim().toLowerCase()
      );
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      memberCode,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password: pass,
      walletBalance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalMiningEarned: 0,
      referralCode: memberCode,
      referredBy: validReferrer ? validReferrer.memberCode : undefined,
      referralCount: 0,
      referralEarnings: 0,
      isBanned: false,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);

    // If referred, update referrer's count
    if (validReferrer) {
      setUsers(prev => prev.map(u => {
        if (u.id === validReferrer?.id) {
          return { ...u, referralCount: u.referralCount + 1 };
        }
        return u;
      }));
    }

    // Update settings total members count
    setSettings(prev => ({ ...prev, totalMembersCount: prev.totalMembersCount + 1 }));

    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    toast(`Registration successful! Your Member ID is ${memberCode}`, 'success');
    return { success: true, message: 'Account created successfully' };
  };

  const logoutUser = () => {
    setCurrentUserId(null);
    toast('Logged out successfully', 'info');
  };

  const loginAdmin = (identifier: string, pass: string) => {
    const trimmed = identifier.trim().toLowerCase();
    const adminUser = users.find(u => 
      (u.email.toLowerCase() === trimmed || 
       u.phone === identifier.trim() || 
       u.memberCode.toLowerCase() === trimmed) && 
      (u.role === 'admin' || u.role === 'moderator') &&
      u.password === pass
    );

    if (!adminUser) {
      return { success: false, message: 'Invalid Admin/Moderator credentials.' };
    }

    if (adminUser.isBanned) {
      return { success: false, message: 'Admin account is disabled.' };
    }

    setCurrentAdminId(adminUser.id);
    setIsAuthModalOpen(false);
    toast(`Authenticated as ${adminUser.role.toUpperCase()}: ${adminUser.name}`, 'success');
    return { success: true, message: 'Admin logged in' };
  };

  const logoutAdmin = () => {
    setCurrentAdminId(null);
    toast('Admin session ended', 'info');
  };

  const requestPasswordReset = (phoneOrEmail: string) => {
    const input = phoneOrEmail.trim().toLowerCase();
    const user = users.find(u => u.phone === phoneOrEmail.trim() || u.email.toLowerCase() === input || u.memberCode.toLowerCase() === input);
    
    const resetCode = 'RESET-' + Math.floor(1000 + Math.random() * 9000);
    const newReq: PasswordResetRequest = {
      id: 'rst_' + Date.now(),
      userId: user?.id,
      memberCode: user?.memberCode || 'UNKNOWN',
      phone: user?.phone || phoneOrEmail.trim(),
      email: user?.email,
      resetCode,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    setResetRequests(prev => [newReq, ...prev]);
    return { 
      success: true, 
      message: `Password reset request submitted! Verification Code (${resetCode}) sent to Admin dashboard. Admin will verify and approve your new password.`,
      code: resetCode
    };
  };

  // Mining & Investment Action
  const buyMiningPlan = (planId: string, amount: number) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      setAuthModalMode('login');
      return { success: false, message: 'Please login to buy a mining plan.' };
    }

    if (currentUser.isBanned) {
      return { success: false, message: 'Account is banned.' };
    }

    const plan = miningPlans.find(p => p.id === planId) || miningPlans[0];
    if (amount < plan.minDeposit || amount > plan.maxDeposit) {
      return { 
        success: false, 
        message: `Investment amount must be between ৳${plan.minDeposit.toLocaleString()} and ৳${plan.maxDeposit.toLocaleString()}` 
      };
    }

    if (currentUser.walletBalance < amount) {
      return { 
        success: false, 
        message: `Insufficient wallet balance (৳${currentUser.walletBalance.toLocaleString()}). Please deposit via bKash, Nagad, Rocket or mCash first.` 
      };
    }

    const dailyReturnAmount = Math.round((amount * (plan.dailyRoiPercent / 100)) * 100) / 100;
    const totalExpectedReturn = dailyReturnAmount * plan.durationDays;
    const now = new Date();
    const endDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    const nextClaimDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newInvestment: UserInvestment = {
      id: 'inv_' + Date.now(),
      userId: currentUser.id,
      planName: plan.name,
      investedAmount: amount,
      dailyRoiPercent: plan.dailyRoiPercent,
      dailyReturnAmount,
      totalExpectedReturn,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      lastClaimDate: now.toISOString(),
      nextClaimDate: nextClaimDate.toISOString(),
      totalClaimed: 0,
      daysRemaining: plan.durationDays,
      status: 'active'
    };

    // Deduct user balance & record audit log
    const balanceBefore = currentUser.walletBalance;
    const balanceAfter = balanceBefore - amount;

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          walletBalance: balanceAfter
        };
      }
      return u;
    }));

    setInvestments(prev => [newInvestment, ...prev]);

    // Audit log for purchase
    const purchaseAudit: WalletAuditLog = {
      id: 'aud_' + Date.now(),
      userId: currentUser.id,
      memberCode: currentUser.memberCode,
      type: 'plan_purchase',
      title: `Plan Purchase: ${plan.name}`,
      amount,
      isCredit: false,
      balanceBefore,
      balanceAfter,
      description: `Locked ৳${amount.toLocaleString()} for 30 days @ 12% daily ROI`,
      timestamp: now.toISOString()
    };
    setAuditLogs(prev => [purchaseAudit, ...prev]);

    // MLM Referral ৳50 bonus distribution
    if (currentUser.referredBy) {
      const referrer = users.find(u => u.memberCode === currentUser.referredBy || u.referralCode === currentUser.referredBy);
      if (referrer) {
        const bonusAmount = settings.referralBonusPerPlan || 50;
        setUsers(prev => prev.map(u => {
          if (u.id === referrer.id) {
            return {
              ...u,
              walletBalance: u.walletBalance + bonusAmount,
              referralEarnings: u.referralEarnings + bonusAmount
            };
          }
          return u;
        }));

        const refAudit: WalletAuditLog = {
          id: 'aud_ref_' + Date.now(),
          userId: referrer.id,
          memberCode: referrer.memberCode,
          type: 'referral_bonus',
          title: `Referral Bonus (৳${bonusAmount})`,
          amount: bonusAmount,
          isCredit: true,
          balanceBefore: referrer.walletBalance,
          balanceAfter: referrer.walletBalance + bonusAmount,
          description: `Direct ৳${bonusAmount} reward from downline ${currentUser.memberCode} plan activation`,
          timestamp: new Date().toISOString()
        };
        setAuditLogs(prev => [refAudit, ...prev]);
      }
    }

    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    toast(`Successfully purchased ${plan.name} for ৳${amount.toLocaleString()}! 24-hour mining hash power activated.`, 'success');
    return { success: true, message: 'Plan purchased successfully' };
  };

  // Claim 24-hour mining reward (STRICT 24-HOUR ENFORCEMENT)
  const claimMiningReward = (investmentId: string) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    const inv = investments.find(i => i.id === investmentId && i.userId === currentUser.id);
    if (!inv || inv.status !== 'active') {
      return { success: false, message: 'Active investment not found.' };
    }

    if (inv.daysRemaining <= 0 || inv.totalClaimed >= inv.totalExpectedReturn) {
      return { success: false, message: 'This 30-day mining contract has already finished.' };
    }

    const now = Date.now();
    
    // Strict 24h verification: nextClaimDate or (lastClaimDate + 24 hours)
    let nextClaimTimestamp = inv.nextClaimDate ? new Date(inv.nextClaimDate).getTime() : 0;
    if (!nextClaimTimestamp || isNaN(nextClaimTimestamp)) {
      const lastClaimTime = inv.lastClaimDate ? new Date(inv.lastClaimDate).getTime() : new Date(inv.startDate).getTime();
      nextClaimTimestamp = lastClaimTime + 24 * 60 * 60 * 1000;
    }

    if (now < nextClaimTimestamp) {
      const remainingMs = nextClaimTimestamp - now;
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
      
      const timeStr = `${hours}h ${minutes}m ${seconds}s`;
      toast(`২৪ ঘণ্টা পূর্ণ হওয়ার আগে ক্লেইম করা সম্ভব নয়! পরবর্তী প্রফিট ক্লেইম করতে আরও ${timeStr} অপেক্ষা করুন।`, 'error');
      return { 
        success: false, 
        message: `Claim locked! Next 12% mining profit can be claimed in ${timeStr}.` 
      };
    }

    const earned = inv.dailyReturnAmount;
    const nextCycleTime = new Date(now + 24 * 60 * 60 * 1000).toISOString();

    // Update investment: subtract 1 day, add earned amount, advance cooldown by 24h
    setInvestments(prev => prev.map(i => {
      if (i.id === investmentId) {
        const newTotalClaimed = i.totalClaimed + earned;
        const newDaysRemaining = Math.max(0, i.daysRemaining - 1);
        const isFinished = newDaysRemaining === 0 || newTotalClaimed >= i.totalExpectedReturn;
        return {
          ...i,
          lastClaimDate: new Date(now).toISOString(),
          nextClaimDate: nextCycleTime,
          totalClaimed: newTotalClaimed,
          daysRemaining: newDaysRemaining,
          status: isFinished ? 'completed' : 'active'
        };
      }
      return i;
    }));

    // Credit user balance
    const balanceBefore = currentUser.walletBalance;
    const balanceAfter = balanceBefore + earned;

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          walletBalance: balanceAfter,
          totalMiningEarned: u.totalMiningEarned + earned
        };
      }
      return u;
    }));

    // Record audit log
    const audit: WalletAuditLog = {
      id: 'aud_claim_' + Date.now(),
      userId: currentUser.id,
      memberCode: currentUser.memberCode,
      type: 'mining_reward',
      title: 'Daily Mining ROI Claimed (12%)',
      amount: earned,
      isCredit: true,
      balanceBefore,
      balanceAfter,
      description: `24-Hour yield from ${inv.planName} (Invested: ৳${inv.investedAmount.toLocaleString()})`,
      timestamp: new Date(now).toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    confetti({ particleCount: 50, spread: 60 });
    toast(`অভিনন্দন! ৳${earned.toLocaleString()} (১২% প্রফিট) আপনার ওয়ালেটে যুক্ত হয়েছে। পরবর্তী ক্লেইম ২৪ ঘণ্টা পর।`, 'success');
    return { success: true, message: 'Reward claimed', earned };
  };

  // Submit Deposit Request
  const submitDeposit = (gateway: GatewayType, senderNumber: string, amount: number, trxId: string) => {
    if (!currentUser) return { success: false, message: 'অনুগ্রহ করে প্রথমে লগইন করুন।' };
    if (!senderNumber.trim() || !trxId.trim() || amount <= 0) {
      return { success: false, message: 'সঠিক প্রেরক নম্বর, পরিমাণ ও TrxID প্রদান করুন।' };
    }

    const cleanTrx = trxId.trim().toUpperCase();
    if (cleanTrx.length < 4) {
      return { success: false, message: 'সঠিক Transaction ID (কমপক্ষে ৪ অক্ষরের TrxID) প্রদান করুন।' };
    }

    const gwConfig = gateways[gateway];
    if (amount < (gwConfig?.minDeposit || 100)) {
      return { success: false, message: `${gateway}-এ সর্বনিম্ন ডিপোজিট ৳${gwConfig?.minDeposit || 100}` };
    }

    // Strict duplicate check across all previous deposits
    const duplicateTrx = deposits.some(d => d.trxId.trim().toUpperCase() === cleanTrx);
    if (duplicateTrx) {
      return { 
        success: false, 
        message: `❌ এই Transaction ID (${cleanTrx}) ইতিমধ্যে একবার ব্যবহার করা হয়েছে! bKash/Nagad/Rocket/mCash এর প্রতিটি TrxID শুধুমাত্র একবারই ব্যবহারযোগ্য।` 
      };
    }

    const newDeposit: DepositTransaction = {
      id: 'dep_' + Date.now(),
      userId: currentUser.id,
      memberCode: currentUser.memberCode,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      gateway,
      recipientNumber: gwConfig?.accountNumber || '01700000000',
      senderNumber: senderNumber.trim(),
      amount,
      trxId: cleanTrx,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setDeposits(prev => [newDeposit, ...prev]);
    toast(`৳${amount.toLocaleString()} ডিপোজিট রিকোয়েস্ট সফলভাবে জমা হয়েছে! TrxID: ${cleanTrx} ভেরিফাই করে অ্যাডমিন ব্যালেন্স যুক্ত করবেন।`, 'success');
    return { success: true, message: 'Deposit request submitted successfully' };
  };

  // Submit Withdraw Request
  const submitWithdraw = (gateway: GatewayType, recipientNumber: string, amount: number) => {
    if (!currentUser) return { success: false, message: 'অনুগ্রহ করে প্রথমে লগইন করুন।' };
    if (!recipientNumber.trim() || amount <= 0) {
      return { success: false, message: 'সঠিক রিসিভার নম্বর ও উত্তোলনের পরিমাণ দিন।' };
    }

    const gwConfig = gateways[gateway];
    const minWth = gwConfig?.minWithdraw || 150;
    const maxWth = gwConfig?.maxWithdraw || 50000;

    if (amount < minWth || amount > maxWth) {
      return { success: false, message: `উত্তোলনের পরিমাণ ৳${minWth.toLocaleString()} থেকে ৳${maxWth.toLocaleString()}-এর মধ্যে হতে হবে।` };
    }

    if (currentUser.walletBalance < amount) {
      return { success: false, message: `অপর্যাপ্ত ব্যালেন্স! আপনার বর্তমান ব্যালেন্স ৳${currentUser.walletBalance.toLocaleString()}` };
    }

    const feePercent = gwConfig?.withdrawFeePercent ?? 15.0;
    const fee = Math.round((amount * (feePercent / 100)) * 100) / 100;
    const netAmount = Math.round((amount - fee) * 100) / 100;

    // Deduct immediately on hold
    const balanceBefore = currentUser.walletBalance;
    const balanceAfter = balanceBefore - amount;

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          walletBalance: balanceAfter
        };
      }
      return u;
    }));

    const newWithdraw: WithdrawTransaction = {
      id: 'wth_' + Date.now(),
      userId: currentUser.id,
      memberCode: currentUser.memberCode,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      gateway,
      recipientNumber: recipientNumber.trim(),
      amount,
      fee,
      netAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setWithdraws(prev => [newWithdraw, ...prev]);

    // Audit Log for withdrawal requested
    const audit: WalletAuditLog = {
      id: 'aud_wth_' + Date.now(),
      userId: currentUser.id,
      memberCode: currentUser.memberCode,
      type: 'withdraw',
      title: `Withdrawal Request: ${gateway}`,
      amount,
      isCredit: false,
      balanceBefore,
      balanceAfter,
      description: `Requested cashout ৳${amount.toLocaleString()} to ${gateway} (${recipientNumber.trim()}). Net to receive: ৳${netAmount.toLocaleString()}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    toast(`Withdrawal request for ৳${amount.toLocaleString()} submitted! Admin will send payment to your ${gateway} account.`, 'success');
    return { success: true, message: 'Withdrawal requested' };
  };

  // Support / Complaint (obijogh)
  const createSupportTicket = (subject: string, category: SupportTicket['category'], message: string) => {
    if (!currentUser) return { success: false, message: 'Please login first' };
    if (!subject.trim() || !message.trim()) {
      return { success: false, message: 'Please fill in subject and complaint message.' };
    }

    const newTicket: SupportTicket = {
      id: 'tkt_' + Date.now(),
      userId: currentUser.id,
      memberCode: currentUser.memberCode,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      subject: subject.trim(),
      category,
      message: message.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    toast('Your complaint/query was submitted to the Admin Support Desk!', 'success');
    return { success: true, message: 'Ticket submitted' };
  };

  // User Profile Update
  const updateUserProfile = (name: string, email: string, phone: string, newPassword?: string) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          name: name.trim() || u.name,
          email: email.trim().toLowerCase() || u.email,
          phone: phone.trim() || u.phone,
          password: newPassword && newPassword.trim() ? newPassword.trim() : u.password
        };
      }
      return u;
    }));

    toast('Profile updated successfully!', 'success');
    return { success: true, message: 'Profile updated' };
  };

  // Admin: Approve Deposit
  const approveDeposit = (depositId: string) => {
    const dep = deposits.find(d => d.id === depositId);
    if (!dep || dep.status !== 'pending') return;

    const user = users.find(u => u.id === dep.userId);
    if (!user) return;

    const balanceBefore = user.walletBalance;
    const balanceAfter = balanceBefore + dep.amount;

    // Update user balance
    setUsers(prev => prev.map(u => {
      if (u.id === dep.userId) {
        return {
          ...u,
          walletBalance: balanceAfter,
          totalDeposited: u.totalDeposited + dep.amount
        };
      }
      return u;
    }));

    // Update deposit status
    setDeposits(prev => prev.map(d => {
      if (d.id === depositId) {
        return {
          ...d,
          status: 'approved',
          processedAt: new Date().toISOString(),
          processedBy: currentAdmin?.memberCode || 'ADMIN'
        };
      }
      return d;
    }));

    // Add Audit Log
    const audit: WalletAuditLog = {
      id: 'aud_dep_app_' + Date.now(),
      userId: user.id,
      memberCode: user.memberCode,
      type: 'deposit',
      title: `${dep.gateway} Deposit Approved (Trx: ${dep.trxId})`,
      amount: dep.amount,
      isCredit: true,
      balanceBefore,
      balanceAfter,
      referenceId: dep.trxId,
      description: `Deposit approved via ${dep.gateway} from ${dep.senderNumber}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Live Ticker update
    const tickerItem: LiveTickerItem = {
      id: 'tk_' + Date.now(),
      type: 'deposit',
      userMask: user.phone.slice(0, 3) + '****' + user.phone.slice(-4),
      amount: dep.amount,
      gateway: dep.gateway,
      timeAgo: 'Just now',
      timestamp: Date.now()
    };
    setLiveTickers(prev => [tickerItem, ...prev.slice(0, 19)]);

    // Update platform settings total deposit volume
    setSettings(prev => ({ ...prev, totalDepositsVolume: prev.totalDepositsVolume + dep.amount }));

    toast(`Approved ৳${dep.amount.toLocaleString()} deposit for ${user.name} (${user.memberCode})`, 'success');
  };

  // Admin: Reject Deposit
  const rejectDeposit = (depositId: string, reason: string) => {
    setDeposits(prev => prev.map(d => {
      if (d.id === depositId) {
        return {
          ...d,
          status: 'rejected',
          rejectReason: reason || 'Invalid TrxID or payment not received',
          processedAt: new Date().toISOString(),
          processedBy: currentAdmin?.memberCode || 'ADMIN'
        };
      }
      return d;
    }));
    toast('Deposit request rejected', 'info');
  };

  // Admin: Approve Withdraw
  const approveWithdraw = (withdrawId: string) => {
    const wth = withdraws.find(w => w.id === withdrawId);
    if (!wth || wth.status !== 'pending') return;

    const user = users.find(u => u.id === wth.userId);

    // Update user totalWithdrawn
    if (user) {
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            totalWithdrawn: u.totalWithdrawn + wth.amount
          };
        }
        return u;
      }));
    }

    setWithdraws(prev => prev.map(w => {
      if (w.id === withdrawId) {
        return {
          ...w,
          status: 'approved',
          processedAt: new Date().toISOString(),
          processedBy: currentAdmin?.memberCode || 'ADMIN'
        };
      }
      return w;
    }));

    // Update settings volume
    setSettings(prev => ({ ...prev, totalWithdrawsVolume: prev.totalWithdrawsVolume + wth.amount }));

    // Live Ticker update
    const tickerItem: LiveTickerItem = {
      id: 'tk_' + Date.now(),
      type: 'withdraw',
      userMask: wth.userPhone ? (wth.userPhone.slice(0, 3) + '****' + wth.userPhone.slice(-4)) : '017****5521',
      amount: wth.amount,
      gateway: wth.gateway,
      timeAgo: 'Just now',
      timestamp: Date.now()
    };
    setLiveTickers(prev => [tickerItem, ...prev.slice(0, 19)]);

    toast(`Approved ৳${wth.amount.toLocaleString()} withdrawal to ${wth.recipientNumber} (${wth.gateway})`, 'success');
  };

  // Admin: Reject Withdraw (Refund balance)
  const rejectWithdraw = (withdrawId: string, reason: string) => {
    const wth = withdraws.find(w => w.id === withdrawId);
    if (!wth || wth.status !== 'pending') return;

    const user = users.find(u => u.id === wth.userId);
    if (user) {
      const balanceBefore = user.walletBalance;
      const balanceAfter = balanceBefore + wth.amount;

      // Refund to wallet
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            walletBalance: balanceAfter
          };
        }
        return u;
      }));

      // Audit Log
      const audit: WalletAuditLog = {
        id: 'aud_wth_rej_' + Date.now(),
        userId: user.id,
        memberCode: user.memberCode,
        type: 'admin_credit',
        title: 'Withdrawal Rejected - Refunded to Wallet',
        amount: wth.amount,
        isCredit: true,
        balanceBefore,
        balanceAfter,
        description: `Refunded ৳${wth.amount.toLocaleString()} due to withdrawal rejection. Reason: ${reason || 'Incorrect account info'}`,
        timestamp: new Date().toISOString()
      };
      setAuditLogs(prev => [audit, ...prev]);
    }

    setWithdraws(prev => prev.map(w => {
      if (w.id === withdrawId) {
        return {
          ...w,
          status: 'rejected',
          rejectReason: reason || 'Incorrect account details or limit issue',
          processedAt: new Date().toISOString(),
          processedBy: currentAdmin?.memberCode || 'ADMIN'
        };
      }
      return w;
    }));

    toast('Withdrawal rejected and balance refunded to user', 'info');
  };

  // Admin: Adjust Member Wallet (+ or -)
  const adjustMemberWallet = (userId: string, deltaAmount: number, reason: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const isCredit = deltaAmount > 0;
    const absAmount = Math.abs(deltaAmount);
    const balanceBefore = user.walletBalance;
    const balanceAfter = Math.max(0, balanceBefore + deltaAmount);

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          walletBalance: balanceAfter
        };
      }
      return u;
    }));

    const audit: WalletAuditLog = {
      id: 'aud_adm_adj_' + Date.now(),
      userId: user.id,
      memberCode: user.memberCode,
      type: isCredit ? 'admin_credit' : 'admin_debit',
      title: isCredit ? `Admin Wallet Credit (+৳${absAmount})` : `Admin Wallet Debit (-৳${absAmount})`,
      amount: absAmount,
      isCredit,
      balanceBefore,
      balanceAfter,
      description: `Admin adjustment by ${currentAdmin?.name || 'Admin'}. Reason: ${reason || 'Manual adjustment'}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    toast(`Adjusted wallet for ${user.name} (${user.memberCode}): ${isCredit ? '+' : '-'}৳${absAmount.toLocaleString()}`, 'success');
  };

  // Admin: Ban / Unban
  const banMember = (userId: string, reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isBanned: true,
          banReason: reason || 'Violation of platform rules',
          bannedAt: new Date().toISOString()
        };
      }
      return u;
    }));
    toast('Member has been BANNED and moved to Banned Members hub', 'error');
  };

  const unbanMember = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isBanned: false,
          banReason: undefined,
          bannedAt: undefined
        };
      }
      return u;
    }));
    toast('Member has been UNBANNED and restored to active state', 'success');
  };

  // Admin: Edit Member info
  const editMemberDetails = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          ...updates
        };
      }
      return u;
    }));
    toast('Member information updated by Admin', 'success');
  };

  // Admin: Update Payment Gateway
  const updateGatewayConfig = (gatewayKey: string, config: Partial<GatewayConfigItem>) => {
    setGateways(prev => ({
      ...prev,
      [gatewayKey]: {
        ...prev[gatewayKey],
        ...config
      }
    }));
    toast(`Payment gateway (${gatewayKey}) updated successfully`, 'success');
  };

  // Admin: Reply to Support Ticket
  const replySupportTicket = (ticketId: string, reply: string, status: SupportTicket['status']) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          reply: reply.trim() || t.reply,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
    toast('Reply sent to member ticket', 'success');
  };

  // Admin: Approve Password Reset
  const approvePasswordReset = (requestId: string, newTemporaryPassword = 'user123') => {
    const req = resetRequests.find(r => r.id === requestId);
    if (!req) return;

    if (req.userId) {
      setUsers(prev => prev.map(u => {
        if (u.id === req.userId || u.phone === req.phone) {
          return {
            ...u,
            password: newTemporaryPassword
          };
        }
        return u;
      }));
    }

    setResetRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'approved',
          newPassword: newTemporaryPassword
        };
      }
      return r;
    }));

    toast(`Password reset approved! Temporary password is set to: "${newTemporaryPassword}"`, 'success');
  };

  const rejectPasswordReset = (requestId: string) => {
    setResetRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected'
        };
      }
      return r;
    }));
    toast('Password reset request rejected', 'info');
  };

  // Moderator Management
  const addModerator = (name: string, phone: string, email: string, pass: string, permissions: User['moderatorPermissions']) => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const modCode = `MOD-${randomHex}`;

    const newMod: User = {
      id: 'mod_' + Date.now(),
      memberCode: modCode,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password: pass.trim(),
      walletBalance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalMiningEarned: 0,
      referralCode: modCode,
      referralCount: 0,
      referralEarnings: 0,
      isBanned: false,
      role: 'moderator',
      moderatorPermissions: permissions || {
        canApproveDeposits: true,
        canApproveWithdrawals: true,
        canManageMembers: false,
        canAdjustWallet: false,
        canManageSupport: true,
        canEditGateways: false,
        canViewAuditLogs: true
      },
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [newMod, ...prev]);
    toast(`Moderator ${name} (${modCode}) added successfully!`, 'success');
  };

  const updateModeratorPermissions = (userId: string, permissions: User['moderatorPermissions']) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          moderatorPermissions: permissions
        };
      }
      return u;
    }));
    toast('Moderator permissions updated', 'success');
  };

  const deleteModerator = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast('Moderator removed', 'info');
  };

  // Admin Settings & Ticker
  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast('Platform settings saved', 'success');
  };

  const addManualTicker = (type: 'deposit' | 'withdraw', phone: string, amount: number, gateway: GatewayType) => {
    const masked = phone.length >= 7 ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : '017****0000';
    const item: LiveTickerItem = {
      id: 'tk_m_' + Date.now(),
      type,
      userMask: masked,
      amount,
      gateway,
      timeAgo: 'Just now',
      timestamp: Date.now()
    };
    setLiveTickers(prev => [item, ...prev.slice(0, 19)]);
    toast(`Added live ${type} feed item for ৳${amount.toLocaleString()}`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentPortal,
        setCurrentPortal,
        activeUserTab,
        setActiveUserTab,
        activeAdminTab,
        setActiveAdminTab,
        currentUser,
        currentAdmin,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginUser,
        registerUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        requestPasswordReset,
        users,
        miningPlans,
        investments,
        deposits,
        withdraws,
        auditLogs,
        supportTickets,
        resetRequests,
        gateways,
        liveTickers,
        settings,
        buyMiningPlan,
        claimMiningReward,
        submitDeposit,
        submitWithdraw,
        createSupportTicket,
        updateUserProfile,
        approveDeposit,
        rejectDeposit,
        approveWithdraw,
        rejectWithdraw,
        adjustMemberWallet,
        banMember,
        unbanMember,
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
        userInvestments,
        userDeposits,
        userWithdraws,
        userAuditLogs,
        userTickets,
        toast,
        toastMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
