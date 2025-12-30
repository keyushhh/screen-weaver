import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assets
import bgDarkMode from "@/assets/bg-dark-mode.png";
import bankContainerBg from "@/assets/bank-acc-containers.png";
import hdfcLogo from "@/assets/hdfc-bank.png";
import idfcLogo from "@/assets/idfc-bank.png";
import checkBoxSelected from "@/assets/check-box-selected.png";
import checkBoxBlank from "@/assets/check-box-outline-blank.png";

interface Account {
  id: string;
  bankName: string;
  accountType: string;
  last4: string;
  logo: string;
}

const MOCK_ACCOUNTS: Account[] = [
  {
    id: "1",
    bankName: "HDFC Bank",
    accountType: "Savings A/c",
    last4: "8899",
    logo: hdfcLogo,
  },
  {
    id: "2",
    bankName: "IDFC Bank",
    accountType: "Savings A/c",
    last4: "4455",
    logo: idfcLogo,
  },
];

const LinkedAccounts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  // Default to a placeholder if accessed directly (though typically accessed via AddBank)
  const mobile = location.state?.mobile || "9876543210";

  const maskMobile = (num: string) => {
    if (!num || num.length < 7) return num;
    // Mask 5 digits starting from index 2 (3rd digit)
    const prefix = num.substring(0, 2);
    const suffix = num.substring(7);
    return `${prefix}*****${suffix}`;
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((accId) => accId !== id) : [...prev, id]
    );
  };

  const handleAddAccounts = () => {
    // Navigate to Banking list (simulating success)
    navigate("/banking", { state: { accountsAdded: true } });
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col relative safe-area-top safe-area-bottom overflow-hidden"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between shrink-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">
          Linked Bank Accounts
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 mt-8 overflow-y-auto scrollbar-hide pb-32">
        <p className="text-white text-[16px] font-medium leading-relaxed mb-6">
          Linked accounts found for +91 {maskMobile(mobile)}. Pick your primary bank account — or select all and let us handle the rest.
        </p>

        <div className="space-y-4">
          {MOCK_ACCOUNTS.map((account) => {
            const isSelected = selectedAccounts.includes(account.id);
            return (
              <div
                key={account.id}
                className="relative h-[88px] w-full rounded-2xl flex items-center px-4"
                style={{
                  backgroundImage: `url(${bankContainerBg})`,
                  backgroundSize: "cover", // Or "100% 100%" if strict dimensions needed
                  backgroundPosition: "center",
                }}
                onClick={() => toggleAccount(account.id)}
              >
                {/* Logo Container */}
                <div className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden z-10">
                  <img
                    src={account.logo}
                    alt={account.bankName}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                {/* Divider */}
                <div className="h-[40px] w-[1px] bg-white/10 mx-4 shrink-0" />

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-white text-[16px] font-bold">
                    {account.bankName}
                  </h3>
                  <p className="text-white/60 text-[13px]">
                    {account.accountType} ... {account.last4}
                  </p>
                </div>

                {/* Checkbox */}
                <img
                  src={isSelected ? checkBoxSelected : checkBoxBlank}
                  alt="checkbox"
                  className="w-6 h-6 shrink-0 transition-opacity duration-200"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-0 w-full px-5 flex justify-center z-20">
        <Button
          variant="gradient"
          className="w-full h-[48px] rounded-full text-[18px] font-medium transition-opacity duration-200"
          disabled={selectedAccounts.length === 0}
          onClick={handleAddAccounts}
        >
          Add Bank Account
        </Button>
      </div>
    </div>
  );
};

export default LinkedAccounts;
