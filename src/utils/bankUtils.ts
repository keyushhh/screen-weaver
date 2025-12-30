import hdfcLogo from "@/assets/hdfc-bank.png";
import idfcLogo from "@/assets/idfc-bank.png";

export interface BankAccount {
  id: string;
  bankName: string; // e.g., "HDFC Bank"
  accountType: string; // e.g., "Savings Account"
  accountNumber: string; // Full account number
  ifsc: string;
  branch: string;
  logo: string;
  isDefault: boolean;
  backgroundIndex?: number; // For future multi-bg support, currently default only
}

const STORAGE_KEY = "dotpe_user_bank_accounts";

// Mock data for initial population
const MOCK_ACCOUNTS: BankAccount[] = [
  {
    id: "1",
    bankName: "HDFC Bank",
    accountType: "Savings Account",
    accountNumber: "12345678901234",
    ifsc: "HDFC0001234",
    branch: "HDFC Bank, Koramangala Branch",
    logo: hdfcLogo,
    isDefault: true,
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
      bankName: "HDFC Bank",
      accountType: "Savings Account",
      accountNumber: "56789012345678",
      ifsc: "HDFC0001234",
      branch: "HDFC Bank, Koramangala Branch",
      logo: hdfcLogo,
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

export const addMockAccounts = () => {
    // Only add if empty to prevent duplicates on re-runs
    const existing = getBankAccounts();
    if (existing.length === 0) {
        saveBankAccounts(MOCK_ACCOUNTS);
        return MOCK_ACCOUNTS;
    }
    return existing;
};

export const removeBankAccount = (id: string) => {
  const accounts = getBankAccounts();
  const updated = accounts.filter((acc) => acc.id !== id);

  // If we removed the default account, make the first one default
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
