
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string, businessName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,

      initialize: async () => {
        try {
          // Get current session
          const { data: { session } } = await supabase.auth.getSession();
          
          set({ 
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session,
            isLoading: false
          });

          // Listen for auth changes
          supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session);
            set({
              session,
              user: session?.user ?? null,
              isAuthenticated: !!session,
              isLoading: false
            });

            // Seed demo data for demo account
            if (event === 'SIGNED_IN' && session?.user?.email === 'demo@yourapp.com') {
              setTimeout(async () => {
                const { error } = await supabase.rpc('seed_demo_data', {
                  demo_user_id: session.user.id
                });
                if (error) {
                  console.error('Error seeding demo data:', error);
                }
              }, 1000);
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            // If user doesn't exist, automatically create account
            if (error.message.includes('Invalid login credentials')) {
              console.log('User not found, creating account automatically...');
              
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  emailRedirectTo: `${window.location.origin}/`,
                  data: {
                    full_name: email.split('@')[0], // Use email prefix as default name
                    business_name: ''
                  }
                }
              });

              if (signUpError) {
                return { success: false, error: signUpError.message };
              }

              // Try to sign in immediately after signup
              if (signUpData.user) {
                // Wait a moment for the user to be created
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
                  email,
                  password
                });
                
                if (retryError) {
                  return { 
                    success: false, 
                    error: 'Account created successfully! Please try signing in again.' 
                  };
                }
                
                return { success: true };
              }

              return { success: true };
            }

            return { success: false, error: error.message };
          }

          return { success: true };
        } catch (error) {
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      signup: async (email: string, password: string, fullName: string, businessName?: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                full_name: fullName,
                business_name: businessName || ''
              }
            }
          });

          if (error) {
            return { success: false, error: error.message };
          }

          // Try to sign in immediately after signup
          if (data.user && !data.session) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (signInError) {
              return { 
                success: true, 
                error: 'Account created successfully! Please try signing in.' 
              };
            }
          }

          return { success: true };
        } catch (error) {
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
