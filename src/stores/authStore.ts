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
          // Check if this is the demo account and handle specially
          if (email === 'demo@yourapp.com') {
            // First try to sign in
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });

            // If sign in succeeds, we're done
            if (signInData.session && !signInError) {
              return { success: true };
            }

            // If sign in fails because user doesn't exist, create the demo account
            if (signInError && signInError.message.includes('Invalid login credentials')) {
              console.log('Demo account not found, creating it...');
              
              // Create the demo account without email confirmation
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  emailRedirectTo: `${window.location.origin}/`,
                  data: {
                    full_name: 'Demo User',
                    business_name: 'Demo Business'
                  }
                }
              });

              if (signUpError) {
                return { success: false, error: signUpError.message };
              }

              // For demo account, we need to handle the case where email confirmation is required
              // Try to sign in immediately after signup
              if (signUpData.user && !signUpData.session) {
                // Wait a moment for the user to be created
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
                  email,
                  password
                });
                
                if (retryError) {
                  // If still can't sign in due to email confirmation, return helpful message
                  if (retryError.message.includes('Email not confirmed')) {
                    return { 
                      success: false, 
                      error: 'Demo account created but requires email confirmation. Please check the Supabase Auth settings to disable email confirmation for easier testing, or use your own account instead.' 
                    };
                  }
                  return { success: false, error: retryError.message };
                }
                
                return { success: true };
              }

              return { success: true };
            }

            // Handle email not confirmed error specifically
            if (signInError && signInError.message.includes('Email not confirmed')) {
              return { 
                success: false, 
                error: 'Demo account requires email confirmation. Please check the Supabase Auth settings to disable email confirmation for easier testing, or use your own account instead.' 
              };
            }

            // Other sign in errors
            if (signInError) {
              return { success: false, error: signInError.message };
            }

            return { success: true };
          }

          // Regular login for non-demo accounts
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
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

          if (data.user && !data.session) {
            return { 
              success: true, 
              error: 'Please check your email to confirm your account before signing in.' 
            };
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
