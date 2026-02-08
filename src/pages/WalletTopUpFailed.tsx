import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import errorBg from '../assets/error-bg.png';
import crossFailedIcon from '../assets/cross failed.svg';
import buttonPrimaryWide from '@/assets/button-primary-wide.png';

const WalletTopUpFailed: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (location.state?.amount) {
      setAmount(Number(location.state.amount));
    }
  }, [location.state]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);

  const handleTryAgain = () => {
    navigate('/order-summary', { state: { amount, retry: true } });
  };

  const handleGoBack = () => {
    navigate('/wallet-add-money');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${errorBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Content */}
      <div className="flex flex-col items-center w-full mt-10 z-10">
        {/* Heading */}
        <h1 className="text-white text-[26px] font-medium">
          Payment Failed!
        </h1>

        {/* Failed Icon – 12px below heading */}
        <div className="mt-[12px]">
          <img
            src={crossFailedIcon}
            alt="Failed"
            className="w-[62px] h-[62px] object-contain"
          />
        </div>

        {/* Error Text – 35px below icon */}
        <h2 className="mt-[35px] text-white text-[18px] font-medium text-center max-w-[85%] leading-relaxed">
          Something went horribly wrong... financially.
        </h2>

        {/* Info Card – 20px below text */}
        {/* Info Card */}
        <div
          className="mt-[20px] w-full rounded-[22px] px-[19px] pt-[13px] pb-[18px] relative overflow-hidden"
          style={{
            backgroundColor: "rgba(25, 25, 25, 0.31)", // #191919 @ 31%
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
          }}
        >
          {/* Linear Stroke Overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[22px]"
            style={{
              padding: "0.63px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.20))",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <p className="relative z-10 text-white text-[16px] font-medium leading-normal mb-[12px]">
            We tried. Your bank tried. Even your card looked motivated.
          </p>

          <p className="relative z-10 text-[#AFAFAF] text-[16px] font-normal leading-snug">
            But something tripped in the matrix, and{" "}
            <span className="text-white font-medium">
              {formatCurrency(amount)}
            </span>{" "}
            didn’t make it to your wallet. Don’t worry – if any money was deducted,
            it’ll crawl back to you within 2–3 biz days. In the meantime? Deep breaths
            an check your balance. Emotionally and otherwise.
          </p>

          <div className="relative z-10 flex items-center gap-[12px] mt-[18px]">
            <div className="w-[14px] h-[14px] rounded-full bg-[#FF3B30]" />
            <span className="text-[#AFAFAF] text-[14px] font-medium">
              Transaction ghosted.
            </span>
          </div>
        </div>

      </div>

      {/* CTAs – 45px below container */}
      <div className="w-full mt-[45px] flex flex-col gap-4 z-10">
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
  );
};

export default WalletTopUpFailed;
