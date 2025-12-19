import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CreditCard, Building2, Bell, Moon, LogOut, Shield, Pencil } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import avatarImg from "@/assets/avatar.png";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: '#0a0a12',
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-foreground text-[18px] font-semibold">Settings</h1>
        </div>
        <button className="px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
          <span className="text-foreground text-[14px]">+ Support</span>
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-5 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={avatarImg} alt="Profile" className="w-14 h-14 rounded-full" />
          <div>
            <h2 className="text-foreground text-[16px] font-medium">No Name? Who are you?</h2>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-[14px]">+91 9898989898</span>
              <span className="text-green-500">✓</span>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
          <Pencil className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Security & KYC Card */}
      <div className="mx-5 mt-6">
        <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.4) 0%, rgba(50, 0, 0, 0.6) 100%)', border: '1px solid rgba(139, 0, 0, 0.5)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="text-foreground text-[14px] font-medium">Security & KYC</h3>
              <p className="text-red-400 text-[12px]">Incomplete</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <span className="text-foreground text-[12px]">Check Security</span>
          </button>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="px-5 mt-6">
        <p className="text-muted-foreground text-[12px] font-medium tracking-wider mb-4">PAYMENT SETTINGS</p>
        
        <button className="w-full flex items-center justify-between py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <div className="text-left">
              <p className="text-foreground text-[14px]">Linked Cards</p>
              <p className="text-muted-foreground text-[12px]">0 cards linked</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button className="w-full flex items-center justify-between py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div className="text-left">
              <p className="text-foreground text-[14px]">Bank Account Info</p>
              <p className="text-muted-foreground text-[12px]">0 bank accounts linked</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* App Preferences */}
      <div className="px-5 mt-6">
        <p className="text-muted-foreground text-[12px] font-medium tracking-wider mb-4">APP PREFERENCES</p>
        
        <div className="py-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <p className="text-foreground text-[14px]">Notifications</p>
          </div>
          <div className="ml-8 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[14px]">Push Notifications</p>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[14px]">Transaction Alerts</p>
              <Switch checked={transactionAlerts} onCheckedChange={setTransactionAlerts} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-muted-foreground" />
            <p className="text-foreground text-[14px]">Dark Mode</p>
          </div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        <button className="w-full flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-muted-foreground" />
            <p className="text-foreground text-[14px]">Log Out</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Footer Logo */}
      <div className="flex-1" />
      <div className="px-5 pb-8 opacity-40">
        <p className="text-foreground text-[24px] font-bold">dot.pe</p>
        <p className="text-foreground text-[12px] italic">This is not where you find love.</p>
      </div>
    </div>
  );
};

export default Settings;
