import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface CustomToasterContextType {
  isVisible: boolean;
  message: string;
  showToaster: (message: string) => void;
  hideToaster: () => void;
}

const CustomToasterContext = createContext<CustomToasterContextType | undefined>(undefined);

export const CustomToasterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showToaster = useCallback((msg: string) => {
    setMessage(msg);
    setIsVisible(true);
    // Auto hide after 3 seconds
    setTimeout(() => {
        setIsVisible(false);
    }, 3000);
  }, []);

  const hideToaster = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <CustomToasterContext.Provider value={{ isVisible, message, showToaster, hideToaster }}>
      {children}
    </CustomToasterContext.Provider>
  );
};

export const useCustomToaster = () => {
  const context = useContext(CustomToasterContext);
  if (!context) {
    throw new Error('useCustomToaster must be used within a CustomToasterProvider');
  }
  return context;
};
