import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import locationIcon from "@/assets/location.svg";
import deliveryIcon from "@/assets/delivery.svg";
import calendarIcon from "@/assets/calendar.svg";
import chevronDownIcon from "@/assets/chevron-down.svg";
import circleButtonBg from "@/assets/circle-button.png";
import applyButtonBg from "@/assets/apply-button-bg.png";
import checkSvg from "@/assets/check.svg";
import pillBg from "@/assets/pill.png";
import selectedPillBg from "@/assets/selected-pill.png";
import crossIcon from "@/assets/cross-icon.png";
import infoIcon from "@/assets/delivery-tip-info.png";
import { SlideToPay } from "@/components/SlideToPay";

const OrderCashSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state || { amount: "0.00" };

  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);

  // Rewards State
  const [rewardPoints, setRewardPoints] = useState("");
  const [rewardError, setRewardError] = useState("");
  const [rewardApplied, setRewardApplied] = useState(false);

  // Tip State
  const [isTipContainerVisible, setIsTipContainerVisible] = useState(false);
  const [isTipCollapsed, setIsTipCollapsed] = useState(false);
  const [selectedTipOption, setSelectedTipOption] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTipValue, setCustomTipValue] = useState("");

  // Calculations
  const parsedAmount = parseFloat((amount || "0").toString().replace(/,/g, "")) || 0;
  const parsedRewardPoints = rewardApplied && rewardPoints ? parseInt(rewardPoints, 10) : 0;
  const deliveryFee = 30;
  const gst = parsedAmount * 0.18;
  const platformFee = 6.60;
  const totalAmount = parsedAmount - parsedRewardPoints + deliveryFee + gst + platformFee + tipAmount;

  const handleTipSelect = (option: string) => {
    setSelectedTipOption(option);
    if (option === "other") {
      setTipAmount(0);
    } else {
      setTipAmount(parseInt(option, 10));
    }
  };

  const handleClearTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTipOption(null);
    setTipAmount(0);
    setCustomTipValue("");
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setCustomTipValue(val);
    }
  };

  const handleApplyCustomTip = () => {
    const val = parseInt(customTipValue, 10);
    if (!isNaN(val) && val > 0) {
        setTipAmount(val);
    }
  };

  const handleClearCustomTip = () => {
      setCustomTipValue("");
      setTipAmount(0);
      setSelectedTipOption(null);
      setIsTipContainerVisible(false);
  };

  const handleCollapseTip = () => {
      if (tipAmount > 0) {
          setIsTipCollapsed(!isTipCollapsed);
      } else {
          setIsTipContainerVisible(false);
          setIsTipCollapsed(false);
      }
  };

  const handlePay = () => {
      navigate("/order-cash-success");
  };

  const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setRewardPoints(val);
      setRewardError("");
      if (rewardApplied) {
          setRewardApplied(false);
      }
    }
  };

  const handleApplyReward = () => {
    if (!rewardPoints) return;
    const points = parseInt(rewardPoints, 10);

    if (isNaN(points) || points < 500) {
      setRewardError("Minimum 500 points to redeem.");
      setRewardApplied(false);
    } else {
      setRewardError("");
      setRewardApplied(true);
    }
  };

  const containerStyle = {
    backgroundColor: "rgba(25, 25, 25, 0.30)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "0.65px solid rgba(255, 255, 255, 0.20)",
    borderRadius: "13px",
  };

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex-none px-5 pt-4 flex items-center justify-between z-10 mb-6 safe-area-top">
        <button
          onClick={() => navigate("/order-cash")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-[18px] font-medium font-sans">
          Order Cash
        </h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-[10px] no-scrollbar">
        <div
            style={containerStyle}
            className="w-full relative overflow-hidden"
        >
            <div
                className="flex items-start py-[11px] px-[12px]"
            >
                <div
                    className="w-[52px] h-[52px] shrink-0 flex items-center justify-center mr-[12px]"
                    style={{
                        backgroundImage: `url(${circleButtonBg})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                >
                    <img src={locationIcon} alt="Location" className="w-[22px] h-[22px]" />
                </div>
                <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-white text-[16px] font-medium font-sans">Home</span>
                        <img
                            src={chevronDownIcon}
                            alt="Toggle"
                            className="w-4 h-4"
                        />
                    </div>
                    <p className="text-white/80 text-[14px] font-normal font-sans mt-1 leading-tight">
                        C102, Pubali Estate, Guwahati - 781005
                    </p>
                </div>
            </div>
        </div>

        <div style={containerStyle} className="w-full py-[11px] px-[12px] flex items-center justify-between">
             <div className="flex items-center gap-[12px]">
                <div
                    className="w-[52px] h-[52px] shrink-0 flex items-center justify-center"
                    style={{
                        backgroundImage: `url(${circleButtonBg})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                >
                    <img src={deliveryIcon} alt="Delivery" className="w-[24px] h-[24px]" />
                </div>
                <div>
                    <p className="text-white text-[14px] font-medium font-sans">Delivery</p>
                    <p className="text-white/60 text-[14px] font-normal font-sans">Deliver now</p>
                </div>
             </div>
             <div className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100">
                <img src={calendarIcon} alt="Calendar" className="w-[18px] h-[18px]" />
                <span className="text-white text-[14px] font-medium font-sans underline underline-offset-2">Want it later?</span>
             </div>
        </div>

        <div className="py-2">
            <p className="text-white/50 text-[14px] font-medium font-sans">
                Want more flexibility?
            </p>
            <p className="text-white/50 text-[14px] font-normal font-sans mt-1 leading-tight">
                Schedule your delivery for later and pick a time-slot that suits you the best.
            </p>
        </div>

        <div style={containerStyle} className="w-full pt-[10px] px-[11px] pb-[12px]">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-white text-[16px] font-medium font-sans">KYC Security Check</span>
                <span className="text-[16px]">🔐</span>
            </div>
            <ul className="list-disc pl-4 space-y-2 text-white/80 text-[13px] font-normal font-sans leading-snug marker:text-white/60">
                <li>Your KYC has been verified. Please keep your original ID ready when accepting your cash delivery.</li>
                <li>Your delivery partner’s name, photo, and KYC details will be visible before drop-off.</li>
                <li>Please verify their ID before accepting the cash.</li>
            </ul>
            <div className="w-full h-[1px] bg-white/10 my-3" />
            <p className="text-white/40 text-[12px] font-normal font-sans">
                Both parties must match KYC details before the transaction is completed.
            </p>
        </div>

        <div style={containerStyle} className="w-full overflow-hidden">
            <button
                className="w-full py-[13px] px-[12px] flex items-center justify-between"
                onClick={() => setIsRewardsOpen(!isRewardsOpen)}
            >
                <span className="text-white text-[16px] font-medium font-sans">Redeem Reward Points</span>
                <img
                    src={chevronDownIcon}
                    alt="Toggle"
                    className={`w-4 h-4 transition-transform ${isRewardsOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isRewardsOpen && (
                <div className="px-[12px] pb-[16px]">
                     <p className="text-white text-[14px] font-medium font-sans -mt-[7px] mb-[21px]">
                        You have 12,000 points available
                     </p>
                     <div className="flex items-center gap-[12px]">
                        <div className="relative flex-1 h-[45px]">
                            <input
                                type="text"
                                value={rewardPoints}
                                onChange={handleRewardChange}
                                placeholder="Enter reward points"
                                className={`w-full h-full bg-white/5 rounded-[14px] px-4 text-white font-sans text-[12px] focus:outline-none border ${rewardError ? 'border-[#FF3B30]' : 'border-white/20'}`}
                            />
                            {rewardApplied && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <img src={checkSvg} alt="Applied" className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleApplyReward}
                            disabled={!rewardPoints}
                            className="shrink-0 flex items-center justify-center transition-opacity active:scale-95 disabled:opacity-50"
                            style={{
                                width: "102px",
                                height: "45px",
                                backgroundImage: `url(${applyButtonBg})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center'
                            }}
                        >
                            <span className="text-white text-[14px] font-bold font-sans">
                                {rewardApplied ? "Applied" : "Apply"}
                            </span>
                        </button>
                     </div>
                     <p className={`text-[12px] font-normal font-sans mt-2 ${rewardError ? 'text-[#FF3B30]' : 'text-white/40'}`}>
                         {rewardError || "Minimum 500 points to redeem"}
                     </p>
                </div>
            )}
        </div>

        {isTipContainerVisible && (
            <div
                style={containerStyle}
                className="w-full overflow-hidden"
            >
                <div
                    className={`flex items-center justify-between px-[12px] ${isTipCollapsed ? 'py-[14px]' : 'pt-[14px] pb-[2px]'}`}
                    onClick={() => {
                        if (isTipCollapsed) setIsTipCollapsed(false);
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-white text-[16px] font-medium font-sans">Delivery Tip</span>
                        <img src={infoIcon} alt="Info" className="w-4 h-4" />
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCollapseTip();
                        }}
                    >
                        <img
                            src={chevronDownIcon}
                            alt="Collapse"
                            className={`w-4 h-4 transition-transform duration-200 ${!isTipCollapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {!isTipCollapsed && (
                    <div className="px-[12px] pb-[16px]">
                        <p className="text-white/80 text-[13px] font-normal font-sans mb-5 leading-snug">
                            A small tip, goes a big way! Totally optional — but your rider will appreciate it ❤️
                        </p>
                        <div className="flex items-center gap-3">
                            {['10', '20', '30'].map((val) => (
                                <div key={val} className="relative shrink-0" style={{ width: '74px', height: '38px' }}>
                                    <button
                                        onClick={() => handleTipSelect(val)}
                                        className="relative flex items-center justify-center transition-all z-10 overflow-hidden p-0 m-0 border-none outline-none"
                                        style={{
                                            width: '74px',
                                            height: '38px',
                                            minWidth: '74px',
                                            minHeight: '38px',
                                            maxWidth: '74px',
                                            maxHeight: '38px',
                                            backgroundImage: `url(${selectedTipOption === val ? selectedPillBg : pillBg})`,
                                            backgroundSize: '100% 100%',
                                            backgroundRepeat: 'no-repeat',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <span
                                            className={`text-white font-medium font-sans text-[15px] z-20 relative leading-none ${val === '20' ? '-translate-y-[3px]' : ''}`}
                                        >
                                            ₹{val}
                                        </span>
                                        {selectedTipOption === val && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClearTip(e);
                                                    setIsTipContainerVisible(false);
                                                }}
                                                className="absolute top-[6px] right-[6px] z-30 cursor-pointer hover:opacity-80 flex items-center justify-center w-[12px] h-[12px]"
                                            >
                                                <img src={crossIcon} alt="Remove" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        {val === '20' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-[12px] bg-[#5260FE] flex items-center justify-center z-10 pointer-events-none rounded-b-[10px]">
                                                <span className="text-white text-[7px] font-bold font-sans uppercase tracking-wider leading-none">
                                                    MOST TIPPED
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            ))}
                            <div className="relative shrink-0" style={{ width: '74px', height: '38px' }}>
                                <button
                                    onClick={() => handleTipSelect('other')}
                                    className="relative flex items-center justify-center transition-all z-10 overflow-hidden p-0 m-0 border-none outline-none"
                                    style={{
                                        width: '74px',
                                        height: '38px',
                                        minWidth: '74px',
                                        minHeight: '38px',
                                        maxWidth: '74px',
                                        maxHeight: '38px',
                                        backgroundImage: `url(${selectedTipOption === 'other' ? selectedPillBg : pillBg})`,
                                        backgroundSize: '100% 100%',
                                        backgroundRepeat: 'no-repeat',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <span className="text-white font-medium font-sans text-[15px] z-20 relative leading-none">Other</span>
                                    {selectedTipOption === 'other' && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClearCustomTip();
                                            }}
                                            className="absolute top-[6px] right-[6px] w-[12px] h-[12px] flex items-center justify-center cursor-pointer hover:opacity-80 z-30"
                                        >
                                            <img src={crossIcon} alt="Remove" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                        {selectedTipOption === 'other' && (
                            <div className="mt-[15px] h-[48px] w-full bg-[#191919] rounded-full border border-white/10 flex items-center pl-4 pr-4">
                                <span className="text-white font-medium font-sans mr-2">₹</span>
                                <input
                                    type="text"
                                    placeholder="Enter tip amount"
                                    value={customTipValue}
                                    onChange={handleCustomTipChange}
                                    className="bg-transparent text-white font-sans text-[14px] placeholder:text-white/30 focus:outline-none flex-1"
                                />
                                <button
                                    onClick={tipAmount > 0 ? handleClearCustomTip : handleApplyCustomTip}
                                    className="text-[#5260FE] text-[13px] font-medium font-sans ml-2"
                                >
                                    {tipAmount > 0 ? "Clear" : "Apply"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}

        <div style={containerStyle} className="w-full overflow-hidden">
             <div
                className={`w-full px-[12px] flex flex-col cursor-pointer transition-all pt-[14px] ${isPayOpen ? 'pb-0' : 'pb-[14px]'}`}
                onClick={() => setIsPayOpen(!isPayOpen)}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-[16px] font-medium font-sans">To Pay</span>
                        <span className="text-white text-[16px] font-medium font-sans">
                            +₹{amount}
                        </span>
                    </div>
                    <img
                        src={chevronDownIcon}
                        alt="Toggle"
                        className={`w-4 h-4 transition-transform duration-200 ${isPayOpen ? 'rotate-180' : ''}`}
                    />
                </div>
                <p className="text-white/60 text-[12px] font-normal font-sans mt-[6px]">
                    Incl. all taxes & charges
                </p>
                {isPayOpen && (
                    <div className="w-full mt-[10px]">
                        <div className="w-full h-[1px] bg-[#202020] mb-[10px]" />
                        <div className="flex justify-between items-center mb-[2px]">
                            <span className="text-white font-light font-sans text-[13px]">Item Value</span>
                            <span className="text-white font-bold font-sans text-[13px]">₹{parsedAmount}</span>
                        </div>
                        {rewardApplied && (
                             <div className="flex justify-between items-center mb-[2px]">
                                <span className="text-white font-light font-sans text-[13px]">Reward Points</span>
                                <span className="text-[#FF3B30] font-bold font-sans text-[13px]">-₹{parsedRewardPoints}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-white font-light font-sans text-[13px]">Delivery Fee | 1.2 kms</span>
                            <span className="text-white font-bold font-sans text-[13px]">₹{deliveryFee}</span>
                        </div>
                        <p className="text-white/50 font-light font-sans text-[13px] mt-[12px] mb-[8px] leading-snug">
                            This fee fairly goes to our delivery partners for delivering your orders.
                        </p>
                        <div className="w-full h-[1px] bg-[#202020] mb-[8px]" />
                        <div className="flex justify-between items-center mb-[2px]">
                            <span className="text-white font-light font-sans text-[13px]">Delivery Tip</span>
                            {tipAmount > 0 ? (
                                <span
                                    className="text-white font-bold font-sans text-[13px] cursor-pointer hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsTipContainerVisible(true);
                                    }}
                                >
                                    ₹{tipAmount}
                                </span>
                            ) : (
                                <span
                                    className="text-[#5260FE] cursor-pointer font-medium font-sans text-[13px] relative z-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsTipContainerVisible(true);
                                        setIsTipCollapsed(false);
                                    }}
                                >
                                    Add Tip
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center mb-[2px]">
                            <span className="text-white font-light font-sans text-[13px]">GST (18%)</span>
                            <span className="text-white font-bold font-sans text-[13px]">₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-[8px]">
                            <span className="text-white font-light font-sans text-[13px]">Platform Fee</span>
                            <span className="text-white font-bold font-sans text-[13px]">₹{platformFee.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-[1px] bg-[#202020] mb-[8px]" />
                         <div className="flex justify-between items-center pb-[18px]">
                            <span className="text-white font-medium font-sans text-[15px]">Total Payable</span>
                            <span className="text-white font-bold font-sans text-[15px]">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div className="h-4 flex-none" />
      </div>
      <div
        className="flex-none w-full relative z-20 safe-area-bottom"
        style={{
            height: "264px"
        }}
      >
          <div
             className="absolute bottom-0 left-0 right-0 w-full flex flex-col"
             style={{
                 height: "255px",
                 backgroundColor: "rgba(23, 23, 23, 0.31)",
                 borderTopLeftRadius: "32px",
                 borderTopRightRadius: "32px",
                 paddingTop: "26px",
                 paddingLeft: "20px",
                 paddingRight: "20px",
                 paddingBottom: "54px"
             }}
          >
              <p className="text-white text-[18px] font-bold font-sans mb-[16px]">
                  Amount will be held from wallet
              </p>
              <p className="text-white text-[16px] font-medium font-sans mb-[34px]">
                  You won’t be charged unless the delivery is completed.
              </p>
              <SlideToPay onComplete={handlePay} />
          </div>
      </div>
    </div>
  );
};

export default OrderCashSummary;
