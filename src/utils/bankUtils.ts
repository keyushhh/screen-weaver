import hdfcLogo from "@/assets/hdfc-bank-logo.png";
import idfcLogo from "@/assets/idfc-bank-logo.png";
import axisLogo from "@/assets/axis-bank-logo.png";
import kotakLogo from "@/assets/kotak-bank-logo.png";

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  logo: string;
  isDefault: boolean;
  backgroundIndex?: number;
}

const STORAGE_KEY = "dotpe_user_bank_accounts";

// Export available banks for the Linked Accounts flow
export const AVAILABLE_BANKS: BankAccount[] = [
  {
    id: "1",
    bankName: "HDFC Bank",
    accountType: "Savings Account",
    accountNumber: "12345678901234",
    ifsc: "HDFC0001234",
    branch: "HDFC Bank, Koramangala Branch",
    logo: hdfcLogo,
    isDefault: false, // Default status handled by logic
  },
  {
    id: "2",
    bankName: "IDFC Bank",
    accountType: "Current Account",
    accountNumber: "98765432109876",
    ifsc: "IDFC0004321",
    branch: "IDFC Bank, Indiranagar Branch",
    logo: idfcLogo,
    isDefault: false,
  },
  {
    id: "3",
    bankName: "Axis Bank",
    accountType: "Savings Account",
    accountNumber: "45612378901234",
    ifsc: "UTIB0001234",
    branch: "Axis Bank, Indiranagar Branch",
    logo: axisLogo,
    isDefault: false,
  },
  {
    id: "4",
    bankName: "Kotak Bank",
    accountType: "Savings Account",
    accountNumber: "78901234561234",
    ifsc: "KKBK0001234",
    branch: "Kotak Mahindra Bank, Koramangala Branch",
    logo: kotakLogo,
    isDefault: false,
  }
];

export const getBankAccounts = (): BankAccount[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBankAccounts = (accounts: BankAccount[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

export const addSelectedAccounts = (newAccounts: BankAccount[]) => {
  const existing = getBankAccounts();

  // Filter out duplicates based on ID
  const uniqueNew = newAccounts.filter(na => !existing.some(ea => ea.id === na.id));

  if (uniqueNew.length === 0) return existing;

  const updated = [...existing, ...uniqueNew];

  // Ensure one default exists if we have accounts
  if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
  }

  saveBankAccounts(updated);
  return updated;
};

export const removeBankAccount = (id: string) => {
  const accounts = getBankAccounts();
  const updated = accounts.filter((acc) => acc.id !== id);

  if (updated.length > 0 && accounts.find(a => a.id === id)?.isDefault) {
      updated[0].isDefault = true;
  }

  saveBankAccounts(updated);
  return updated;
};

export const setDefaultBankAccount = (id: string) => {
  const accounts = getBankAccounts();
  const updated = accounts.map(acc => ({
    ...acc,
    isDefault: acc.id === id
  }));
  saveBankAccounts(updated);
  return updated;
};
