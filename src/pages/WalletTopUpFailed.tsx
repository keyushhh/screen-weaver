import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import errorBg from '../assets/error-bg.png';
import crossIcon from '../assets/cross-icon.png';

const WalletTopUpFailed: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (location.state?.amount) {
      setAmount(Number(location.state.amount));
    }
  }, [location.state]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  const handleTryAgain = () => {
    // Navigate back to OrderSummary to retry
    // We pass 'retry: true' to signal the logic
    navigate('/order-summary', { state: { amount, retry: true } });
  };

  const handleGoBack = () => {
     navigate('/wallet-add-money');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${errorBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Content */}
      <div className="flex flex-col items-center w-full mt-10 z-10">
        <h1 className="text-white text-[28px] font-bold mb-8">
          Payment Failed!
        </h1>

        <div className="mb-8 relative">
             <div className="bg-[#FF0000] rounded-full p-3 shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                <img src={crossIcon} alt="Failed" className="w-12 h-12 object-contain" />
             </div>
        </div>

        <h2 className="text-white text-[18px] font-medium text-center max-w-[85%] leading-relaxed mb-8">
          Something went horribly wrong... financially.
        </h2>

        {/* Info Card */}
        <div className="w-full bg-[#000000]/60 backdrop-blur-md rounded-[22px] p-6 border border-white/10 shadow-lg">
            <p className="text-white text-[16px] font-medium mb-4 leading-normal">
              We tried. Your bank tried. Even your card looked motivated.
            </p>

            <p className="text-[#A4A4A4] text-[14px] font-normal mb-4 leading-relaxed">
              But something tripped in the matrix, and <span className="text-white font-bold">{formatCurrency(amount)}</span> didn't make it to your wallet.
            </p>

            <p className="text-[#A4A4A4] text-[14px] font-normal mb-4 leading-relaxed">
              Don’t worry - if any money was deducted, it’ll crawl back to you within 2-3 biz days.
            </p>

            <p className="text-[#A4A4A4] text-[14px] font-normal mb-6 leading-relaxed">
              In the meantime? Deep breaths an check your balance. Emotionally and otherwise.
            </p>

            {/* Status Footer */}
            <div className="flex items-center gap-3 mt-2">
                <div className="w-3 h-3 rounded-full bg-[#FF0000] shadow-[0_0_8px_rgba(255,0,0,0.8)]"></div>
                <span className="text-[#A4A4A4] text-[14px] font-medium">Transaction ghosted.</span>
            </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-4 mb-8 z-10">
        <button
            onClick={handleTryAgain}
            className="w-full py-4 rounded-[16px] bg-[#1A1A1A]/90 border border-white/20 text-white font-bold text-[16px] active:scale-95 transition-transform backdrop-blur-sm shadow-md"
        >
            Try Again (If you dare)
        </button>

        <button
            onClick={handleGoBack}
            className="w-full py-4 rounded-[16px] bg-[#1A1A1A]/90 border border-white/20 text-white font-bold text-[16px] active:scale-95 transition-transform backdrop-blur-sm shadow-md"
        >
            Go Back!
        </button>
      </div>

    </div>
  );
};

export default WalletTopUpFailed;
