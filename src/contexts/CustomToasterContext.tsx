import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type ToasterType = 'delete' | 'success';

interface CustomToasterContextType {
  isVisible: boolean;
  message: string;
  type: ToasterType;
  showToaster: (message: string, type?: ToasterType) => void;
  hideToaster: () => void;
}

const CustomToasterContext = createContext<CustomToasterContextType | undefined>(undefined);

export const CustomToasterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToasterType>('delete');

  const showToaster = useCallback((msg: string, toasterType: ToasterType = 'delete') => {
    setMessage(msg);
    setType(toasterType);
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
    <CustomToasterContext.Provider value={{ isVisible, message, type, showToaster, hideToaster }}>
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
