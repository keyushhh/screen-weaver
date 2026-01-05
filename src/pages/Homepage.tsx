import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import addIcon from "@/assets/add.png";
import iconWallet from "@/assets/icon-wallet.png";
import iconFxConvert from "@/assets/icon-fx-convert.png";
import iconGift from "@/assets/icon-gift.png";
import orderCashBg from "@/assets/order-cash-button-bg.png";
import iconOrderCash from "@/assets/icon-order-cash.png";
import bannerBg from "@/assets/banner-bg-new.png";
import bannerImage from "@/assets/banner-image.png";
import avatarImg from "@/assets/avatar.png";
import BottomNavigation from "@/components/BottomNavigation";

const Homepage = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const balance = "0.00";
  return (
  <div
    className="h-full w-full overflow-y-auto overscroll-y-none flex flex-col safe-area-top safe-area-bottom pb-[96px]"
    style={{
      backgroundColor: "#0a0a12",
      backgroundImage: `url(${bgDarkMode})`,
      backgroundSize: "cover",
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat",
    }}
  >

      {/* Header */}
      <div className="px-5 pt-4 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[12px] text-muted-foreground font-medium tracking-wider">DELIVERING</p>
          <button className="flex items-center gap-1 text-foreground text-[14px] font-normal">
            Add Address
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <button onClick={() => navigate('/settings')}>
          <img src={avatarImg} alt="Profile" className="w-12 h-12 rounded-full" />
        </button>
      </div>

      {/* Balance Section */}
      <div className="flex flex-col items-center mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-[14px]">Available Balance</p>
          <button onClick={() => setShowBalance(!showBalance)} className="p-1">
            {showBalance ? <Eye className="w-5 h-5 text-muted-foreground" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
          </button>
        </div>
        <p className="text-foreground text-[32px] font-semibold">
          ₹{showBalance ? balance : "******"}
        </p>
        <button
          className="flex items-center justify-center gap-2 px-6 py-3 text-foreground text-[14px] font-medium h-12 w-[180px]"
          style={{
            backgroundImage: `url(${orderCashBg})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <img src={iconOrderCash} alt="Order Cash" className="w-[22px] h-[22px]" />
          Order Cash
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-6 mt-8 px-5">
        {/* Add Money - Custom Circle Button */}
        <button className="flex flex-col items-center gap-2">
          <div className="w-[52px] h-[52px] rounded-full bg-black flex items-center justify-center border border-white/10">
            <img src={addIcon} alt="Add" className="w-[22px] h-[22px]" />
          </div>
          <span className="text-foreground text-[12px]">Add Money</span>
        </button>

        {/* Other Actions */}
        {[{
          icon: iconWallet,
          label: "Wallet"
        }, {
          icon: iconFxConvert,
          label: "FX Convert"
        }].map(action => (
          <button key={action.label} className="flex flex-col items-center gap-2">
            <img src={action.icon} alt={action.label} className="w-[52px] h-[52px]" />
            <span className="text-foreground text-[12px]">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Referral Banner */}
      <div className="mx-5 mt-6">
        <div className="rounded-2xl overflow-hidden flex" style={{
        backgroundImage: `url(${bannerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
          <div className="flex-1 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <img src={iconGift} alt="Gift" className="w-5 h-5" />
            </div>
            <h3 className="text-foreground text-[16px] font-semibold mb-1">Refer & Earn!</h3>
            <p className="text-muted-foreground text-[12px]">Earn ₹50 on each referral</p>
          </div>
          <img src={bannerImage} alt="Referral" className="w-[160px] h-[104px] object-cover rounded-r-2xl" />
        </div>
        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-muted" />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mx-5 mt-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground text-[16px] font-medium">Recent Transactions</h3>
          <button disabled className="text-primary/50 text-[14px] cursor-not-allowed">
            View All
          </button>
        </div>
        <div className="border-t border-white/10 pt-6">
          <p className="text-muted-foreground text-[14px] text-center">
            Your recent transactions will show up here
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />

    </div>);
};
export default Homepage;