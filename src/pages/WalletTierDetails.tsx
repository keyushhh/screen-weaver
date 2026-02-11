import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { tiers } from "@/lib/walletTiers";

const WalletTierDetails = () => {
    const { tierId } = useParams<{ tierId: string }>();
    const navigate = useNavigate();
    const currentTier = tiers.find(t => t.name.toLowerCase() === tierId?.toLowerCase());

    if (!currentTier) return null;

    return (
        <div className="h-full w-full bg-black text-white flex flex-col relative overflow-y-auto no-scrollbar font-satoshi safe-area-top safe-area-bottom">

            {/* Header Section */}
            <div className="relative w-full shrink-0">
                <img
                    src={currentTier.headerImage}
                    alt={currentTier.name}
                    className="w-full h-auto object-cover block"
                />

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-5 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md z-50 active:scale-95 transition-transform border border-white/10"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                {/* Header Text Overlay */}
                <div className="absolute bottom-8 left-6 right-6 z-20">
                     <h1 className="text-white text-[32px] font-bold uppercase tracking-wide mb-1 drop-shadow-lg">
                        {currentTier.headerTitle}
                     </h1>
                     <p className="text-white/90 text-[18px] font-medium drop-shadow-md">
                        {currentTier.headerSubtitle}
                     </p>
                </div>
            </div>

            {/* Info Section */}
            <div
                className="flex-1 w-full relative flex flex-col -mt-6 pt-10 pb-8 px-6 z-10"
                style={{
                    backgroundImage: `url(${currentTier.infoBg})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '500px'
                }}
            >
                {/* Info List */}
                <div className="space-y-6 mb-8">
                    {/* Verification */}
                    <div>
                        <p className="text-white/50 text-[13px] font-medium uppercase mb-1 tracking-wider">Verification</p>
                        <p className="text-white text-[16px] font-medium">{currentTier.verification}</p>
                    </div>

                    {/* Wallet Limit */}
                    <div>
                        <p className="text-white/50 text-[13px] font-medium uppercase mb-1 tracking-wider">Wallet limit</p>
                        <p className="text-white text-[16px] font-medium">{currentTier.walletLimit}</p>
                    </div>

                    {/* Daily Top Up Limit */}
                    <div>
                        <p className="text-white/50 text-[13px] font-medium uppercase mb-1 tracking-wider">Daily top up limit</p>
                        <p className="text-white text-[16px] font-medium">{currentTier.dailyTopUpLimit}</p>
                    </div>

                    {/* Withdrawals */}
                    <div>
                        <p className="text-white/50 text-[13px] font-medium uppercase mb-1 tracking-wider">Withdrawals</p>
                        <p className="text-white text-[16px] font-medium">{currentTier.withdrawals}</p>
                    </div>

                    {/* Limitations */}
                    <div>
                        <p className="text-white/50 text-[13px] font-medium uppercase mb-1 tracking-wider">Limitations</p>
                        <p className="text-white text-[16px] font-medium leading-relaxed opacity-90">{currentTier.limitations}</p>
                    </div>
                </div>

                {/* Downgrade Options - Conditional if present, or generic */}
                 <div className="mb-8">
                    <p className="text-white/50 text-[13px] font-medium uppercase mb-1 tracking-wider">Downgrade Options</p>
                    <p className="text-white text-[16px] font-medium">{currentTier.downgradeOptions || "Anytime"}</p>
                 </div>

                {/* Note Container */}
                <div className="bg-[#1C1C1E] rounded-[16px] p-5 mb-8 border border-white/5">
                    <p className="text-[#A4A4A4] text-[14px] font-medium leading-relaxed">
                        <span className="text-white font-bold block mb-2">Note:</span>
                        {currentTier.note}
                    </p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate(currentTier.buttonAction)}
                    className="w-full h-[52px] rounded-full bg-[#6C72FF] text-white text-[16px] font-bold active:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-[#6C72FF]/20"
                >
                    {currentTier.buttonText}
                </button>
            </div>
        </div>
    );
};

export default WalletTierDetails;
