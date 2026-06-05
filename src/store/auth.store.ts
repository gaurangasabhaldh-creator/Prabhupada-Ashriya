import {create} from 'zustand';
import {UserDocument} from '@mytypes/user.types';

interface AuthState {
  user: UserDocument | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOffline: boolean;
  setUser: (user: UserDocument | null) => void;
  setLoading: (loading: boolean) => void;
  setOffline: (offline: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isOffline: false,

  setUser: user =>
    set({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
    }),

  setLoading: isLoading => set({isLoading}),

  setOffline: isOffline => set({isOffline}),

  reset: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isOffline: false,
    }),
}));

// Selector helpers — avoids subscribing to the full store
export const selectUser = (s: AuthState) => s.user;
export const selectRole = (s: AuthState) => s.user?.role ?? null;
export const selectTeamIds = (s: AuthState) => s.user?.teamIds ?? [];
export const selectOrgId = (s: AuthState) => s.user?.organizationId ?? null;
export const selectIsOffline = (s: AuthState) => s.isOffline;
