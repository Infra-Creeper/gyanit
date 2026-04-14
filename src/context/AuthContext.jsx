import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('user')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          setUser({
            user_id: authUser.id,
            email: authUser.email,
            user_name: profile?.user_name || authUser.email.split('@')[0],
            role: profile?.role || 'Student',
            // domain_interest removed
          });
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('user')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        setUser({
          user_id: session.user.id,
          email: session.user.email,
          user_name: profile?.user_name || session.user.email.split('@')[0],
          role: profile?.role || 'Student',
            // domain_interest removed
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Login started")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("Login data received")
      if (error) throw error;

      // Fetch user profile
      const { data: profile } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      setUser({
        user_id: data.user.id,
        email: data.user.email,
        user_name: profile?.user_name || email.split('@')[0],
        role: profile?.role || 'Student',
            // domain_interest removed
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name, email, username, password, role) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create user profile in database
      const { error: profileError } = await supabase
        .from('user')
        .insert([
          {
            user_id: authData.user.id,
            user_name: name,
            email,
            role,
            password, // Only if you store hashed passwords manually (not recommended if using Supabase Auth)
            // domain_interest removed
            created_at: new Date(),
          },
        ]);

      if (profileError) throw profileError;

      setUser({
        user_id: authData.user.id,
        email,
        user_name: name,
        role,
        // domain_interest removed
      });

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
