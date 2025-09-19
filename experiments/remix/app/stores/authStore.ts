// stores/authStore.ts - Komplette Version mit direkten API-Calls
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, MedusaError, AuthError } from '~/lib/api/index'

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at?: string;
  has_account?: boolean;
  metadata?: Record<string, any>;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;

  // Utility methods
  hasValidSession: () => Promise<boolean>;
  getStoredToken: () => string | null;
  refreshUserData: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get): AuthState => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ✅ Login Implementation
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          console.log('🔐 Starting login process...');

          const customer = await authApi.login({ email, password });

          if (!customer) {
            throw new AuthError('Login failed: no customer data received');
          }

          set({
            user: customer,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          console.log('✅ Login successful in store:', customer.email);

          // ✅ Initialize or refresh cart after login
          const { initializeCart } = await import('~/stores/cartStore');
          try {
            await initializeCart();
          } catch (cartError) {
            console.warn('Cart initialization after login failed:', cartError);
          }

        } catch (error: any) {
          console.error('❌ Login failed in store:', error);

          const errorMessage = error instanceof AuthError
            ? error.message
            : error instanceof MedusaError
              ? error.message
              : 'Login fehlgeschlagen';

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });

          throw error;
        }
      },

      // ✅ Register Implementation
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          console.log('🔐 Starting registration process...');

          await authApi.register(data);

          console.log('✅ Registration successful, attempting auto-login...');

          // ✅ Auto-login after successful registration
          await get().login(data.email, data.password);

        } catch (error: any) {
          console.error('❌ Registration failed in store:', error);

          const errorMessage = error instanceof AuthError
            ? error.message
            : error instanceof MedusaError
              ? error.message
              : 'Registrierung fehlgeschlagen';

          set({
            error: errorMessage,
            isLoading: false
          });

          throw error;
        }
      },

      // ✅ Logout Implementation
      logout: async () => {
        set({ isLoading: true });

        try {
          console.log('🔐 Starting logout process...');

          await authApi.logout();

          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false
          });

          // ✅ Clear cart on logout
          const { clearCart } = await import('~/stores/cartStore');
          try {
            clearCart();
          } catch (cartError) {
            console.warn('Cart clear on logout failed:', cartError);
          }

          console.log('✅ Logout successful');
        } catch (error: any) {
          console.error('❌ Logout error:', error);

          // Clear state anyway on logout error - logout should always succeed locally
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false
          });

          // Clear cart anyway
          const { clearCart } = await import('~/stores/cartStore');
          try {
            clearCart();
          } catch (cartError) {
            console.warn('Cart clear on logout error failed:', cartError);
          }
        }
      },

      // ✅ Clear Error
      clearError: () => set({ error: null }),

      // ✅ Update Profile Implementation
      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) {
          throw new AuthError('Nicht angemeldet');
        }

        set({ isLoading: true, error: null });

        try {
          console.log('🔐 Updating profile...');

          const updatedCustomer = await authApi.updateProfile(data);

          set({
            user: updatedCustomer,
            isLoading: false
          });

          console.log('✅ Profile updated successfully');
        } catch (error: any) {
          console.error('❌ Profile update failed:', error);

          const errorMessage = error instanceof AuthError
            ? error.message
            : error instanceof MedusaError
              ? error.message
              : 'Profil-Update fehlgeschlagen';

          set({
            error: errorMessage,
            isLoading: false
          });

          throw error;
        }
      },

      // ✅ Check Auth Status Implementation
      checkAuth: async () => {
        const { isAuthenticated } = get();

        // ✅ Nur prüfen wenn Token vorhanden oder User als authentifiziert markiert
        const hasToken = authApi.getStoredToken();

        if (!hasToken && !isAuthenticated) {
          console.log('🔐 No token and not authenticated, skipping auth check');
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          console.log('🔐 Checking auth status...');

          const customer = await authApi.getCurrentCustomer();

          if (customer) {
            set({
              user: customer,
              isAuthenticated: true
            });
            console.log('✅ Auth check successful:', customer.email);
          } else {
            console.log('ℹ️ No authenticated customer found, clearing auth state');
            set({
              user: null,
              isAuthenticated: false
            });
          }
        } catch (error: any) {
          console.log('❌ Auth check failed, clearing auth state');
          console.error('Auth check error details:', error);

          set({
            user: null,
            isAuthenticated: false
          });
        }
      },

      // ✅ Has Valid Session
      hasValidSession: async () => {
        try {
          const customer = await authApi.getCurrentCustomer();
          return !!customer;
        } catch (error) {
          return false;
        }
      },

      // ✅ Get Stored Token
      getStoredToken: () => {
        return authApi.getStoredToken();
      },

      // ✅ Refresh User Data
      refreshUserData: async () => {
        const { isAuthenticated } = get();

        if (!isAuthenticated) {
          console.log('🔐 Not authenticated, skipping user data refresh');
          return;
        }

        try {
          console.log('🔐 Refreshing user data...');

          const customer = await authApi.getCurrentCustomer();

          if (customer) {
            set({ user: customer });
            console.log('✅ User data refreshed successfully');
          } else {
            console.log('❌ No customer data found during refresh, logging out');
            await get().logout();
          }
        } catch (error: any) {
          console.error('❌ User data refresh failed:', error);

          // If refresh fails due to auth issues, logout
          if (error instanceof AuthError || error?.status === 401) {
            console.log('🔐 Auth error during refresh, logging out');
            await get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Token wird separat von authApi verwaltet
      }),

      // ✅ Rehydration Handler
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('🔐 Auth store rehydrated:', {
            hasUser: !!state.user,
            isAuthenticated: state.isAuthenticated,
            userEmail: state.user?.email
          });

          // ✅ Check auth validity on app start (nach kurzer Verzögerung)
          if (state.isAuthenticated && state.user) {
            setTimeout(() => {
              state.checkAuth();
            }, 1000);
          }
        }
      },

      // ✅ Version für Migration falls nötig
      version: 1,
    }
  )
);

// ✅ Utility Hooks für Komponenten
export const useAuth = () => {
  const auth = useAuthStore();

  return {
    ...auth,
    isLoggedIn: auth.isAuthenticated && !!auth.user,
    userName: auth.user ? `${auth.user.first_name} ${auth.user.last_name}` : null,
    userInitials: auth.user ?
      `${auth.user.first_name.charAt(0)}${auth.user.last_name.charAt(0)}`.toUpperCase() :
      null,
  };
};

// ✅ Selector Hooks für Performance
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthStatus = () => useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
}));
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  updateProfile: state.updateProfile,
  clearError: state.clearError,
}));

// ✅ Auth Guards für Komponenten
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const navigate = typeof window !== 'undefined' ?
    () => window.location.href = '/auth/login' :
    () => {};

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate();
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};

// ✅ Export für direkte Store-Access
export { useAuthStore as authStore };
