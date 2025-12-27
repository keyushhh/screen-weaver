import React from 'react';
import { cn } from '../lib/utils';
import popupBg from '../assets/popup-bg-remove.png';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryButtonSrc: string;
  onPrimaryClick: () => void;
  secondaryButtonSrc: string; // The Cancel button
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  primaryButtonSrc,
  onPrimaryClick,
  secondaryButtonSrc,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal Content - positioned slightly from bottom or centered based on design.
          The screenshot showed it near bottom but floating. */}
      <div className="relative z-10 w-[360px] max-w-[90%] flex flex-col items-center">
        {/* Card Background Container */}
        <div
          className="relative w-full overflow-hidden rounded-[32px] p-6 text-center"
          style={{
            backgroundImage: `url(${popupBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Text Content */}
          <div className="mb-6 space-y-2">
            <h2 className="text-[20px] font-bold text-white font-satoshi">
              {title}
            </h2>
            <p className="text-[14px] leading-relaxed text-white/80 font-satoshi">
              {description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrimaryClick();
              }}
              className="w-full active:scale-95 transition-transform"
            >
              <img
                src={primaryButtonSrc}
                alt="Primary Action"
                className="w-full h-[48px] object-contain"
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-full active:scale-95 transition-transform"
            >
              <img
                src={secondaryButtonSrc}
                alt="Cancel"
                className="w-full h-[48px] object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
