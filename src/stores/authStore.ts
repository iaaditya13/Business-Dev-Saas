
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock login - in real app, this would call an API
        if (email && password) {
          const user = {
            id: '1',
            email,
            name: email.split('@')[0],
            role: 'admin'
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      signup: async (email: string, password: string, name: string) => {
        // Mock signup
        if (email && password && name) {
          const user = {
            id: '1',
            email,
            name,
            role: 'admin'
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
