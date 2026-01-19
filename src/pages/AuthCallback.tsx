import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Listen for auth state changes (SIGNED_IN)
    // This is the robust way to handle the race condition where session isn't ready immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/home");
      }
    });

    // 2. Also check getSession once immediately, for cases where session is already hydrated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    // 3. Fallback timeout: If nothing happens after 6 seconds, assume failure or stuck state
    const timeout = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If still no session, go back to login
                navigate("/");
            } else {
                navigate("/home");
            }
        });
    }, 6000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <p>Completing sign in...</p>
    </div>
  );
};

export default AuthCallback;
