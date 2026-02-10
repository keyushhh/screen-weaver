import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import walletCardBg from "@/assets/wallet - card.png";
import diamondIcon from "@/assets/diamond.png";
import freeChip from "@/assets/free chip.png";
import proChip from "@/assets/pro chip.png";
import eliteChip from "@/assets/elite chip.png";
import supremeChip from "@/assets/supreme chip.png";
import tierCardActive from "@/assets/tier card.png";
import tierCardInactive from "@/assets/non selected card.png";

const WalletSettings = () => {
    const navigate = useNavigate();
    const { walletBalance } = useUser();
    const [activeTier, setActiveTier] = useState('Starter');

    const tiers = [
        {
            name: 'Starter',
            chip: freeChip,
            limit: '₹5,000',
            verification: 'No verification needed',
            fees: '2% Transaction fee',
            color: '#FFFFFF'
        },
        {
            name: 'Pro',
            chip: proChip,
            limit: '₹10,000',
            verification: 'Minimum KYC needed',
            fees: '1.5% Transaction fee',
            color: '#A4A4A4'
        },
        {
            name: 'Elite',
            chip: eliteChip,
            limit: '₹1,00,000',
            verification: 'Video KYC needed',
            fees: '1% Transaction fee',
            color: '#A4A4A4'
        },
        {
            name: 'Supreme',
            chip: supremeChip,
            limit: 'No limit',
            verification: 'Physical verification',
            fees: '0.5% Transaction fee',
            color: '#A4A4A4'
        }
    ];

    return (
        <div
            className="h-full w-full overflow-hidden flex flex-col safe-area-top safe-area-bottom"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="shrink-0 flex items-center w-full px-5 pt-4 pb-2 z-10 gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-white text-[20px] font-medium font-sans">
                    Wallet Settings
                </h1>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-[40px]">

                {/* Current Wallet Card */}
                <div className="px-5 pt-4 mb-8">
                    <div className="w-full relative mx-auto shrink-0" style={{ width: '100%', maxWidth: '360px', height: '240px' }}>
                        <div
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url('${walletCardBg}')`,
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                borderRadius: '20px'
                            }}
                        />
                        <div className="absolute inset-0 px-5 pt-6 pb-[15px] flex flex-col overflow-hidden">
                            <div className="flex justify-between items-center">
                                <span className="text-white text-[15px] font-medium font-sans">
                                    WALLET BALANCE
                                </span>
                                <img
                                    src={diamondIcon}
                                    alt="Diamond"
                                    className="w-[42px] h-[42px] translate-y-[3px]"
                                />
                            </div>
                            <div className="mt-[12px]">
                                <span className="text-white text-[34px] font-bold font-sans">
                                    ₹ {walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="mt-[8px]">
                                <span className="text-white/80 text-[14px] font-medium font-sans">
                                    Current Tier: Starter
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tiers Section */}
                <div className="mb-8">
                    <h2 className="px-5 text-white text-[18px] font-medium font-sans mb-4">
                        Wallet Tiers
                    </h2>

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
                                        width: '280px',
                                        height: '380px', // Adjusted height based on content
                                    }}
                                >
                                    {/* Card Background */}
                                    <div
                                        className="absolute inset-0 w-full h-full"
                                        style={{
                                            backgroundImage: `url('${isActive ? tierCardActive : tierCardInactive}')`,
                                            backgroundSize: '100% 100%',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    />

                                    {/* Card Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col z-10">
                                        {/* Chip */}
                                        <div className="flex justify-end mb-4">
                                            <img src={tier.chip} alt={`${tier.name} chip`} className="w-12 h-12 object-contain" />
                                        </div>

                                        {/* Tier Name */}
                                        <h3 className={`text-[24px] font-bold font-sans mb-6 ${isActive ? 'text-white' : 'text-[#A4A4A4]'}`}>
                                            {tier.name}
                                        </h3>

                                        {/* Details */}
                                        <div className="flex flex-col gap-4 mt-auto mb-4">
                                            <div>
                                                <p className="text-[#7E7E7E] text-[12px] font-medium font-sans uppercase tracking-wider mb-1">Limit</p>
                                                <p className={`text-[16px] font-medium font-sans ${isActive ? 'text-white' : 'text-[#A4A4A4]'}`}>{tier.limit}</p>
                                            </div>
                                            <div>
                                                <p className="text-[#7E7E7E] text-[12px] font-medium font-sans uppercase tracking-wider mb-1">Requirements</p>
                                                <p className={`text-[14px] font-medium font-sans ${isActive ? 'text-white' : 'text-[#A4A4A4]'}`}>{tier.verification}</p>
                                            </div>
                                            <div>
                                                <p className="text-[#7E7E7E] text-[12px] font-medium font-sans uppercase tracking-wider mb-1">Fees</p>
                                                <p className={`text-[14px] font-medium font-sans ${isActive ? 'text-white' : 'text-[#A4A4A4]'}`}>{tier.fees}</p>
                                            </div>
                                        </div>

                                        {/* Status Indicator (Optional, based on 'active' state logic) */}
                                        {tier.name === 'Starter' && (
                                            <div className="mt-2 py-1 px-3 bg-white/10 rounded-full self-start backdrop-blur-sm border border-white/10">
                                                <span className="text-white text-[12px] font-medium">Current Plan</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info Sections */}
                <div className="px-5 flex flex-col gap-6">
                    {/* How to Upgrade */}
                    <div className="bg-[#171717] rounded-[20px] p-5 border border-white/5">
                        <h3 className="text-white text-[16px] font-medium font-sans mb-2">
                            How to Upgrade?
                        </h3>
                        <p className="text-[#A4A4A4] text-[14px] font-normal font-sans leading-relaxed">
                            To upgrade your wallet tier, complete the necessary verification steps in the Profile section. Higher tiers unlock higher transaction limits and lower fees.
                        </p>
                    </div>

                    {/* Why Limits */}
                    <div className="bg-[#171717] rounded-[20px] p-5 border border-white/5">
                        <h3 className="text-white text-[16px] font-medium font-sans mb-2">
                            Why Limits?
                        </h3>
                        <p className="text-[#A4A4A4] text-[14px] font-normal font-sans leading-relaxed">
                            Limits are in place to ensure security and compliance with regulatory standards. Verifying your identity helps us keep your account safe and unlock more features.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletSettings;
