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
import {
  subscribeToUsers,
  subscribeToDeposits,
  subscribeToWithdrawals,
  subscribeToInvestments,
  subscribeToAuditLogs,
  subscribeToSupport,
  subscribeToResets,
  subscribeToSettings,
  subscribeToTickers,
  firestoreSaveUser,
  firestoreSaveDeposit,
  firestoreSaveWithdraw,
  firestoreSaveInvestment,
  firestoreSaveAuditLog,
  firestoreSaveSupportTicket,
  firestoreSaveResetRequest,
  firestoreSaveSettings,
  firestoreSaveTicker,
  firestoreDeleteMemberData,
  fetchCloudUsersList,
  seedInitialFirestoreData
} from '../services/firebaseService';

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
  loginUser: (identifier: string, pass: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  registerUser: (name: string, phone: string, email: string, pass: string, refCode?: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  logoutUser: () => void;
  loginAdmin: (identifier: string, pass: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
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
  deleteMember: (userId: string) => void;
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
  const [gateways, setGateways] = useState<Record<string, GatewayConfigItem>>(() => {
    const stored = getStorage<Record<string, GatewayConfigItem>>(STORAGE_KEYS.GATEWAYS, DEFAULT_GATEWAYS);
    if (!stored) return DEFAULT_GATEWAYS;
    const upgraded: Record<string, GatewayConfigItem> = {};
    Object.keys(DEFAULT_GATEWAYS).forEach(key => {
      const existing = stored[key] || DEFAULT_GATEWAYS[key];
      let accNum = existing.accountNumber ?? '';
      // Migrate old placeholder numbers to requested default: bKash has 01821192590, others empty
      if (key === 'bKash' && (accNum === '01798-56656' || !accNum)) {
        accNum = '01821192590';
      } else if (key === 'Nagad' && accNum === '01882-798980') {
        accNum = '';
      } else if (key === 'Rocket' && accNum === '01915-909090') {
        accNum = '';
      } else if (key === 'mCash' && accNum === '01620-989898') {
        accNum = '';
      }

      upgraded[key] = {
        ...DEFAULT_GATEWAYS[key],
        ...existing,
        accountNumber: accNum,
        minDeposit: existing.minDeposit < 300 ? 300 : existing.minDeposit,
        minWithdraw: (existing.minWithdraw === 150 || !existing.minWithdraw) ? 300 : existing.minWithdraw,
        maxWithdraw: (existing.maxWithdraw === 50000 || !existing.maxWithdraw) ? 25000 : existing.maxWithdraw,
        withdrawFeePercent: (existing.withdrawFeePercent === 15.0 || existing.withdrawFeePercent === 15 || existing.withdrawFeePercent === undefined) ? 3.2 : existing.withdrawFeePercent
      };
    });
    return upgraded;
  });
  const [liveTickers, setLiveTickers] = useState<LiveTickerItem[]>(() => getStorage<LiveTickerItem[]>(STORAGE_KEYS.TICKERS, DEFAULT_TICKERS));
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const stored = getStorage<Partial<PlatformSettings>>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      displayTotalMembers: stored?.displayTotalMembers || '67,000+',
      displayTotalDeposits: stored?.displayTotalDeposits || '৳21 Cr+',
      displayTotalWithdraws: stored?.displayTotalWithdraws || '৳122 Cr+',
      referralBonusPerPlan: (stored?.referralBonusPerPlan === 50 || !stored?.referralBonusPerPlan) ? 40 : stored.referralBonusPerPlan,
      referralCommissionPercent: typeof stored?.referralCommissionPercent === 'number' ? stored.referralCommissionPercent : 4.0,
      isMaintenanceMode: typeof stored?.isMaintenanceMode === 'boolean' ? stored.isMaintenanceMode : false,
      maintenanceNotice: stored?.maintenanceNotice || DEFAULT_SETTINGS.maintenanceNotice,
      maintenanceEstimateTime: stored?.maintenanceEstimateTime || DEFAULT_SETTINGS.maintenanceEstimateTime
    };
  });

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

  // Real-time Cloud Firebase Database Synchronization across all devices (Mobile / PC / Laptop)
  useEffect(() => {
    // Initial check & seed default admin/gateways if cloud DB is freshly provisioned
    seedInitialFirestoreData(DEFAULT_USERS, DEFAULT_GATEWAYS, DEFAULT_SETTINGS);

    const unsubUsers = subscribeToUsers((cloudUsers) => {
      setUsers(prev => {
        // Merge cloud users with local state
        const map = new Map<string, User>();
        prev.forEach(u => map.set(u.id, u));
        cloudUsers.forEach(u => map.set(u.id, u));
        const merged = Array.from(map.values());
        setStorage(STORAGE_KEYS.USERS, merged);
        return merged;
      });
    });

    const unsubDeposits = subscribeToDeposits((cloudDeposits) => {
      setDeposits(cloudDeposits);
      setStorage(STORAGE_KEYS.DEPOSITS, cloudDeposits);
    });

    const unsubWithdrawals = subscribeToWithdrawals((cloudWithdraws) => {
      setWithdraws(cloudWithdraws);
      setStorage(STORAGE_KEYS.WITHDRAWS, cloudWithdraws);
    });

    const unsubInvestments = subscribeToInvestments((cloudInvestments) => {
      setInvestments(cloudInvestments);
      setStorage(STORAGE_KEYS.INVESTMENTS, cloudInvestments);
    });

    const unsubAuditLogs = subscribeToAuditLogs((cloudLogs) => {
      setAuditLogs(cloudLogs);
      setStorage(STORAGE_KEYS.AUDIT_LOGS, cloudLogs);
    });

    const unsubSupport = subscribeToSupport((cloudTickets) => {
      setSupportTickets(cloudTickets);
      setStorage(STORAGE_KEYS.SUPPORT, cloudTickets);
    });

    const unsubResets = subscribeToResets((cloudResets) => {
      setResetRequests(cloudResets);
      setStorage(STORAGE_KEYS.RESETS, cloudResets);
    });

    const unsubSettings = subscribeToSettings(
      (cloudGateways) => {
        setGateways(cloudGateways);
        setStorage(STORAGE_KEYS.GATEWAYS, cloudGateways);
      },
      (cloudSettings) => {
        setSettings(prev => {
          const updated = { ...prev, ...cloudSettings };
          setStorage(STORAGE_KEYS.SETTINGS, updated);
          return updated;
        });
      }
    );

    const unsubTickers = subscribeToTickers((cloudTickers) => {
      setLiveTickers(cloudTickers);
    });

    return () => {
      unsubUsers();
      unsubDeposits();
      unsubWithdrawals();
      unsubInvestments();
      unsubAuditLogs();
      unsubSupport();
      unsubResets();
      unsubSettings();
      unsubTickers();
    };
  }, []);

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

  // Helper to normalize phone numbers (extracts last 10 digits to match +88017..., 017..., 88017..., etc.)
  const normalizePhone = (p: string): string => {
    const digits = p.replace(/\D/g, '');
    return digits.length >= 10 ? digits.slice(-10) : digits;
  };

  // Auth Operations
  const loginUser = async (identifier: string, pass: string) => {
    const rawId = identifier.trim();
    const cleanIdLower = rawId.toLowerCase();
    const cleanIdPhone = normalizePhone(rawId);
    const cleanPass = pass.trim();

    let userPool = users;

    const findMatchingUser = (pool: User[]) => {
      return pool.find(u => {
        const uPhoneClean = normalizePhone(u.phone);
        const isPhoneMatch = cleanIdPhone.length >= 8 && uPhoneClean === cleanIdPhone;
        const isEmailMatch = u.email.toLowerCase() === cleanIdLower;
        const isMemberCodeMatch = u.memberCode.toLowerCase() === cleanIdLower;

        if (!isPhoneMatch && !isEmailMatch && !isMemberCodeMatch) {
          return false;
        }

        return u.password === pass || 
               u.password.trim() === cleanPass ||
               u.password.toLowerCase() === cleanPass.toLowerCase();
      });
    };

    let user = findMatchingUser(userPool);

    // If not found in local memory (e.g. freshly opened device or cache delay), direct fetch from Firestore
    if (!user) {
      const cloudUsers = await fetchCloudUsersList();
      if (cloudUsers.length > 0) {
        user = findMatchingUser(cloudUsers);
        if (user) {
          setUsers(prev => {
            const map = new Map<string, User>();
            prev.forEach(u => map.set(u.id, u));
            cloudUsers.forEach(u => map.set(u.id, u));
            const merged = Array.from(map.values());
            setStorage(STORAGE_KEYS.USERS, merged);
            return merged;
          });
        }
      }
    }

    if (!user) {
      return { success: false, message: 'ভুল মোবাইল নাম্বার/ইমেইল অথবা পাসওয়ার্ড! সঠিক তথ্য দিন।' };
    }

    if (user.isBanned) {
      return { 
        success: false, 
        message: `আপনার একাউন্ট ব্যান করা হয়েছে। কারণ: ${user.banReason || 'পলিসি লঙ্ঘন'}। সাপোর্টে যোগাযোগ করুন।` 
      };
    }

    setCurrentUserId(user.id);
    setStorage(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    setCurrentAdminId(null);
    setStorage(STORAGE_KEYS.CURRENT_ADMIN_ID, null);
    setCurrentPortal('user');
    setIsAuthModalOpen(false);
    toast(`স্বাগতম, ${user.name}! সফলভাবে লগইন হয়েছে।`, 'success');
    return { success: true, message: 'Login successful' };
  };

  const registerUser = async (name: string, phone: string, email: string, pass: string, refCode?: string) => {
    const cleanName = name.trim();
    const rawPhone = phone.trim();
    const cleanPhoneDigits = normalizePhone(rawPhone);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanName || !rawPhone || !cleanEmail || !cleanPass) {
      return { success: false, message: 'সবগুলো ঘর সঠিকভাবে পূরণ করুন।' };
    }

    if (rawPhone.replace(/\D/g, '').length < 10) {
      return { success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)।' };
    }

    let userPool = users;

    // Check cloud users to guarantee no duplicate registration across different devices
    const cloudUsers = await fetchCloudUsersList();
    if (cloudUsers.length > 0) {
      const map = new Map<string, User>();
      userPool.forEach(u => map.set(u.id, u));
      cloudUsers.forEach(u => map.set(u.id, u));
      userPool = Array.from(map.values());
    }

    // Check duplicate phone or email
    const exists = userPool.some(u => {
      const uPhoneClean = normalizePhone(u.phone);
      return (cleanPhoneDigits.length >= 8 && uPhoneClean === cleanPhoneDigits) || 
             u.email.toLowerCase() === cleanEmail;
    });

    if (exists) {
      return { success: false, message: 'এই মোবাইল নাম্বার বা ইমেইল দিয়ে ইতিমধ্যে একাউন্ট খোলা হয়েছে।' };
    }

    // Generate unique member code (e.g. micr879F70)
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const memberCode = `micr${randomNum}${randomHex}`;

    // Verify referrer
    let validReferrer: User | undefined;
    if (refCode && refCode.trim()) {
      const cleanRef = refCode.trim().toLowerCase();
      validReferrer = userPool.find(u => 
        u.referralCode.toLowerCase() === cleanRef ||
        u.memberCode.toLowerCase() === cleanRef ||
        normalizePhone(u.phone) === normalizePhone(cleanRef)
      );
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      memberCode,
      name: cleanName,
      phone: rawPhone,
      email: cleanEmail,
      password: cleanPass,
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

    let updatedUsers = [newUser, ...userPool];

    // If referred, update referrer's count
    if (validReferrer) {
      updatedUsers = updatedUsers.map(u => {
        if (u.id === validReferrer?.id) {
          return { ...u, referralCount: u.referralCount + 1 };
        }
        return u;
      });
    }

    setUsers(updatedUsers);
    setStorage(STORAGE_KEYS.USERS, updatedUsers);
    firestoreSaveUser(newUser);

    // If referred, update referrer's count and persist to Firestore
    if (validReferrer) {
      const updatedRef = { ...validReferrer, referralCount: validReferrer.referralCount + 1 };
      firestoreSaveUser(updatedRef);
    }

    // Update settings total members count
    setSettings(prev => {
      const updated = { ...prev, totalMembersCount: prev.totalMembersCount + 1 };
      setStorage(STORAGE_KEYS.SETTINGS, updated);
      firestoreSaveSettings(gateways, updated);
      return updated;
    });

    setCurrentUserId(newUser.id);
    setStorage(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    setCurrentAdminId(null);
    setStorage(STORAGE_KEYS.CURRENT_ADMIN_ID, null);
    setCurrentPortal('user');
    setIsAuthModalOpen(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    toast(`অভিনন্দন! একাউন্ট সফল হয়েছে। আপনার মেম্বার আইডি: ${memberCode}`, 'success');
    return { success: true, message: 'Account created successfully' };
  };

  const logoutUser = () => {
    setCurrentUserId(null);
    setStorage(STORAGE_KEYS.CURRENT_USER_ID, null);
    setCurrentPortal('user');
    toast('Logged out successfully', 'info');
  };

  const loginAdmin = async (identifier: string, pass: string) => {
    const rawId = identifier.trim();
    const cleanIdLower = rawId.toLowerCase();
    const cleanIdPhone = normalizePhone(rawId);
    const cleanPass = pass.trim();

    let userPool = users;

    const findAdmin = (pool: User[]) => {
      return pool.find(u => {
        if (u.role !== 'admin' && u.role !== 'moderator') return false;
        const uPhoneClean = normalizePhone(u.phone);
        const isPhoneMatch = cleanIdPhone.length >= 8 && uPhoneClean === cleanIdPhone;
        const isEmailMatch = u.email.toLowerCase() === cleanIdLower;
        const isMemberCodeMatch = u.memberCode.toLowerCase() === cleanIdLower;

        if (!isPhoneMatch && !isEmailMatch && !isMemberCodeMatch) return false;

        return u.password === pass || u.password.trim() === cleanPass;
      });
    };

    let adminUser = findAdmin(userPool);

    if (!adminUser) {
      const cloudUsers = await fetchCloudUsersList();
      if (cloudUsers.length > 0) {
        adminUser = findAdmin(cloudUsers);
        if (adminUser) {
          setUsers(prev => {
            const map = new Map<string, User>();
            prev.forEach(u => map.set(u.id, u));
            cloudUsers.forEach(u => map.set(u.id, u));
            const merged = Array.from(map.values());
            setStorage(STORAGE_KEYS.USERS, merged);
            return merged;
          });
        }
      }
    }

    if (!adminUser) {
      return { success: false, message: 'ভুল অ্যাডমিন/মডারেটর ইউজারনেম অথবা পাসওয়ার্ড!' };
    }

    if (adminUser.isBanned) {
      return { success: false, message: 'Admin account is disabled.' };
    }

    setCurrentAdminId(adminUser.id);
    setStorage(STORAGE_KEYS.CURRENT_ADMIN_ID, adminUser.id);
    setCurrentPortal('admin');
    setIsAuthModalOpen(false);
    toast(`Authenticated as ${adminUser.role.toUpperCase()}: ${adminUser.name}`, 'success');
    return { success: true, message: 'Admin logged in' };
  };

  const logoutAdmin = () => {
    setCurrentAdminId(null);
    setCurrentPortal('user');
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
    firestoreSaveResetRequest(newReq);
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

    const nextClaimDate = now; // Ready immediately for 1st day reward right after purchase!

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
      lastClaimDate: '',
      nextClaimDate: nextClaimDate.toISOString(),
      totalClaimed: 0,
      claimedDaysCount: 0,
      daysRemaining: plan.durationDays,
      status: 'active'
    };

    // Deduct user balance & record audit log
    const balanceBefore = currentUser.walletBalance;
    const balanceAfter = balanceBefore - amount;

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = {
          ...u,
          walletBalance: balanceAfter
        };
        firestoreSaveUser(updated);
        return updated;
      }
      return u;
    }));

    setInvestments(prev => [newInvestment, ...prev]);
    firestoreSaveInvestment(newInvestment);

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
      description: `Locked ৳${amount.toLocaleString()} for 30 days @ 8.5% daily ROI`,
      timestamp: now.toISOString()
    };
    setAuditLogs(prev => [purchaseAudit, ...prev]);
    firestoreSaveAuditLog(purchaseAudit);

    // MLM Referral bonus & 4% plan commission distribution
    if (currentUser.referredBy) {
      const referrer = users.find(u => u.memberCode === currentUser.referredBy || u.referralCode === currentUser.referredBy);
      if (referrer) {
        // Check if this is the downline user's first plan or a subsequent re-purchase / renewal
        const isFirstPlan = !investments.some(inv => inv.userId === currentUser.id);
        const commissionPercent = typeof settings.referralCommissionPercent === 'number' ? settings.referralCommissionPercent : 4.0;
        const planCommission = Math.round((amount * (commissionPercent / 100)) * 100) / 100;
        const firstTimeFixedBonus = isFirstPlan ? (settings.referralBonusPerPlan || 40) : 0;
        const totalBonus = firstTimeFixedBonus + planCommission;

        setUsers(prev => prev.map(u => {
          if (u.id === referrer.id) {
            const updated = {
              ...u,
              walletBalance: u.walletBalance + totalBonus,
              referralEarnings: u.referralEarnings + totalBonus
            };
            firestoreSaveUser(updated);
            return updated;
          }
          return u;
        }));

        const refAudit: WalletAuditLog = {
          id: 'aud_ref_' + Date.now(),
          userId: referrer.id,
          memberCode: referrer.memberCode,
          type: 'referral_bonus',
          title: isFirstPlan 
            ? `Referral Bonus (৳${totalBonus})`
            : `Referral 4% Commission (৳${totalBonus})`,
          amount: totalBonus,
          isCredit: true,
          balanceBefore: referrer.walletBalance,
          balanceAfter: referrer.walletBalance + totalBonus,
          description: isFirstPlan
            ? `Direct ৳${firstTimeFixedBonus} 1st-plan bonus + 4% plan commission (৳${planCommission}) from downline ${currentUser.memberCode} plan purchase (৳${amount.toLocaleString()})`
            : `4% commission (৳${planCommission}) from downline ${currentUser.memberCode} re-purchase / renewal plan (৳${amount.toLocaleString()})`,
          timestamp: new Date().toISOString()
        };
        setAuditLogs(prev => [refAudit, ...prev]);
        firestoreSaveAuditLog(refAudit);
      }
    }

    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    toast(`Successfully purchased ${plan.name} for ৳${amount.toLocaleString()}! 24-hour mining hash power activated.`, 'success');
    return { success: true, message: 'Plan purchased successfully' };
  };

  // Claim 24-hour mining reward (1st claim immediate, subsequent claims 24h, max 30 days)
  const claimMiningReward = (investmentId: string) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    const inv = investments.find(i => i.id === investmentId && i.userId === currentUser.id);
    if (!inv || inv.status !== 'active') {
      return { success: false, message: 'সক্রিয় মাইনিং চুক্তি পাওয়া যায়নি অথবা মেয়াদ শেষ হয়েছে।' };
    }

    const currentClaimCount = inv.claimedDaysCount ?? (30 - inv.daysRemaining);

    if (inv.daysRemaining <= 0 || currentClaimCount >= 30 || inv.totalClaimed >= inv.totalExpectedReturn) {
      // Mark as completed/expired
      setInvestments(prev => prev.map(i => i.id === investmentId ? { ...i, status: 'completed', daysRemaining: 0 } : i));
      toast('এই ৩০ দিনের মাইনিং প্ল্যানের মেয়াদ সমাপ্ত হয়েছে। নতুন প্ল্যান কিনুন।', 'info');
      return { success: false, message: 'This 30-day mining contract has already completed. Please buy a new plan.' };
    }

    const now = Date.now();
    const isFirstClaim = currentClaimCount === 0 || !inv.lastClaimDate;

    // Strict 24h verification for 2nd day onward
    if (!isFirstClaim) {
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
        
        const timeStr = `${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড`;
        toast(`২৪ ঘণ্টা পূর্ণ হওয়ার আগে ক্লেইম করা সম্ভব নয়! পরবর্তী প্রফিট ক্লেইম করতে আরও ${timeStr} অপেক্ষা করুন।`, 'error');
        return { 
          success: false, 
          message: `Claim locked! Next 8.5% mining profit can be claimed in ${timeStr}.` 
        };
      }
    }

    const earned = inv.dailyReturnAmount;
    const nextCycleTime = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const newClaimedDays = currentClaimCount + 1;
    const newDaysRemaining = Math.max(0, 30 - newClaimedDays);
    const newTotalClaimed = inv.totalClaimed + earned;
    const isFinished = newClaimedDays >= 30 || newDaysRemaining === 0;

    // Update investment: advance claim count, subtract 1 day, add earned amount, set 24h cooldown
    const updatedInv: UserInvestment = {
      ...inv,
      lastClaimDate: new Date(now).toISOString(),
      nextClaimDate: nextCycleTime,
      claimedDaysCount: newClaimedDays,
      totalClaimed: newTotalClaimed,
      daysRemaining: newDaysRemaining,
      status: isFinished ? 'completed' : 'active'
    };
    setInvestments(prev => prev.map(i => (i.id === investmentId ? updatedInv : i)));
    firestoreSaveInvestment(updatedInv);

    // Credit user balance
    const balanceBefore = currentUser.walletBalance;
    const balanceAfter = balanceBefore + earned;

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = {
          ...u,
          walletBalance: balanceAfter,
          totalMiningEarned: u.totalMiningEarned + earned
        };
        firestoreSaveUser(updated);
        return updated;
      }
      return u;
    }));

    // Record audit log
    const audit: WalletAuditLog = {
      id: 'aud_claim_' + Date.now(),
      userId: currentUser.id,
      memberCode: currentUser.memberCode,
      type: 'mining_reward',
      title: `Daily Mining ROI Claimed (Day ${newClaimedDays}/30)`,
      amount: earned,
      isCredit: true,
      balanceBefore,
      balanceAfter,
      description: `8.5% daily yield from ${inv.planName} (Day ${newClaimedDays} of 30, Invested: ৳${inv.investedAmount.toLocaleString()})`,
      timestamp: new Date(now).toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    firestoreSaveAuditLog(audit);

    confetti({ particleCount: 60, spread: 70 });
    if (isFinished) {
      toast(`🎉 অভিনন্দন! ৩০ দিনের শেষ ক্লেইম সফল (৳${earned.toLocaleString()})! প্ল্যানের মেয়াদ পূর্ণ হয়েছে। পরবর্তী আয়ের জন্য নতুন প্ল্যান কিনুন।`, 'success');
    } else if (isFirstClaim) {
      toast(`🎉 প্রথম দিনের ৮.৫% মাইনিং প্রফিট (৳${earned.toLocaleString()}) ওয়ালেটে যুক্ত হয়েছে! পরবর্তী ক্লেইম ২৪ ঘণ্টা পর উন্মুক্ত হবে (${newClaimedDays}/30 দিন সম্পন্ন)।`, 'success');
    } else {
      toast(`অভিনন্দন! ৮.৫% প্রফিট ৳${earned.toLocaleString()} ওয়ালেটে যুক্ত হয়েছে (${newClaimedDays}/30 দিন সম্পন্ন)। পরবর্তী ক্লেইম ২৪ ঘণ্টা পর।`, 'success');
    }
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
    if (!gwConfig?.accountNumber?.trim()) {
      return { success: false, message: `বর্তমানে ${gateway}-এ কোনো ডিপোজিট নম্বর যুক্ত নেই (ফাঁকা রয়েছে)। অনুগ্রহ করে bKash সিলেক্ট করে ডিপোজিট করুন অথবা অ্যাডমিনের সাথে যোগাযোগ করুন।` };
    }

    if (amount < (gwConfig?.minDeposit || 300)) {
      return { success: false, message: `${gateway}-এ সর্বনিম্ন ডিপোজিট ৳${gwConfig?.minDeposit || 300}` };
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
    firestoreSaveDeposit(newDeposit);
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
    const minWth = gwConfig?.minWithdraw || 300;
    const maxWth = gwConfig?.maxWithdraw || 25000;

    if (amount < minWth || amount > maxWth) {
      return { success: false, message: `উত্তোলনের পরিমাণ ৳${minWth.toLocaleString()} থেকে ৳${maxWth.toLocaleString()}-এর মধ্যে হতে হবে।` };
    }

    if (currentUser.walletBalance < amount) {
      return { success: false, message: `অপর্যাপ্ত ব্যালেন্স! আপনার বর্তমান ব্যালেন্স ৳${currentUser.walletBalance.toLocaleString()}` };
    }

    const feePercent = gwConfig?.withdrawFeePercent ?? 3.2;
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
    firestoreSaveWithdraw(newWithdraw);

    if (currentUser) {
      firestoreSaveUser({ ...currentUser, walletBalance: balanceAfter });
    }

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
    firestoreSaveAuditLog(audit);

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
    firestoreSaveSupportTicket(newTicket);
    toast('Your complaint/query was submitted to the Admin Support Desk!', 'success');
    return { success: true, message: 'Ticket submitted' };
  };

  // User Profile Update
  const updateUserProfile = (name: string, email: string, phone: string, newPassword?: string) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated: User = {
          ...u,
          name: name.trim() || u.name,
          email: email.trim().toLowerCase() || u.email,
          phone: phone.trim() || u.phone,
          password: newPassword && newPassword.trim() ? newPassword.trim() : u.password
        };
        firestoreSaveUser(updated);
        return updated;
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
        const updated = {
          ...u,
          walletBalance: balanceAfter,
          totalDeposited: u.totalDeposited + dep.amount
        };
        firestoreSaveUser(updated);
        return updated;
      }
      return u;
    }));

    // Update deposit status
    const updatedDep: DepositTransaction = {
      ...dep,
      status: 'approved',
      processedAt: new Date().toISOString(),
      processedBy: currentAdmin?.memberCode || 'ADMIN'
    };
    setDeposits(prev => prev.map(d => (d.id === depositId ? updatedDep : d)));
    firestoreSaveDeposit(updatedDep);

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
    firestoreSaveAuditLog(audit);

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
    firestoreSaveTicker(tickerItem);

    // Update platform settings total deposit volume
    setSettings(prev => {
      const updated = { ...prev, totalDepositsVolume: prev.totalDepositsVolume + dep.amount };
      firestoreSaveSettings(gateways, updated);
      return updated;
    });

    toast(`Approved ৳${dep.amount.toLocaleString()} deposit for ${user.name} (${user.memberCode})`, 'success');
  };

  // Admin: Reject Deposit
  const rejectDeposit = (depositId: string, reason: string) => {
    const dep = deposits.find(d => d.id === depositId);
    if (dep) {
      const updatedDep: DepositTransaction = {
        ...dep,
        status: 'rejected',
        rejectReason: reason || 'Invalid TrxID or payment not received',
        processedAt: new Date().toISOString(),
        processedBy: currentAdmin?.memberCode || 'ADMIN'
      };
      setDeposits(prev => prev.map(d => (d.id === depositId ? updatedDep : d)));
      firestoreSaveDeposit(updatedDep);
    }
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
          const updated = {
            ...u,
            totalWithdrawn: u.totalWithdrawn + wth.amount
          };
          firestoreSaveUser(updated);
          return updated;
        }
        return u;
      }));
    }

    const updatedWth: WithdrawTransaction = {
      ...wth,
      status: 'approved',
      processedAt: new Date().toISOString(),
      processedBy: currentAdmin?.memberCode || 'ADMIN'
    };
    setWithdraws(prev => prev.map(w => (w.id === withdrawId ? updatedWth : w)));
    firestoreSaveWithdraw(updatedWth);

    // Update settings volume
    setSettings(prev => {
      const updated = { ...prev, totalWithdrawsVolume: prev.totalWithdrawsVolume + wth.amount };
      firestoreSaveSettings(gateways, updated);
      return updated;
    });

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
    firestoreSaveTicker(tickerItem);

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
          const updated = {
            ...u,
            walletBalance: balanceAfter
          };
          firestoreSaveUser(updated);
          return updated;
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
      firestoreSaveAuditLog(audit);
    }

    const updatedWth: WithdrawTransaction = {
      ...wth,
      status: 'rejected',
      rejectReason: reason || 'Incorrect account details or limit issue',
      processedAt: new Date().toISOString(),
      processedBy: currentAdmin?.memberCode || 'ADMIN'
    };
    setWithdraws(prev => prev.map(w => (w.id === withdrawId ? updatedWth : w)));
    firestoreSaveWithdraw(updatedWth);

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
        const updated = {
          ...u,
          walletBalance: balanceAfter
        };
        firestoreSaveUser(updated);
        return updated;
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
    firestoreSaveAuditLog(audit);

    toast(`Adjusted wallet for ${user.name} (${user.memberCode}): ${isCredit ? '+' : '-'}৳${absAmount.toLocaleString()}`, 'success');
  };

  // Admin: Ban / Unban
  const banMember = (userId: string, reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = {
          ...u,
          isBanned: true,
          banReason: reason || 'Violation of platform rules',
          bannedAt: new Date().toISOString()
        };
        firestoreSaveUser(updated);
        return updated;
      }
      return u;
    }));
    toast('Member has been BANNED and moved to Banned Members hub', 'error');
  };

  const unbanMember = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = {
          ...u,
          isBanned: false,
          banReason: undefined,
          bannedAt: undefined
        };
        firestoreSaveUser(updated);
        return updated;
      }
      return u;
    }));
    toast('Member has been UNBANNED and restored to active state', 'success');
  };

  // Admin: Delete Member permanently
  const deleteMember = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (userToDelete.role === 'admin' || userToDelete.email.toLowerCase() === 'adminshykot@gmail.com') {
      toast('Super Admin অ্যাকাউন্ট ডিলিট করা যাবে না!', 'error');
      return;
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    const updatedInvestments = investments.filter(i => i.userId !== userId);
    const updatedDeposits = deposits.filter(d => d.userId !== userId);
    const updatedWithdraws = withdraws.filter(w => w.userId !== userId);
    const updatedAuditLogs = auditLogs.filter(a => a.userId !== userId);
    const updatedTickets = supportTickets.filter(s => s.userId !== userId);
    const updatedResets = resetRequests.filter(r => r.userId !== userId);

    setUsers(updatedUsers);
    setInvestments(updatedInvestments);
    setDeposits(updatedDeposits);
    setWithdraws(updatedWithdraws);
    setAuditLogs(updatedAuditLogs);
    setSupportTickets(updatedTickets);
    setResetRequests(updatedResets);

    setStorage(STORAGE_KEYS.USERS, updatedUsers);
    setStorage(STORAGE_KEYS.INVESTMENTS, updatedInvestments);
    setStorage(STORAGE_KEYS.DEPOSITS, updatedDeposits);
    setStorage(STORAGE_KEYS.WITHDRAWS, updatedWithdraws);
    setStorage(STORAGE_KEYS.AUDIT_LOGS, updatedAuditLogs);
    setStorage(STORAGE_KEYS.SUPPORT, updatedTickets);
    setStorage(STORAGE_KEYS.RESETS, updatedResets);

    firestoreDeleteMemberData(userId);

    if (currentUserId === userId) {
      setCurrentUserId(null);
      setStorage(STORAGE_KEYS.CURRENT_USER_ID, null);
    }

    toast(`সদস্য ${userToDelete.name} (${userToDelete.memberCode}) এর যাবতীয় ডেটা স্থায়ীভাবে ডিলিট করা হয়েছে।`, 'success');
  };

  // Admin: Edit Member info
  const editMemberDetails = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = {
          ...u,
          ...updates
        };
        firestoreSaveUser(updated);
        return updated;
      }
      return u;
    }));
    toast('Member information updated by Admin', 'success');
  };

  // Admin: Update Payment Gateway
  const updateGatewayConfig = (gatewayKey: string, config: Partial<GatewayConfigItem>) => {
    const updatedGateways = {
      ...gateways,
      [gatewayKey]: {
        ...gateways[gatewayKey],
        ...config
      }
    };
    setGateways(updatedGateways);
    firestoreSaveSettings(updatedGateways, settings);
    toast(`Payment gateway (${gatewayKey}) updated successfully`, 'success');
  };

  // Admin: Reply to Support Ticket
  const replySupportTicket = (ticketId: string, reply: string, status: SupportTicket['status']) => {
    const tkt = supportTickets.find(t => t.id === ticketId);
    if (tkt) {
      const updatedTicket: SupportTicket = {
        ...tkt,
        reply: reply.trim() || tkt.reply,
        status,
        updatedAt: new Date().toISOString()
      };
      setSupportTickets(prev => prev.map(t => (t.id === ticketId ? updatedTicket : t)));
      firestoreSaveSupportTicket(updatedTicket);
    }
    toast('Reply sent to member ticket', 'success');
  };

  // Admin: Approve Password Reset
  const approvePasswordReset = (requestId: string, newTemporaryPassword = 'user123') => {
    const req = resetRequests.find(r => r.id === requestId);
    if (!req) return;

    if (req.userId) {
      setUsers(prev => prev.map(u => {
        if (u.id === req.userId || u.phone === req.phone) {
          const updated = {
            ...u,
            password: newTemporaryPassword
          };
          firestoreSaveUser(updated);
          return updated;
        }
        return u;
      }));
    }

    const updatedReq: PasswordResetRequest = {
      ...req,
      status: 'approved',
      newPassword: newTemporaryPassword
    };
    setResetRequests(prev => prev.map(r => (r.id === requestId ? updatedReq : r)));
    firestoreSaveResetRequest(updatedReq);

    toast(`Password reset approved! Temporary password is set to: "${newTemporaryPassword}"`, 'success');
  };

  const rejectPasswordReset = (requestId: string) => {
    const req = resetRequests.find(r => r.id === requestId);
    if (req) {
      const updatedReq: PasswordResetRequest = {
        ...req,
        status: 'rejected'
      };
      setResetRequests(prev => prev.map(r => (r.id === requestId ? updatedReq : r)));
      firestoreSaveResetRequest(updatedReq);
    }
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
        canViewAuditLogs: true,
        canManageMaintenance: false
      },
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [newMod, ...prev]);
    firestoreSaveUser(newMod);
    toast(`Moderator ${name} (${modCode}) added successfully!`, 'success');
  };

  const updateModeratorPermissions = (userId: string, permissions: User['moderatorPermissions']) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = {
          ...u,
          moderatorPermissions: permissions
        };
        firestoreSaveUser(updated);
        return updated;
      }
      return u;
    }));
    toast('Moderator permissions updated', 'success');
  };

  const deleteModerator = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    firestoreDeleteMemberData(userId);
    toast('Moderator removed', 'info');
  };

  // Admin Settings & Ticker
  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    firestoreSaveSettings(gateways, updated);
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
