export type GatewayType = 'bKash' | 'Nagad' | 'Rocket' | 'mCash';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface ModeratorPermissions {
  canApproveDeposits: boolean;
  canApproveWithdrawals: boolean;
  canManageMembers: boolean;
  canAdjustWallet: boolean;
  canManageSupport: boolean;
  canEditGateways: boolean;
  canViewAuditLogs: boolean;
  canManageMaintenance?: boolean;
}

export interface User {
  id: string;
  memberCode: string; // e.g. micr879F70
  name: string;
  phone: string;
  email: string;
  password?: string;
  walletBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalMiningEarned: number;
  referralCode: string;
  referredBy?: string; // referrer memberCode
  referralCount: number;
  referralEarnings: number;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
  role: UserRole;
  moderatorPermissions?: ModeratorPermissions;
  createdAt: string;
  avatar?: string;
}

export interface MiningPlan {
  id: string;
  name: string;
  dailyRoiPercent: number; // 12%
  minDeposit: number; // ৳100
  maxDeposit: number; // ৳100,000
  durationDays: number; // 30
  badge: string;
  description: string;
  features: string[];
}

export interface UserInvestment {
  id: string;
  userId: string;
  planName: string;
  investedAmount: number;
  dailyRoiPercent: number; // 12%
  dailyReturnAmount: number; // investedAmount * 0.12
  totalExpectedReturn: number; // dailyReturnAmount * 30
  startDate: string;
  endDate: string;
  lastClaimDate: string;
  nextClaimDate?: string; // ISO string when next claim will be eligible (24h cooldown)
  totalClaimed: number;
  daysRemaining: number;
  claimedDaysCount?: number; // Count of claims done (up to 30)
  status: 'active' | 'completed' | 'expired';
}

export interface DepositTransaction {
  id: string;
  userId: string;
  memberCode: string;
  userName: string;
  userPhone: string;
  gateway: GatewayType;
  recipientNumber: string;
  senderNumber: string;
  amount: number;
  trxId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectReason?: string;
}

export interface WithdrawTransaction {
  id: string;
  userId: string;
  memberCode: string;
  userName: string;
  userPhone: string;
  gateway: GatewayType;
  recipientNumber: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectReason?: string;
}

export type AuditLogType = 
  | 'deposit' 
  | 'withdraw' 
  | 'mining_reward' 
  | 'referral_bonus' 
  | 'plan_purchase' 
  | 'admin_credit' 
  | 'admin_debit';

export interface WalletAuditLog {
  id: string;
  userId: string;
  memberCode: string;
  type: AuditLogType;
  title: string;
  amount: number;
  isCredit: boolean;
  balanceBefore: number;
  balanceAfter: number;
  referenceId?: string;
  description: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  memberCode: string;
  userName: string;
  userPhone: string;
  subject: string;
  category: 'deposit' | 'withdraw' | 'mining' | 'account' | 'referral' | 'other';
  message: string;
  reply?: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface PasswordResetRequest {
  id: string;
  userId?: string;
  memberCode?: string;
  phone: string;
  email?: string;
  resetCode: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  newPassword?: string;
}

export interface GatewayConfigItem {
  gateway: GatewayType;
  name: string;
  accountNumber: string;
  accountType: 'Personal' | 'Merchant' | 'Agent';
  minDeposit: number;
  maxDeposit: number;
  minWithdraw: number;
  maxWithdraw: number;
  withdrawFeePercent: number;
  isActive: boolean;
  instructions: string;
  iconColor: string;
  bgColor: string;
}

export interface LiveTickerItem {
  id: string;
  type: 'deposit' | 'withdraw';
  userMask: string; // e.g. 017****5892
  amount: number;
  gateway: GatewayType;
  timeAgo: string;
  timestamp: number;
}

export interface PlatformSettings {
  siteName: string;
  totalMembersCount: number;
  totalDepositsVolume: number;
  totalWithdrawsVolume: number;
  displayTotalMembers?: string; // e.g. "67,000+"
  displayTotalDeposits?: string; // e.g. "৳21 Cr+"
  displayTotalWithdraws?: string; // e.g. "৳122 Cr+"
  referralBonusPerPlan: number; // ৳40 direct commission on first plan
  referralCommissionPercent: number; // 4% upline commission on every plan buy/renewal
  telegramSupportUrl: string;
  whatsappSupportUrl: string;
  helplinePhone: string;
  announcementNotice: string;
  isMaintenanceMode: boolean;
  maintenanceNotice: string;
  maintenanceEstimateTime: string;
}
