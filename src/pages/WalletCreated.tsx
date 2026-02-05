import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import walletCardBg from "@/assets/wallet - card.png";
import diamondIcon from "@/assets/diamond.png";
import settingsIcon from "@/assets/settings.svg";
import buttonAddMoney from "@/assets/button-add-money.png";
import buttonPrimary from "@/assets/button-primary-wide.png";

const WalletCreated = () => {
    const navigate = useNavigate();

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
            {/* Header Container */}
            <div className="shrink-0 flex items-center justify-between w-full px-5 pt-4 pb-2 z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                {/* Title */}
                <h1 className="text-white text-[20px] font-medium font-sans">
                    Wallet
                </h1>

                {/* Settings Button */}
                <button
                    onClick={() => navigate('/settings')}
                    className="w-10 h-10 flex items-center justify-center"
                >
                    <img src={settingsIcon} alt="Settings" className="w-6 h-6" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 w-full px-5 pt-4 overflow-y-auto no-scrollbar">

                {/* Wallet Card */}
                {/* Increased height to 240px to accommodate larger icon and text */}
                <div className="w-full relative mx-auto" style={{ width: '100%', maxWidth: '360px', height: '232px' }}>
                    {/* Card Background */}
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `url('${walletCardBg}')`,
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: '20px'
                        }}
                    />

                    {/* Card Content */}
                    {/* Reduced horizontal padding to px-5 to give more space for text */}
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

                        {/* Decreased spacing from 17px to 12px */}
                        <div className="flex items-center justify-between mt-[12px]">
                            <span className="text-white text-[34px] font-bold font-sans">
                                ₹ 0.00
                            </span>
                        </div>

                        <div className="mt-[8px]">
                            <span className="text-white/80 text-[14px] font-medium font-sans">
                                Limit: ₹ 5,000.00
                            </span>
                        </div>

                        {/* Helper Text with strict 2-line layout */}

                        <div className="mt-[16px]">
                            <p className="text-white/90 text-[13px] font-medium font-sans leading-tight tracking-tight">
                                Uh ho! Looks like a little empty here, let’s fix that?<br />
                                Press the button below!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Important Section */}
                <div
                    className="mt-5 w-full mx-auto relative flex flex-col justify-center px-[19px] py-[9px]"
                    style={{
                        maxWidth: '362px',
                        minHeight: '81px',
                        backgroundColor: 'rgba(25, 25, 25, 0.31)',
                        borderRadius: '13px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <h3 className="text-white text-[14px] font-medium font-sans mb-1">
                        Important:
                    </h3>
                    <p className="text-white text-[14px] font-normal font-sans leading-snug">
                        You need to add money to your wallet to place an order.
                    </p>
                </div>

                {/* Transaction History */}
                <div className="mt-5 w-full mx-auto" style={{ maxWidth: '362px' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white text-[16px] font-medium font-sans">
                            Transaction History
                        </h2>
                        <button className="text-[#3B82F6] text-[14px] font-medium font-sans">
                            View All
                        </button>
                    </div>

                    {/* Placeholder */}
                    <div className="w-full py-10 flex items-center justify-center">
                        <p className="text-[#878787] text-[14px] font-normal font-sans text-center px-10">
                            This screen’s more empty than<br />
                            your promises to go to the gym.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="shrink-0 px-5 pb-[30px] pt-4 w-full bg-transparent">
                <button
                    onClick={() => navigate('/wallet-add-money', { state: { balance: "0.00" } })}
                    className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans"
                    style={{
                        backgroundImage: `url(${buttonPrimary})`,
                        backgroundSize: "100% 100%",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    Add Money
                </button>
            </div>
        </div>
    );
};

export default WalletCreated;
