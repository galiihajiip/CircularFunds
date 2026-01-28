import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'UMKM' | 'INVESTOR';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,
  setAuth: (user, accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, accessToken, refreshToken });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    set({ user: null, accessToken: null, refreshToken: null });
  },
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedUser && storedAccessToken) {
        set({
          user: JSON.parse(storedUser),
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    }
  },
}));
