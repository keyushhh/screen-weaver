import { useState } from "react";
import { Eye, EyeOff, ChevronDown, Plus } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import iconOrderCash from "@/assets/icon-order-cash.png";
import iconWallet from "@/assets/icon-wallet.png";
import iconFxConvert from "@/assets/icon-fx-convert.png";
import iconGift from "@/assets/icon-gift.png";
import bannerBg from "@/assets/banner-bg-new.png";
import bannerImage from "@/assets/banner-image.png";
import navPlusButton from "@/assets/nav-plus-button.png";
import navbarBg from "@/assets/navbar-bg.png";
import navHome from "@/assets/nav-home.svg";
import navCards from "@/assets/nav-cards.svg";
import navRewards from "@/assets/nav-rewards.svg";
import navMore from "@/assets/nav-more.svg";
import buttonAddMoney from "@/assets/button-add-money.png";
import avatarImg from "@/assets/avatar.png";
const Homepage = () => {
  const [showBalance, setShowBalance] = useState(false);
  const balance = "0.00";
  return <div className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom" style={{
    backgroundColor: '#0a0a12',
    backgroundImage: `url(${bgDarkMode})`,
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    backgroundRepeat: 'no-repeat'
  }}>
      {/* Header */}
      <div className="px-5 pt-4 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[12px] text-muted-foreground font-medium tracking-wider">DELIVERING</p>
          <button className="flex items-center gap-1 text-foreground text-[14px] font-normal">
            Add Address
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <img src={avatarImg} alt="Profile" className="w-12 h-12 rounded-full" />
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
        <button className="flex items-center justify-center gap-2 px-6 py-3 text-foreground text-[14px] font-medium h-12 w-[180px]" style={{
        backgroundImage: `url(${buttonAddMoney})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
          <Plus className="w-4 h-4" />
          Add Money
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-6 mt-8 px-5">
        {[{
        icon: iconOrderCash,
        label: "Order Cash"
      }, {
        icon: iconWallet,
        label: "Wallet"
      }, {
        icon: iconFxConvert,
        label: "FX Convert"
      }].map(action => <button key={action.label} className="flex flex-col items-center gap-2">
            <img src={action.icon} alt={action.label} className="w-[52px] h-[52px]" />
            <span className="text-foreground text-[12px]">{action.label}</span>
          </button>)}
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
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 h-full" style={{
        backgroundImage: `url(${navbarBg})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
        
        {/* Content */}
        <div className="relative px-5 py-3">
          <div className="flex-row flex items-end justify-between py-[10px]">
            <button className="flex-col gap-1 flex-1 flex items-center justify-center">
              <img src={navHome} alt="Home" className="w-6 h-6" />
              <span className="text-foreground text-[10px]">HOME</span>
            </button>
            <button className="flex-col gap-1 flex-1 flex items-center justify-center">
              <img src={navCards} alt="Cards" className="w-6 h-6" />
              <span className="text-muted-foreground text-[10px]">CARDS</span>
            </button>
            <button className="flex-1 flex items-center justify-center">
              <img src={navPlusButton} alt="Add" className="w-12 h-12" />
            </button>
            <button className="flex-col gap-1 flex-1 flex items-center justify-center">
              <img src={navRewards} alt="Rewards" className="w-6 h-6" />
              <span className="text-muted-foreground text-[10px]">REWARDS</span>
            </button>
            <button className="flex-col gap-1 flex-1 flex items-center justify-center">
              <img src={navMore} alt="More" className="w-6 h-6" />
              <span className="text-muted-foreground text-[10px]">MORE</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Homepage;