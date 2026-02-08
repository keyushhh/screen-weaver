import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useUser, WalletTransaction } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import walletCardBg from "@/assets/wallet - card.png";
import diamondIcon from "@/assets/diamond.png";
import settingsIcon from "@/assets/settings.svg";
import buttonPrimary from "@/assets/button-primary-wide.png";

const WalletCreated = () => {
    const navigate = useNavigate();
    const { walletBalance, walletTransactions } = useUser();

    // Get the latest transaction for the card status display
    const latestTx = walletTransactions.length > 0 ? walletTransactions[0] : null;

    const renderStatusIndicator = () => {
        if (!latestTx) {
            return (
                <div className="mt-[16px]">
                    <p className="text-white/90 text-[13px] font-medium font-sans leading-tight tracking-tight">
                        Uh ho! Looks like a little empty here, let’s fix that?<br />
                        Press the button below!
                    </p>
                </div>
            );
        }

        const formattedAmount = latestTx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        let statusColor = "";
        let strokeColor = "";
        let title = "";
        let description = "";

        if (latestTx.type === 'hold') {
            statusColor = "#FACC15"; // Yellow
            strokeColor = "rgba(250, 204, 21, 0.17)";
            title = `On hold - ₹${formattedAmount}`;
            description = `₹${formattedAmount} is currently on hold. It’ll be released after delivery confirmation.`;
        } else if (latestTx.type === 'debit') {
            statusColor = "#D33313"; // Red
            strokeColor = "rgba(211, 51, 19, 0.17)";
            title = `Amount debited - ₹${formattedAmount}`;
            description = `₹${formattedAmount} was debited from your wallet after successful delivery confirmation.`;
        } else if (latestTx.type === 'credit') {
            statusColor = "#5CFF00"; // Green
            strokeColor = "rgba(92, 255, 0, 0.17)";
            title = `Amount Credited - ₹${formattedAmount}`;
            description = `₹${formattedAmount} was added to your wallet via UPI.`;
        } else {
            // Fallback
            return null;
        }

        return (
            <div className="mt-[16px]">
                <div className="flex items-center">
                    {/* Circle Indicator */}
                    <div
                        style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: statusColor,
                            boxShadow: `0 0 0 5px ${strokeColor}`
                        }}
                    />
                    <span className="ml-[13px] text-white text-[14px] font-medium font-sans">
                        {title}
                    </span>
                </div>
                <p className="mt-[10px] text-white text-[12px] font-normal font-sans leading-snug">
                    {description}
                </p>
            </div>
        );
    };

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
            <div className="flex-1 w-full px-5 pt-4 overflow-y-auto no-scrollbar pb-[20px]">

                {/* Wallet Card */}
                {/* Increased height to accommodate larger icon and text logic */}
                <div className="w-full relative mx-auto shrink-0" style={{ width: '100%', maxWidth: '360px', height: '240px' }}>
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

                        <div className="flex items-center justify-between mt-[12px]">
                            <span className="text-white text-[34px] font-bold font-sans">
                                ₹ {walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="mt-[8px]">
                            <span className="text-white/80 text-[14px] font-medium font-sans">
                                Limit: ₹ 5,000.00
                            </span>
                        </div>

                        {/* Dynamic Status Indicator */}
                        {renderStatusIndicator()}
                    </div>
                </div>

                {/* Important Section - Only show if balance is 0 */}
                {walletBalance === 0 && (
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
                )}

                {/* Transaction History */}
                <div className="mt-5 w-full mx-auto mb-[20px]" style={{ maxWidth: '362px' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white text-[16px] font-medium font-sans">
                            Transaction History
                        </h2>
                        <button className="text-[#3B82F6] text-[14px] font-medium font-sans">
                            View All
                        </button>
                    </div>

                    {walletTransactions.length > 0 ? (
                        <div className="w-full flex flex-col gap-[16px]">
                            {/* Headers Row */}
                            <div className="grid grid-cols-[1fr_100px_80px] gap-x-6 px-0 mb-[8px]">
                                <div className="text-[#7E7E7E] text-[12px] font-normal font-sans">Details</div>
                                <div className="text-right text-[#7E7E7E] text-[12px] font-normal font-sans">Price</div>
                                <div className="text-right text-[#7E7E7E] text-[12px] font-normal font-sans">Status</div>
                            </div>

                            {walletTransactions.map(tx => (
                                <div key={tx.id} className="grid grid-cols-[1fr_100px_80px] gap-x-6 items-start">
                                    <div className="flex flex-col">
                                        <span className="text-white text-[13px] font-normal font-sans leading-none mb-[2px]">
                                            {tx.description}
                                        </span>
                                        <span className="text-[#7E7E7E] text-[12px] font-normal font-sans leading-none">
                                            {new Date(tx.date).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-white text-[13px] font-normal font-sans">
                                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[13px] font-normal font-sans capitalize ${tx.status === 'success' ? 'text-[#5CFF00]' :
                                            status === 'failed' ? 'text-[#FF3B30]' : 'text-[#FACC15]'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full py-10 flex items-center justify-center">
                            <p className="text-[#878787] text-[14px] font-normal font-sans text-center px-10">
                                This screen’s more empty than<br />
                                your promises to go to the gym.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="shrink-0 px-5 pb-[30px] pt-4 w-full bg-transparent flex flex-col gap-[12px]">
                <button
                    onClick={() => navigate('/wallet-add-money', { state: { balance: walletBalance.toFixed(2) } })}
                    className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans"
                    style={{
                        backgroundImage: `url(${buttonPrimary})`,
                        backgroundSize: "100% 100%",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    Add Money
                </button>

                {walletBalance > 0 && (
                    <button
                        onClick={() => { }} // Do nothing as requested
                        className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans rounded-full active:scale-95 transition-transform"
                        style={{
                            backgroundColor: "#171717", // Dark background
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                    >
                        Withdraw
                    </button>
                )}
            </div>
        </div>
    );
};

export default WalletCreated;
