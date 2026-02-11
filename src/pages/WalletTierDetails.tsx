import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import { tiers } from "@/lib/walletTiers";

// Import expansion images
import starterImg from "@/assets/wallet-starter.png";
import proImg from "@/assets/pro-expand.png";
import eliteImg from "@/assets/elite-expand.png";
import supremeImg from "@/assets/supreme-expand.png";

const WalletTierDetails = () => {
    const { tierId } = useParams<{ tierId: string }>();
    const navigate = useNavigate();

    const tierImages: Record<string, string> = {
        starter: starterImg,
        pro: proImg,
        elite: eliteImg,
        supreme: supremeImg
    };

    const currentTier = tiers.find(t => t.name.toLowerCase() === tierId?.toLowerCase());
    const currentImage = tierId ? tierImages[tierId.toLowerCase()] : null;

    if (!currentTier || !currentImage) {
        return (
             <div className="h-full w-full bg-black text-white flex flex-col items-center justify-center safe-area-top safe-area-bottom">
                <p>Tier not found</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-500">Go Back</button>
             </div>
        );
    }

    return (
        <div
            className="h-full w-full overflow-hidden flex flex-col safe-area-top safe-area-bottom"
            style={{
                fontFamily: "'Satoshi', sans-serif",
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="shrink-0 relative flex items-center justify-center w-full px-5 pt-6 pb-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-95 transition-transform"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-white text-[22px] font-medium tracking-normal text-center uppercase">
                    {currentTier.name} Wallet
                </h1>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center pt-8 pb-8 px-5">

                 {/* Tier Image */}
                 <img
                    src={currentImage}
                    alt={`${currentTier.name} details`}
                    className="w-full h-auto object-contain max-w-[340px] mb-8"
                 />

                 {/* Details Container */}
                 <div className="w-full rounded-[20px] bg-white/5 backdrop-blur-md p-6 border border-white/10 flex flex-col gap-5">

                    {/* Verification */}
                    <div>
                        <p className="text-white/50 text-[14px] font-medium mb-1">
                            Verification
                        </p>
                        <p className="text-white text-[16px] font-medium">
                            {currentTier.verification}
                        </p>
                    </div>

                    {/* Wallet Limit */}
                    <div>
                        <p className="text-white/50 text-[14px] font-medium mb-1">
                            Wallet limit
                        </p>
                        <p className="text-white text-[16px] font-medium">
                            {currentTier.walletLimit}
                        </p>
                    </div>

                    {/* Withdraw Limit */}
                    <div>
                        <p className="text-white/50 text-[14px] font-medium mb-1">
                            Withdraw limit
                        </p>
                        <p className="text-white text-[16px] font-medium">
                            {currentTier.withdrawLimit}
                        </p>
                    </div>

                    {/* Limitations */}
                    <div>
                        <p className="text-white/50 text-[14px] font-medium mb-1">
                            Limitations
                        </p>
                        <p className="text-white text-[16px] font-medium leading-snug">
                            {currentTier.limitations}
                        </p>
                    </div>
                 </div>

                 {/* CTA */}
                 <button
                    onClick={() => navigate('/wallet-settings')}
                    className="mt-8 w-full h-[52px] rounded-full bg-[#6C72FF] text-white text-[16px] font-bold active:scale-95 transition-transform"
                 >
                    Compare Plans
                 </button>

            </div>
        </div>
    );
};

export default WalletTierDetails;
