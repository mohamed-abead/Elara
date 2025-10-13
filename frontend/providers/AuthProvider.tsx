import { Session, User } from "@supabase/supabase-js";
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from "react";

import { supabase } from "@/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.warn("Failed to fetch session", error);
          return;
        }

        if (!isMounted) {
          return;
        }

        setSession(data.session);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
      }
    });

    initSession();

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      },
      refreshSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(data.session);
      },
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
