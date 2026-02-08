import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import errorBg from '../assets/error-bg.png';
import crossFailedIcon from '../assets/cross failed.svg';
import buttonPrimaryWide from "@/assets/button-primary-wide.png";

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

        {/* Failed Icon */}
        <div className="mb-8 relative">
          <div className="rounded-full p-3 shadow-[0_0_20px_rgba(255,0,0,0.5)]">
            <img
              src={crossFailedIcon}
              alt="Failed"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        <h2 className="text-white text-[18px] font-medium text-center max-w-[85%] leading-relaxed mb-8">
          Something went horribly wrong... financially.
        </h2>

        {/* Info Card */}
        <div
          className="w-full rounded-[22px] p-6 relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(25, 25, 25, 0.31)', // #191919 @ 31%
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
          }}
        >
          {/* Linear Stroke Overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[22px]"
            style={{
              padding: '0.63px',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.20))',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          <p className="text-white text-[16px] font-medium mb-4 leading-normal relative z-10">
            We tried. Your bank tried. Even your card looked motivated.
          </p>

          <p className="text-[#A4A4A4] text-[14px] font-normal leading-relaxed mb-6 relative z-10">
            But something tripped in the matrix, and{' '}
            <span className="text-white font-bold">
              {formatCurrency(amount)}
            </span>{' '}
            didn’t make it to your wallet. Don’t worry – if any money was
            deducted, it’ll crawl back to you within 2–3 biz days. In the
            meantime? Deep breaths an check your balance. Emotionally and
            otherwise.
          </p>

          <div className="flex items-center gap-3 mt-2 relative z-10">
            <div className="w-3 h-3 rounded-full bg-[#FF0000] shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
            <span className="text-[#A4A4A4] text-[14px] font-medium">
              Transaction ghosted.
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-4 mb-8 z-10">
        <div className="w-full">
          <button
            onClick={handleTryAgain}
            className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans active:scale-95 transition-transform"
            style={{
              backgroundImage: `url(${buttonPrimaryWide})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              filter: 'brightness(0.8) contrast(1.2)',
            }}
          >
            Try Again (If you dare)
          </button>
        </div>

        <div className="w-full">
          <button
            onClick={handleGoBack}
            className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans active:scale-95 transition-transform"
            style={{
              backgroundImage: `url(${buttonPrimaryWide})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              filter: 'brightness(0.8) contrast(1.2)',
            }}
          >
            Go Back!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletTopUpFailed;