import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithDemo: (email: string, name?: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo user is stored
    const demoUserData = localStorage.getItem('recovtn_demo_user');
    if (demoUserData) {
      try {
        const parsed = JSON.parse(demoUserData);
        setSession(parsed.session);
        setUser(parsed.user);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('recovtn_demo_user');
      }
    }

    // Listener FIRST (per Supabase best practice)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // Only set if we are not in demo mode
      if (!localStorage.getItem('recovtn_demo_user')) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    // Then load existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      if (!localStorage.getItem('recovtn_demo_user')) {
        setSession(existing);
        setUser(existing?.user ?? null);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithDemo = (email: string, name = "Agent de Recouvrement (Démo)") => {
    const mockUser: User = {
      id: "demo-user-id",
      email: email,
      email_confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: "authenticated",
      user_metadata: { full_name: name },
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString()
    } as any;

    const mockSession: Session = {
      access_token: "demo-token",
      refresh_token: "demo-refresh",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: "bearer",
      user: mockUser
    };

    localStorage.setItem('recovtn_demo_user', JSON.stringify({ user: mockUser, session: mockSession }));
    setSession(mockSession);
    setUser(mockUser);
  };

  const signOut = async () => {
    localStorage.removeItem('recovtn_demo_user');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignored if client is offline or dummy
    }
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInWithDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

