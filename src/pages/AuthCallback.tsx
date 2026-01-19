import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for session and redirect
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      } else {
        // If no session immediately, wait for onAuthStateChange to fire in global context or here
        // But usually, if we landed here, Supabase client should have handled the hash
        // If not, we might need to handle hash parsing manually?
        // Supabase-js v2 automatically parses hash if configured correctly.
        // Let's verify if we are stuck.

        // If we are here, it means we are on /auth/v1/callback
        // We can just redirect to home and let the global auth guard handle it?
        // But let's give it a moment.
        setTimeout(() => {
             navigate("/");
        }, 2000);
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <p>Completing sign in...</p>
    </div>
  );
};

export default AuthCallback;
