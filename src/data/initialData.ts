import { 
  GatewayConfigItem, 
  LiveTickerItem, 
  MiningPlan, 
  PlatformSettings, 
  SupportTicket, 
  User, 
  UserInvestment, 
  DepositTransaction, 
  WithdrawTransaction, 
  WalletAuditLog,
  PasswordResetRequest
} from '../types';

export const DEFAULT_MINING_PLANS: MiningPlan[] = [
  {
    id: 'plan_standard_12',
    name: 'Standard Mining Plan',
    dailyRoiPercent: 8.5,
    minDeposit: 300,
    maxDeposit: 100000,
    durationDays: 30,
    badge: 'HOT POPULAR',
    description: 'Earn 8.5% daily guaranteed mining profit for 30 days. Auto payout every 24 hours directly to your main wallet balance.',
    features: [
      'Daily 8.50% Auto Return',
      'Min: ৳300 - Max: ৳1,00,000',
      '30-Day Lock Period with Auto Payout',
      'Re-invest option upon maturity',
      'Instant Claim / 24h Countdown Cycle',
      '৳40 First Plan Bonus + 4% Lifetime Commission'
    ]
  },
  {
    id: 'plan_starter_micro',
    name: 'Starter Micro Mining',
    dailyRoiPercent: 8.5,
    minDeposit: 300,
    maxDeposit: 1000,
    durationDays: 30,
    badge: 'BEGINNER FRIENDLY',
    description: 'Perfect for first-time users. Test the mining power with as low as ৳300.',
    features: [
      'Daily 8.50% Return (৳25.5 - ৳85 / day)',
      '30 Days Active Yield Duration',
      'Instant bKash/Nagad/Rocket/mCash Cashout',
      'Low 3.2% withdrawal processing fee'
    ]
  },
  {
    id: 'plan_vip_boss',
    name: 'Boss VIP High-Yield',
    dailyRoiPercent: 8.5,
    minDeposit: 5000,
    maxDeposit: 100000,
    durationDays: 30,
    badge: 'VIP YIELD',
    description: 'For high-frequency earners. Maximize your daily cashflow with priority withdrawals.',
    features: [
      'Daily 8.50% Return (৳425 - ৳8,500 / day)',
      'VIP Priority 5-Minute Cashout Processing',
      'Dedicated 24/7 VIP Telegram Manager',
      '255% Total 30-Day ROI'
    ]
  }
];

export const DEFAULT_GATEWAYS: Record<string, GatewayConfigItem> = {
  bKash: {
    gateway: 'bKash',
    name: 'bKash Personal / Send Money',
    accountNumber: '01821192590',
    accountType: 'Personal',
    minDeposit: 300,
    maxDeposit: 100000,
    minWithdraw: 300,
    maxWithdraw: 25000,
    withdrawFeePercent: 3.2,
    isActive: true,
    instructions: 'Go to your bKash App or dial *247# -> Send Money to this number -> Copy Transaction ID (TrxID) and enter below.',
    iconColor: '#E2136E',
    bgColor: 'rgba(226, 19, 110, 0.12)'
  },
  Nagad: {
    gateway: 'Nagad',
    name: 'Nagad Personal / Send Money',
    accountNumber: '',
    accountType: 'Personal',
    minDeposit: 300,
    maxDeposit: 100000,
    minWithdraw: 300,
    maxWithdraw: 25000,
    withdrawFeePercent: 3.2,
    isActive: true,
    instructions: 'Go to your Nagad App or dial *167# -> Send Money to our official number -> Copy Transaction ID (TrxID) and enter below.',
    iconColor: '#F7941D',
    bgColor: 'rgba(247, 148, 29, 0.12)'
  },
  Rocket: {
    gateway: 'Rocket',
    name: 'Dutch-Bangla Rocket Personal',
    accountNumber: '',
    accountType: 'Personal',
    minDeposit: 300,
    maxDeposit: 100000,
    minWithdraw: 300,
    maxWithdraw: 25000,
    withdrawFeePercent: 3.2,
    isActive: true,
    instructions: 'Go to your DBBL Rocket App or dial *322# -> Send Money to our official number -> Enter TrxID below.',
    iconColor: '#8C3494',
    bgColor: 'rgba(140, 52, 148, 0.12)'
  },
  mCash: {
    gateway: 'mCash',
    name: 'Islami Bank mCash',
    accountNumber: '',
    accountType: 'Personal',
    minDeposit: 300,
    maxDeposit: 100000,
    minWithdraw: 300,
    maxWithdraw: 25000,
    withdrawFeePercent: 3.2,
    isActive: true,
    instructions: 'Send money to our official IBBL mCash wallet number and submit your sender number & Transaction code.',
    iconColor: '#00833E',
    bgColor: 'rgba(0, 131, 62, 0.12)'
  }
};

export const DEFAULT_USERS: User[] = [
  {
    id: 'user_boss_admin',
    memberCode: 'BOSS-ADMIN',
    name: 'Super Admin Shykot',
    phone: '01700000000',
    email: 'adminSHYKOT@gmail.com',
    password: 'adminSHYKOT',
    walletBalance: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalMiningEarned: 0,
    referralCode: 'BOSSMASTER',
    referralCount: 0,
    referralEarnings: 0,
    isBanned: false,
    role: 'admin',
    createdAt: '2025-01-01T00:00:00.000Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_INVESTMENTS: UserInvestment[] = [];

export const DEFAULT_DEPOSITS: DepositTransaction[] = [];

export const DEFAULT_WITHDRAWS: WithdrawTransaction[] = [];

export const DEFAULT_AUDIT_LOGS: WalletAuditLog[] = [];

export const DEFAULT_TICKERS: LiveTickerItem[] = [
  {
    id: 'tk_1',
    type: 'deposit',
    userMask: '017****5892',
    amount: 2500,
    gateway: 'bKash',
    timeAgo: '2m ago',
    timestamp: Date.now() - 120000
  },
  {
    id: 'tk_2',
    type: 'withdraw',
    userMask: '019****1104',
    amount: 1450,
    gateway: 'Nagad',
    timeAgo: '4m ago',
    timestamp: Date.now() - 240000
  },
  {
    id: 'tk_3',
    type: 'deposit',
    userMask: '018****9921',
    amount: 5000,
    gateway: 'Rocket',
    timeAgo: '7m ago',
    timestamp: Date.now() - 420000
  },
  {
    id: 'tk_4',
    type: 'withdraw',
    userMask: '016****4431',
    amount: 820,
    gateway: 'bKash',
    timeAgo: '11m ago',
    timestamp: Date.now() - 660000
  },
  {
    id: 'tk_5',
    type: 'deposit',
    userMask: '017****0034',
    amount: 10000,
    gateway: 'mCash',
    timeAgo: '15m ago',
    timestamp: Date.now() - 900000
  }
];

export const DEFAULT_SUPPORT_TICKETS: SupportTicket[] = [];

export const DEFAULT_RESET_REQUESTS: PasswordResetRequest[] = [];

export const DEFAULT_SETTINGS: PlatformSettings = {
  siteName: 'MICROJOBBOSS',
  totalMembersCount: 67000,
  totalDepositsVolume: 210000000,
  totalWithdrawsVolume: 1220000000,
  displayTotalMembers: '67,000+',
  displayTotalDeposits: '৳21 Cr+',
  displayTotalWithdraws: '৳122 Cr+',
  referralBonusPerPlan: 40, // ৳40 direct commission on first plan
  referralCommissionPercent: 4.0, // 4% upline commission on all plan purchases
  telegramSupportUrl: 'https://t.me/microjobboss_official',
  whatsappSupportUrl: 'https://wa.me/8801700000000',
  helplinePhone: '+880 1700-000000',
  announcementNotice: '🔥 Welcome to MICROJOBBOSS! Enjoy 8.5% daily return with 30-day continuous mining cycle. Instant bKash, Nagad, Rocket, mCash cashouts 24/7! Refer friends and earn ৳40 instant bonus + 4% lifetime plan commission.',
  isMaintenanceMode: false,
  maintenanceNotice: 'সাইটের সিস্টেম আপডেট ও সার্ভার মেইনটেন্যান্স এর কাজ চলতেছে, কিছুক্ষণ অপেক্ষা করুন। খুব শীঘ্রই সাইট পুনরায় সচল হবে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।',
  maintenanceEstimateTime: '15-30 মিনিট'
};
