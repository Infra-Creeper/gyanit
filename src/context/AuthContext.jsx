import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase
      .from('USER').select('user_id, user_name, email, role')
      .eq('user_id', userId).maybeSingle();
    setProfile(data);
    setLoading(false);
  }

  async function signup(name, email, username, password, role) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    const userId = data.user?.id;
    if (!userId) return { error: { message: 'Signup failed.' } };
    const { error: insertErr } = await supabase.from('USER').insert({
      user_id: userId, user_name: name, email, password: '—', role,
    });
    if (insertErr) return { error: insertErr };
    if (role === 'Student') await supabase.from('STUDENT').insert({ user_id: userId });
    else await supabase.from('INSTRUCTOR').insert({ user_id: userId });
    return { error: null };
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function logout() { await supabase.auth.signOut(); }

  const value = {
    user, profile, loading,
    isAuthenticated: !!user,
    displayName: profile?.user_name ?? user?.email ?? '',
    role: profile?.role ?? null,
    login, signup, logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
