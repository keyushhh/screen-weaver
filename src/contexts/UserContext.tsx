import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserState {
  phoneNumber: string;
  name: string;
  email: string;
  emailVerified: boolean;
  profileImage: string | null;
  kycStatus: 'incomplete' | 'pending' | 'complete';
  kycSubmittedAt: number | null;
  mpin: string | null;
  biometricEnabled: boolean;
}

interface UserContextType extends UserState {
  setPhoneNumber: (phone: string) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setEmailVerified: (verified: boolean) => void;
  setProfileImage: (image: string | null) => void;
  setKycStatus: (status: 'incomplete' | 'pending' | 'complete') => void;
  setMpin: (mpin: string) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  submitKyc: () => void;
  resetForDemo: () => void;
}

const USER_STORAGE_KEY = 'dotpe_user_state';

const defaultState: UserState = {
  phoneNumber: '',
  name: '',
  email: '',
  emailVerified: false,
  profileImage: null,
  kycStatus: 'incomplete',
  kycSubmittedAt: null,
  mpin: null,
  biometricEnabled: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UserState>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultState;
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Auto-transition from pending to complete after 2 minutes
  useEffect(() => {
    if (state.kycStatus === 'pending' && state.kycSubmittedAt) {
      const elapsed = Date.now() - state.kycSubmittedAt;
      const twoMinutes = 2 * 60 * 1000;
      
      if (elapsed >= twoMinutes) {
        setState(prev => ({ ...prev, kycStatus: 'complete' }));
      } else {
        const remaining = twoMinutes - elapsed;
        const timer = setTimeout(() => {
          setState(prev => ({ ...prev, kycStatus: 'complete' }));
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [state.kycStatus, state.kycSubmittedAt]);

  const setPhoneNumber = (phone: string) => {
    setState(prev => ({ ...prev, phoneNumber: phone }));
  };

  const setName = (name: string) => {
    setState(prev => ({ ...prev, name }));
  };

  const setEmail = (email: string) => {
    setState(prev => ({ ...prev, email }));
  };

  const setEmailVerified = (verified: boolean) => {
    setState(prev => ({ ...prev, emailVerified: verified }));
  };

  const setProfileImage = (image: string | null) => {
    setState(prev => ({ ...prev, profileImage: image }));
  };

  const setKycStatus = (status: 'incomplete' | 'pending' | 'complete') => {
    setState(prev => ({ ...prev, kycStatus: status }));
  };

  const setMpin = (mpin: string) => {
    setState(prev => ({ ...prev, mpin }));
  };

  const setBiometricEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, biometricEnabled: enabled }));
  };

  const submitKyc = () => {
    setState(prev => ({
      ...prev,
      kycStatus: 'pending',
      kycSubmittedAt: Date.now(),
    }));
  };

  const resetForDemo = () => {
    setState(defaultState);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        setPhoneNumber,
        setName,
        setEmail,
        setEmailVerified,
        setProfileImage,
        setKycStatus,
        setMpin,
        setBiometricEnabled,
        submitKyc,
        resetForDemo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
