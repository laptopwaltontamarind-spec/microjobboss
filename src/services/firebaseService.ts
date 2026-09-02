import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  User, 
  DepositTransaction, 
  WithdrawTransaction, 
  UserInvestment, 
  WalletAuditLog, 
  SupportTicket, 
  PasswordResetRequest, 
  GatewayConfigItem, 
  PlatformSettings,
  LiveTickerItem
} from '../types';

export const COLLECTIONS = {
  USERS: 'users',
  DEPOSITS: 'deposits',
  WITHDRAWALS: 'withdrawals',
  INVESTMENTS: 'investments',
  AUDIT_LOGS: 'audit_logs',
  SUPPORT: 'support_tickets',
  RESETS: 'password_resets',
  SETTINGS: 'platform_settings',
  TICKERS: 'live_tickers'
};

// Real-time Firestore Listeners
export const subscribeToUsers = (callback: (users: User[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
    const list: User[] = [];
    snapshot.forEach((d) => list.push(d.data() as User));
    if (list.length > 0) callback(list);
  }, (err) => console.warn('Firestore users subscription error:', err));
};

export const subscribeToDeposits = (callback: (deposits: DepositTransaction[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.DEPOSITS), (snapshot) => {
    const list: DepositTransaction[] = [];
    snapshot.forEach((d) => list.push(d.data() as DepositTransaction));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => console.warn('Firestore deposits subscription error:', err));
};

export const subscribeToWithdrawals = (callback: (withdrawals: WithdrawTransaction[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.WITHDRAWALS), (snapshot) => {
    const list: WithdrawTransaction[] = [];
    snapshot.forEach((d) => list.push(d.data() as WithdrawTransaction));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => console.warn('Firestore withdrawals subscription error:', err));
};

export const subscribeToInvestments = (callback: (investments: UserInvestment[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.INVESTMENTS), (snapshot) => {
    const list: UserInvestment[] = [];
    snapshot.forEach((d) => list.push(d.data() as UserInvestment));
    callback(list);
  }, (err) => console.warn('Firestore investments subscription error:', err));
};

export const subscribeToAuditLogs = (callback: (logs: WalletAuditLog[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.AUDIT_LOGS), (snapshot) => {
    const list: WalletAuditLog[] = [];
    snapshot.forEach((d) => list.push(d.data() as WalletAuditLog));
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  }, (err) => console.warn('Firestore audit logs subscription error:', err));
};

export const subscribeToSupport = (callback: (tickets: SupportTicket[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.SUPPORT), (snapshot) => {
    const list: SupportTicket[] = [];
    snapshot.forEach((d) => list.push(d.data() as SupportTicket));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => console.warn('Firestore support subscription error:', err));
};

export const subscribeToResets = (callback: (resets: PasswordResetRequest[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.RESETS), (snapshot) => {
    const list: PasswordResetRequest[] = [];
    snapshot.forEach((d) => list.push(d.data() as PasswordResetRequest));
    callback(list);
  }, (err) => console.warn('Firestore resets subscription error:', err));
};

export const subscribeToSettings = (
  onGateways: (gw: Record<string, GatewayConfigItem>) => void,
  onSettings: (st: PlatformSettings) => void
) => {
  return onSnapshot(doc(db, COLLECTIONS.SETTINGS, 'main_config'), (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data.gateways) onGateways(data.gateways);
      if (data.settings) onSettings(data.settings);
    }
  }, (err) => console.warn('Firestore settings subscription error:', err));
};

export const subscribeToTickers = (callback: (tickers: LiveTickerItem[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.TICKERS), (snapshot) => {
    const list: LiveTickerItem[] = [];
    snapshot.forEach((d) => list.push(d.data() as LiveTickerItem));
    list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    if (list.length > 0) callback(list.slice(0, 25));
  }, (err) => console.warn('Firestore tickers subscription error:', err));
};

// Write & Sync Operations to Cloud Firestore
export const firestoreSaveUser = async (user: User) => {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.id), user, { merge: true });
  } catch (e) {
    console.error('Error saving user to Firestore:', e);
  }
};

export const firestoreSaveDeposit = async (deposit: DepositTransaction) => {
  try {
    await setDoc(doc(db, COLLECTIONS.DEPOSITS, deposit.id), deposit, { merge: true });
  } catch (e) {
    console.error('Error saving deposit to Firestore:', e);
  }
};

export const firestoreSaveWithdraw = async (withdraw: WithdrawTransaction) => {
  try {
    await setDoc(doc(db, COLLECTIONS.WITHDRAWALS, withdraw.id), withdraw, { merge: true });
  } catch (e) {
    console.error('Error saving withdrawal to Firestore:', e);
  }
};

export const firestoreSaveInvestment = async (investment: UserInvestment) => {
  try {
    await setDoc(doc(db, COLLECTIONS.INVESTMENTS, investment.id), investment, { merge: true });
  } catch (e) {
    console.error('Error saving investment to Firestore:', e);
  }
};

export const firestoreSaveAuditLog = async (log: WalletAuditLog) => {
  try {
    await setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, log.id), log, { merge: true });
  } catch (e) {
    console.error('Error saving audit log to Firestore:', e);
  }
};

export const firestoreSaveSupportTicket = async (ticket: SupportTicket) => {
  try {
    await setDoc(doc(db, COLLECTIONS.SUPPORT, ticket.id), ticket, { merge: true });
  } catch (e) {
    console.error('Error saving support ticket to Firestore:', e);
  }
};

export const firestoreSaveResetRequest = async (reset: PasswordResetRequest) => {
  try {
    await setDoc(doc(db, COLLECTIONS.RESETS, reset.id), reset, { merge: true });
  } catch (e) {
    console.error('Error saving reset request to Firestore:', e);
  }
};

export const firestoreSaveSettings = async (gateways: Record<string, GatewayConfigItem>, settings: PlatformSettings) => {
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'main_config'), { gateways, settings }, { merge: true });
  } catch (e) {
    console.error('Error saving settings to Firestore:', e);
  }
};

export const firestoreSaveTicker = async (ticker: LiveTickerItem) => {
  try {
    await setDoc(doc(db, COLLECTIONS.TICKERS, ticker.id), ticker, { merge: true });
  } catch (e) {
    console.error('Error saving ticker to Firestore:', e);
  }
};

export const firestoreDeleteMemberData = async (userId: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
  } catch (e) {
    console.error('Error deleting member from Firestore:', e);
  }
};

export const fetchCloudUsersList = async (): Promise<User[]> => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    const list: User[] = [];
    snap.forEach((d) => list.push(d.data() as User));
    return list;
  } catch (e) {
    console.error('Error direct fetching users from Firestore:', e);
    return [];
  }
};

// Seed database on first startup if empty
export const seedInitialFirestoreData = async (
  defaultUsers: User[],
  defaultGateways: Record<string, GatewayConfigItem>,
  defaultSettings: PlatformSettings
) => {
  try {
    const userSnap = await getDocs(collection(db, COLLECTIONS.USERS));
    if (userSnap.empty) {
      const batch = writeBatch(db);
      defaultUsers.forEach(u => {
        batch.set(doc(db, COLLECTIONS.USERS, u.id), u);
      });
      batch.set(doc(db, COLLECTIONS.SETTINGS, 'main_config'), {
        gateways: defaultGateways,
        settings: defaultSettings
      });
      await batch.commit();
      console.log('Firebase Firestore initialized with default data & Super Admin.');
    }
  } catch (e) {
    console.warn('Initial Firestore seed check:', e);
  }
};
