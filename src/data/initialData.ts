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
  PasswordResetRequest,
  NoticeItem
} from '../types';

export const DEFAULT_MINING_PLANS: MiningPlan[] = [
  {
    id: 'plan_standard_12',
    name: 'Standard Mining Plan',
    dailyRoiPercent: 8.5,
    minDeposit: 1000,
    maxDeposit: 100000,
    durationDays: 30,
    badge: 'HOT POPULAR',
    description: 'Earn 8.5% daily guaranteed mining profit for 30 days. Auto payout every 24 hours directly to your main wallet balance.',
    features: [
      'Daily 8.50% Auto Return',
      'Min: ৳1,000 - Max: ৳1,00,000',
      '30-Day Lock Period with Auto Payout',
      'Re-invest option upon maturity',
      'Instant Claim / 24h Countdown Cycle',
      '৳40 First Plan Bonus + 5% Lifetime Commission'
    ]
  },
  {
    id: 'plan_starter_micro',
    name: 'Starter Micro Mining',
    dailyRoiPercent: 8.5,
    minDeposit: 1000,
    maxDeposit: 5000,
    durationDays: 30,
    badge: 'BEGINNER FRIENDLY',
    description: 'Perfect for first-time users. Test the mining power with as low as ৳1,000.',
    features: [
      'Daily 8.50% Return (৳85 - ৳425 / day)',
      '30 Days Active Yield Duration',
      'Instant bKash/Nagad/Rocket/mCash Cashout',
      'Low 5% withdrawal processing fee'
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
    minDeposit: 1000,
    maxDeposit: 100000,
    minWithdraw: 1000,
    maxWithdraw: 25000,
    withdrawFeePercent: 5.0,
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
    minDeposit: 1000,
    maxDeposit: 100000,
    minWithdraw: 1000,
    maxWithdraw: 25000,
    withdrawFeePercent: 5.0,
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
    minDeposit: 1000,
    maxDeposit: 100000,
    minWithdraw: 1000,
    maxWithdraw: 25000,
    withdrawFeePercent: 5.0,
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
    minDeposit: 1000,
    maxDeposit: 100000,
    minWithdraw: 1000,
    maxWithdraw: 25000,
    withdrawFeePercent: 5.0,
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
    name: 'MicroJobBoss Admin',
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
  referralCommissionPercent: 5.0, // 5% upline commission on all plan purchases
  maxMemberLimit: 100000, // site member capacity limit
  isPlanPurchaseEnabled: true, // admin can turn ON or OFF plan buying for members
  planPurchaseDisabledNotice: '⚠️ অ্যাডমিন কর্তৃক সাময়িকভাবে নতুন ইনভেস্টমেন্ট প্ল্যান কেনা বন্ধ রাখা হয়েছে। খুব শীঘ্রই পুনরায় চালু করা হবে। সাময়িক অসুবিধার জন্য আমরা দুঃখিত।',
  telegramSupportUrl: 'https://t.me/microjobboss_official',
  whatsappSupportUrl: 'https://wa.me/8801700000000',
  helplinePhone: '+880 1700-000000',
  announcementNotice: '🔥 Welcome to MICROJOBBOSS! Enjoy 8.5% daily return with 30-day continuous mining cycle. Instant bKash, Nagad, Rocket, mCash cashouts 24/7! Refer friends and earn ৳40 instant bonus + 5% lifetime plan commission.',
  isMaintenanceMode: false,
  maintenanceNotice: 'সাইটের সিস্টেম আপডেট ও সার্ভার মেইনটেন্যান্স এর কাজ চলতেছে, কিছুক্ষণ অপেক্ষা করুন। খুব শীঘ্রই সাইট পুনরায় সচল হবে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।',
  maintenanceEstimateTime: '15-30 মিনিট'
};

export const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 'notice_welcome_01',
    title: '📢 MicroJobBoss অফিশিয়াল নোটিশ বোর্ডে স্বাগতম',
    content: 'MicroJobBoss প্ল্যাটফর্মের সকল প্রিয় মেম্বারদের জানানো যাচ্ছে যে, প্ল্যাটফর্মের সকল আপডেট, ডিপোজিট-উইথড্রয়াল প্রসেসিং সময়সূচি, বোনাস অফার এবং ভবিষ্যৎ সকল কাজের ঘোষণা এখন থেকে এই নোটিশ বোর্ডে নিয়মিত প্রকাশ করা হবে। যেকোনো নতুন সিদ্ধান্ত বা নিয়ম পরিবর্তনের নোটিশ এখানে পাবেন।',
    category: 'general',
    priority: 'high',
    scheduleTime: '২৪/৭ নিয়মিত কার্যকর',
    targetAudience: 'all',
    isPinned: true,
    isActive: true,
    authorName: 'MicroJobBoss Official',
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'notice_schedule_02',
    title: '⚡ ডিপোজিট ও উইথড্রয়াল প্রসেসিং সময়সূচি সংক্রান্ত নোটিশ',
    content: 'সকাল ৯:০০ টা থেকে রাত ১১:০০ টা পর্যন্ত সকল ক্যাশআউট / উইথড্রয়াল রিকোয়েস্ট সর্বোচ্চ ৫ থেকে ১৫ মিনিটের মধ্যে সফলভাবে পাঠানো হয়। রাত ১১:০০ টার পরবর্তী রিকোয়েস্টগুলো পরবর্তী দিন সকাল ৯:০০ টার সাথে সাথে প্রসেস করা হবে। অনুগ্রহ করে সঠিক TrxID ও নম্বর দিয়ে আবেদন করুন।',
    category: 'schedule',
    priority: 'high',
    scheduleTime: 'প্রতিদিন সকাল ০৯:০০ টা - রাত ১১:০০ টা',
    targetAudience: 'all',
    isPinned: true,
    isActive: true,
    authorName: 'MicroJobBoss Finance Desk',
    createdAt: '2025-01-15T12:00:00.000Z'
  },
  {
    id: 'notice_update_03',
    title: '🚀 সিস্টেম পারফরম্যান্স ও সার্ভার অপটিমাইজেশন শিডিউল',
    content: 'ব্যবহারকারীদের লেনদেন ও ক্লাউড মাইনিং আরও দ্রুত করতে প্রতি শুক্রবার দিবাগত রাত ১২:৩০ টা থেকে রাত ১:০০ টা পর্যন্ত ৩০ মিনিটের জন্য ব্যাকএন্ড অপটিমাইজেশন পরিচালিত হতে পারে। এই সময়ে সাইটে সামান্য সাময়িক বিলম্ব হলেও কোনো মেম্বারের আর্নিং মিস হবে না।',
    category: 'maintenance',
    priority: 'normal',
    scheduleTime: 'শুক্রবার দিবাগত রাত ১২:৩০ টা - ০১:০০ টা',
    targetAudience: 'all',
    isPinned: false,
    isActive: true,
    authorName: 'MicroJobBoss Tech Team',
    createdAt: '2025-01-20T16:30:00.000Z'
  }
];

