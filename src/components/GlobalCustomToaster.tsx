import React from 'react';
import { useCustomToaster } from '@/contexts/CustomToasterContext';
import toasterBg from '@/assets/toaster-bg.png';
import trashIcon from '@/assets/trash.svg';
import correctIcon from '@/assets/correct.svg';

const GlobalCustomToaster: React.FC = () => {
  const { isVisible, message, type } = useCustomToaster();

  if (!isVisible) return null;

  const icon = type === 'success' ? correctIcon : trashIcon;
  const altText = type === 'success' ? 'Success' : 'Deleted';

  return (
    <div className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <div
        className="flex items-center px-[14px] pointer-events-auto animate-in fade-in slide-in-from-bottom-5 duration-300"
        style={{
          width: '363px',
          height: '52px',
          borderRadius: '12px',
          backgroundImage: `url(${toasterBg})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
            <img src={icon} alt={altText} className="w-full h-full" />
        </div>
        <div className="w-[8px]" /> {/* Spacer */}
        <span className="text-white text-[14px] font-medium font-satoshi truncate">
          {message}
        </span>
      </div>
    </div>
  );
};

export default GlobalCustomToaster;
