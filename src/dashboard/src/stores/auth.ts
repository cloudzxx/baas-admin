import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem('baas-admin-token'),
  login: (token: string, role: string) => {
    localStorage.setItem('baas-admin-token', token);
    localStorage.setItem('baas-admin-role', role);
    set({ isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem('baas-admin-token');
    localStorage.removeItem('baas-admin-role');
    set({ isLoggedIn: false });
  },
}));
