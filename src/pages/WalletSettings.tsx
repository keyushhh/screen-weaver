import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import freeChip from "@/assets/free chip.png";
import proChip from "@/assets/pro chip.png";
import eliteChip from "@/assets/elite chip.png";
import supremeChip from "@/assets/supreme chip.png";
import tierCardActive from "@/assets/tier card.png";
import tierCardInactive from "@/assets/non selected card.png";

const WalletSettings = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [activeTier, setActiveTier] = useState('Starter');

    // This data would ideally come from an API or configuration
    const tiers = [
        {
            name: 'Starter',
            badge: 'Free',
            badgeColor: 'bg-white/10 text-white',
            chip: freeChip,
            walletLimit: '₹ 5,000',
            withdrawLimit: '₹ 5,000',
            verification: 'Mobile number, basic information',
            limitations: 'Add money cooldown, withdraw cannot exceed ₹5,000 a day.',
            color: '#FFD700' // Gold/Yellow
        },
        {
            name: 'Pro',
            badge: '₹25/month',
            badgeColor: 'bg-white/10 text-white',
            chip: proChip,
            walletLimit: '₹ 15,000',
            withdrawLimit: '₹ 10,000',
            verification: 'PAN, Address proof',
            limitations: 'Add money cooldown, withdraw cannot exceed ₹10,000 a day.',
            color: '#4B69FF' // Blue
        },
        {
            name: 'Elite',
            badge: '₹100/month',
            badgeColor: 'bg-white/10 text-white',
            chip: eliteChip,
            walletLimit: '₹ 1,00,000',
            withdrawLimit: '₹ 50,000',
            verification: 'Video KYC needed',
            limitations: 'Higher limits, priority support.',
            color: '#A020F0' // Purple
        },
        {
            name: 'Supreme',
            badge: 'Invite Only',
            badgeColor: 'bg-white/10 text-white',
            chip: supremeChip,
            walletLimit: 'No limit',
            withdrawLimit: 'No limit',
            verification: 'Physical verification',
            limitations: 'Exclusive benefits, dedicated manager.',
            color: '#FFFFFF' // White/Black
        }
    ];

    const currentTier = tiers.find(t => t.name === 'Starter') || tiers[0];

    return (
        <div
            className="h-full w-full overflow-hidden flex flex-col safe-area-top safe-area-bottom font-sans"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="shrink-0 flex items-center w-full px-5 pt-6 pb-4 z-10 gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-95 transition-transform"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-white text-[20px] font-medium tracking-tight">
                    Wallet Settings
                </h1>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-[40px]">

                {/* Current Tier Summary Card */}
                <div className="px-5 mb-8">
                    <div className="w-full relative rounded-[24px] overflow-hidden bg-[#171717] border border-white/5 p-5 flex flex-col gap-4">
                         {/* Glow Effect */}
                         <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                     {/* Small Icon for current tier */}
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                         <img src={currentTier.chip} alt="" className="w-5 h-5 object-contain" />
                                    </div>
                                    <span className="text-white text-[18px] font-bold tracking-wide uppercase">
                                        {currentTier.name}
                                    </span>
                                </div>
                                <p className="text-[#A4A4A4] text-[14px] font-medium mt-1">
                                    {currentTier.walletLimit} / wallet limit
                                </p>
                            </div>
                        </div>

                        <button className="relative z-10 w-full h-[48px] rounded-[16px] overflow-hidden flex items-center justify-center font-bold text-white text-[16px] active:scale-[0.98] transition-transform">
                             <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
                             <span className="relative z-10">Upgrade Now</span>
                        </button>
                    </div>
                </div>

                {/* Tiers Carousel */}
                <div className="mb-8">
                    {/* Horizontal Scroll Container */}
                    <div className="flex overflow-x-auto no-scrollbar px-5 gap-4 pb-4 snap-x snap-mandatory">
                        {tiers.map((tier) => {
                            const isActive = activeTier === tier.name;
                            return (
                                <div
                                    key={tier.name}
                                    className="snap-center shrink-0 relative flex flex-col transition-all duration-300"
                                    onClick={() => setActiveTier(tier.name)}
                                    style={{
                                        width: '290px',
                                        height: '420px',
                                    }}
                                >
                                    {/* Card Background */}
                                    <div
                                        className="absolute inset-0 w-full h-full rounded-[24px] overflow-hidden transition-all duration-300"
                                        style={{
                                            backgroundImage: `url('${isActive ? tierCardActive : tierCardInactive}')`,
                                            backgroundSize: '100% 100%',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    />

                                    {/* Card Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col z-10">
                                        {/* Top Row: Badge & Chip */}
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`px-3 py-1.5 rounded-full backdrop-blur-md text-[12px] font-medium tracking-wide ${tier.badgeColor} border border-white/10`}>
                                                {tier.badge}
                                            </div>
                                            <img
                                                src={tier.chip}
                                                alt={`${tier.name} chip`}
                                                className="w-16 h-16 object-contain drop-shadow-2xl"
                                            />
                                        </div>

                                        {/* Tier Name */}
                                        <h3 className={`text-[22px] font-black tracking-wide uppercase mb-6 ${isActive ? 'text-white' : 'text-[#A4A4A4]'}`}>
                                            {tier.name} Wallet
                                        </h3>

                                        {/* Details Grid */}
                                        <div className="flex flex-col gap-4 mt-2">
                                            <div>
                                                <p className="text-[#7E7E7E] text-[11px] font-bold uppercase tracking-wider mb-1">Verification</p>
                                                <p className={`text-[13px] font-medium leading-tight ${isActive ? 'text-white' : 'text-[#A4A4A4]'}`}>{tier.verification}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-[#7E7E7E] text-[11px] font-bold uppercase tracking-wider mb-1">Wallet limit</p>
                                                    <p className={`text-[14px] font-bold ${isActive ? 'text-white' : 'text-[#A4A4A4]'}`}>{tier.walletLimit}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#7E7E7E] text-[11px] font-bold uppercase tracking-wider mb-1">Withdraw limit</p>
                                                    <p className={`text-[14px] font-bold ${isActive ? 'text-white' : 'text-[#A4A4A4]'}`}>{tier.withdrawLimit}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 pt-3 border-t border-white/5">
                                                 <p className="text-[#7E7E7E] text-[11px] font-bold uppercase tracking-wider mb-1">Limitations</p>
                                                 <p className="text-[#666666] text-[11px] font-medium leading-snug">{tier.limitations}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info Sections */}
                <div className="px-5 flex flex-col gap-4">
                    {/* How to Upgrade */}
                    <div className="bg-[#171717] rounded-[24px] p-6 border border-white/5">
                        <h3 className="text-white text-[16px] font-bold mb-4 tracking-tight">
                            How to Upgrade?
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#A4A4A4] mt-2 shrink-0" />
                                <p className="text-[#A4A4A4] text-[14px] font-medium leading-relaxed">
                                    Complete your KYC to upgrade your wallet limit.
                                </p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#A4A4A4] mt-2 shrink-0" />
                                <p className="text-[#A4A4A4] text-[14px] font-medium leading-relaxed">
                                    Add money to your wallet to upgrade your wallet limit.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Why Limits */}
                    <div className="bg-[#171717] rounded-[24px] p-6 border border-white/5">
                        <h3 className="text-white text-[16px] font-bold mb-4 tracking-tight">
                            Why Limits?
                        </h3>
                         <div className="flex flex-col gap-3">
                            <div className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#A4A4A4] mt-2 shrink-0" />
                                <p className="text-[#A4A4A4] text-[14px] font-medium leading-relaxed">
                                     As per RBI guidelines, non-KYC users have a monthly limit of ₹10,000.
                                </p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#A4A4A4] mt-2 shrink-0" />
                                <p className="text-[#A4A4A4] text-[14px] font-medium leading-relaxed">
                                     KYC users have a monthly limit of ₹1,00,000.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletSettings;
