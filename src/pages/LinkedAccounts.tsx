import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assets
import bgDarkMode from "@/assets/bg-dark-mode.png";
import bankContainerBg from "@/assets/bank-acc-containers.png";
import checkBoxSelected from "@/assets/check-box-selected.png";
import checkBoxBlank from "@/assets/check-box-outline-blank.png";

// Utils
import { AVAILABLE_BANKS } from "@/utils/bankUtils";

const LinkedAccounts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  const mobile = location.state?.mobile || "9876543210";

  const maskMobile = (num: string) => {
    if (!num || num.length < 7) return num;
    const prefix = num.substring(0, 2);
    const suffix = num.substring(7);
    return `${prefix}*****${suffix}`;
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((accId) => accId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedAccountIds.length === AVAILABLE_BANKS.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(AVAILABLE_BANKS.map((acc) => acc.id));
    }
  };

  const handleAddAccounts = () => {
    const accountsToAdd = AVAILABLE_BANKS.filter(acc => selectedAccountIds.includes(acc.id));
    navigate("/banking", { state: { accountsAdded: true, selectedAccounts: accountsToAdd } });
  };

  const isAllSelected = selectedAccountIds.length === AVAILABLE_BANKS.length && AVAILABLE_BANKS.length > 0;

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col relative safe-area-top safe-area-bottom overflow-hidden"
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
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 mt-8 overflow-y-auto overscroll-y-none scrollbar-hide pb-32">
        <p className="text-white text-[16px] font-medium leading-relaxed mb-6">
          Linked accounts found for +91 {maskMobile(mobile)}. Pick your primary bank account — or select all and let us handle the rest.
        </p>

        {/* Unified Container */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `url(${bankContainerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Container Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <span className="text-white text-[16px] font-medium">
              Linked Bank Accounts ({AVAILABLE_BANKS.length})
            </span>
            <img
              src={isAllSelected ? checkBoxSelected : checkBoxBlank}
              alt="select all"
              className="w-6 h-6 cursor-pointer"
              onClick={toggleAll}
            />
          </div>

          {/* Account List */}
          <div>
            {AVAILABLE_BANKS.map((account, index) => {
              const isSelected = selectedAccountIds.includes(account.id);
              // Calculate last 4 for display
              const last4 = account.accountNumber.slice(-4);

              return (
                <div key={account.id}>
                  <div
                    className="flex items-center px-5 py-4 cursor-pointer"
                    onClick={() => toggleAccount(account.id)}
                  >
                     {/* Checkbox */}
                    <img
                      src={isSelected ? checkBoxSelected : checkBoxBlank}
                      alt="checkbox"
                      className="w-6 h-6 shrink-0 mr-4"
                    />

                    {/* Logo */}
                    <div className="w-[42px] h-[42px] bg-white rounded-[10px] flex items-center justify-center shrink-0 overflow-hidden mr-4">
                      <img
                        src={account.logo}
                        alt={account.bankName}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-white text-[15px] font-medium">
                        {account.bankName} | {account.accountType}
                      </h3>
                      <p className="text-white/40 text-[13px] mt-0.5">
                        Account number ending with {last4}
                      </p>
                    </div>
                  </div>
                  {/* Divider (except for last item) */}
                  {index < AVAILABLE_BANKS.length - 1 && (
                    <div className="h-[1px] bg-white/10 mx-5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-0 w-full px-5 flex justify-center z-20">
        <Button
          variant="gradient"
          className="w-full h-[48px] rounded-full text-[18px] font-medium transition-opacity duration-200"
          disabled={selectedAccountIds.length === 0}
          onClick={handleAddAccounts}
        >
          Add Bank Account
        </Button>
      </div>
    </div>
  );
};

export default LinkedAccounts;
