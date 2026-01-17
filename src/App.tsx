import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { App as CapacitorApp } from '@capacitor/app';
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { UserProvider } from "./contexts/UserContext";
import { CustomToasterProvider } from "./contexts/CustomToasterContext";
import GlobalCustomToaster from "./components/GlobalCustomToaster";
import Index from "./pages/Index";
import Homepage from "./pages/Homepage";
import Settings from "./pages/Settings";
import KYCIntro from "./pages/KYCIntro";
import KYCForm from "./pages/KYCForm";
import KYCUpload from "./pages/KYCUpload";
import KYCSelfie from "./pages/KYCSelfie";
import KYCReview from "./pages/KYCReview";
import SuccessScreen from "./pages/SuccessScreen";
import ProfileEdit from "./pages/ProfileEdit";
import MyCards from "./pages/MyCards";
import AddCard from "./pages/AddCard";
import CardRemoveSuccess from "./pages/CardRemoveSuccess";
import CameraPage from "./pages/CameraPage";
import Banking from "./pages/Banking";
import AddBank from "./pages/AddBank";
import LinkedAccounts from "./pages/LinkedAccounts";
import BankRemoveSuccess from "./pages/BankRemoveSuccess";
import SecurityDashboard from "./pages/SecurityDashboard";
import KYCStatusComplete from "./pages/KYCStatusComplete";
import DeleteAccount from "./pages/DeleteAccount";
import ConfirmDeactivation from "./pages/ConfirmDeactivation";
import AccountDeactivated from "./pages/AccountDeactivated";
import DeleteAccountReasons from "./pages/DeleteAccountReasons";
import DeleteAccountMobile from "./pages/DeleteAccountMobile";
import DeleteAccountOTP from "./pages/DeleteAccountOTP";
import AccountDeleted from "./pages/AccountDeleted";
import AccountRetrieved from "./pages/AccountRetrieved";
import MpinSettings from "./pages/MpinSettings";
import ForgotMpin from "./pages/ForgotMpin";
import OrderCash from "./pages/OrderCash";
import OrderCashSummary from "./pages/OrderCashSummary";
import OrderCashSuccess from "./pages/OrderCashSuccess";
import ScheduleDelivery from "./pages/ScheduleDelivery";
import AddAddress from "./pages/AddAddress";
import AddAddressDetails from "./pages/AddAddressDetails";
import OrderCancelled from "./pages/OrderCancelled";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Handle deep links for OAuth
    const listener = CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
      if (url.startsWith('dotpe://')) {
          // Extract params from fragment (#) or query (?)
          // Supabase usually sends params in fragment for implicit flow
          // But for PKCE flow (default in v2) it sends 'code' in query?
          // Let's handle generic case:

          // Check for #access_token=...
          if (url.includes('access_token') && url.includes('refresh_token')) {
              // Parse fragment
              const fragment = url.split('#')[1];
              const params = new URLSearchParams(fragment);
              const access_token = params.get('access_token');
              const refresh_token = params.get('refresh_token');

              if (access_token && refresh_token) {
                  await supabase.auth.setSession({
                      access_token,
                      refresh_token
                  });
              }
          }
          // Check for ?code=... (PKCE)
          else if (url.includes('code=')) {
              // This is tricky as we need to detect query params vs fragment
              // Capacitor URL might be dotpe://auth-callback?code=...
              const query = url.split('?')[1];
              if (query) {
                  const params = new URLSearchParams(query);
                  const code = params.get('code');
                  if (code) {
                       await supabase.auth.exchangeCodeForSession(code);
                  }
              }
          }
      }
    });

    return () => {
        listener.then(handle => handle.remove());
    };
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <CustomToasterProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GlobalCustomToaster />
          <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/kyc-intro" element={<KYCIntro />} />
            <Route path="/kyc-form" element={<KYCForm />} />
            <Route path="/kyc-upload" element={<KYCUpload />} />
            <Route path="/kyc-selfie" element={<KYCSelfie />} />
            <Route path="/kyc-review" element={<KYCReview />} />
            <Route path="/kyc-success" element={<SuccessScreen />} />
            <Route path="/profile-edit" element={<ProfileEdit />} />
            <Route path="/cards" element={<MyCards />} />
            <Route path="/cards/add" element={<AddCard />} />
            <Route path="/card-remove-success" element={<CardRemoveSuccess />} />
            <Route path="/camera-page" element={<CameraPage />} />
            <Route path="/banking" element={<Banking />} />
            <Route path="/banking/add" element={<AddBank />} />
            <Route path="/banking/linked-accounts" element={<LinkedAccounts />} />
            <Route path="/bank-remove-success" element={<BankRemoveSuccess />} />
            <Route path="/security-dashboard" element={<SecurityDashboard />} />
            <Route path="/kyc-status-complete" element={<KYCStatusComplete />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/confirm-deactivation" element={<ConfirmDeactivation />} />
            <Route path="/account-deactivated" element={<AccountDeactivated />} />
            <Route path="/delete-account-reasons" element={<DeleteAccountReasons />} />
            <Route path="/delete-account-mobile" element={<DeleteAccountMobile />} />
            <Route path="/delete-account-otp" element={<DeleteAccountOTP />} />
            <Route path="/account-deleted" element={<AccountDeleted />} />
            <Route path="/account-retrieved" element={<AccountRetrieved />} />
            <Route path="/security/mpin-settings" element={<MpinSettings />} />
            <Route path="/forgot-mpin" element={<ForgotMpin />} />
            <Route path="/order-cash" element={<OrderCash />} />
            <Route path="/order-cash-summary" element={<OrderCashSummary />} />
            <Route path="/order-cash-success" element={<OrderCashSuccess />} />
            <Route path="/schedule-delivery" element={<ScheduleDelivery />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/add-address-details" element={<AddAddressDetails />} />
            <Route path="/order-cancelled" element={<OrderCancelled />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </HashRouter>
        </TooltipProvider>
      </CustomToasterProvider>
    </UserProvider>
  </QueryClientProvider>
  );
};

export default App;