// lib/api/auth.ts - Komplette Medusa v2.10.3 Auth API
import { CONFIG } from './config';
import { MedusaError, AuthError } from './errors';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  metadata?: Record<string, any>;
}

// ✅ Helper: Token aus localStorage holen
const getStoredAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    // Verschiedene Token-Speicher-Keys versuchen
    const possibleKeys = [
      'medusa_auth_token',
      'auth_token',
      '_medusa_jwt',
      'medusa_jwt_token'
    ];

    for (const key of possibleKeys) {
      const token = localStorage.getItem(key);
      if (token) return token;
    }

    // Auch aus Zustand Auth-Storage versuchen
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.token || null;
    }

    return null;
  } catch (error) {
    console.warn('Failed to get stored auth token');
    return null;
  }
};

// ✅ Helper: Token in localStorage speichern
const storeAuthToken = (token: string) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('medusa_auth_token', token);
    localStorage.setItem('auth_token', token); // Backup
  } catch (error) {
    console.warn('Failed to store auth token');
  }
};

// ✅ Helper: Headers für API-Requests
const getHeaders = (includeAuth: boolean = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-publishable-api-key': CONFIG.api.publishableKey,
  };

  // CORS-Header
  if (typeof window !== 'undefined') {
    headers['Origin'] = window.location.origin;
  }

  // Auth-Token hinzufügen falls erforderlich
  if (includeAuth) {
    const token = getStoredAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const authApi = {
  /**
   * Register customer - Medusa v2 mit verschiedenen Endpoints
   */
  async register(data: RegisterData) {
    console.log('🔐 Starting registration process...');

    // ✅ Verschiedene v2-Endpoints versuchen
    const registrationEndpoints = [
      '/store/auth/emailpass/register',          // Mit @medusajs/auth-emailpass
      '/store/auth/customer/emailpass/register', // Alternative v2 Struktur
      '/store/customers',                        // Klassischer Endpoint
    ];

    let lastError: any;

    for (const endpoint of registrationEndpoints) {
      try {
        console.log(`🔐 Trying registration endpoint: ${endpoint}`);

        const response = await fetch(`${CONFIG.api.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
            ...(data.phone && { phone: data.phone }),
          }),
        });

        console.log(`📥 Registration response (${endpoint}):`, response.status);

        if (response.ok) {
          const responseData = await response.json();
          console.log(`✅ Registration successful with endpoint: ${endpoint}`);

          // Token speichern falls vorhanden
          if (responseData.access_token || responseData.token) {
            storeAuthToken(responseData.access_token || responseData.token);
          }

          return {
            customer: responseData.customer || responseData.user || responseData,
            token: responseData.access_token || responseData.token,
            ...responseData
          };
        } else {
          const errorText = await response.text();
          console.log(`❌ Registration failed for ${endpoint}:`, response.status, errorText);

          // Bei 404 weiter versuchen, bei anderen Fehlern genauer hinschauen
          if (response.status === 404) {
            lastError = new Error(`Endpoint ${endpoint} not found`);
            continue; // Nächsten Endpoint versuchen
          }

          // Bei 401 oder 400 ist das ein echtes Problem
          if (response.status === 401) {
            lastError = new AuthError('Unauthorized: Customer-Registrierung möglicherweise deaktiviert');
            continue;
          }

          if (response.status === 400) {
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch {
              errorData = { message: errorText };
            }

            if (errorData.message?.includes('email') || errorData.message?.includes('unique')) {
              throw new AuthError('Email-Adresse wird bereits verwendet');
            }

            throw new AuthError(`Validation Error: ${errorData.message || 'Ungültige Eingabedaten'}`);
          }

          lastError = new Error(`${endpoint}: ${response.status} ${errorText}`);
        }
      } catch (endpointError: any) {
        console.log(`❌ Network/Parse error for ${endpoint}:`, endpointError);
        lastError = endpointError;

        // Bei AuthError nicht weiter versuchen
        if (endpointError instanceof AuthError) {
          throw endpointError;
        }
      }
    }

    // Wenn alle Endpoints fehlschlagen
    console.error('❌ All registration endpoints failed:', lastError);
    throw lastError || new AuthError('Registration failed: All endpoints unsuccessful');
  },

  /**
   * Login customer - Medusa v2 mit verschiedenen Endpoints
   */
  async login(credentials: LoginCredentials) {
    console.log('🔐 Starting login process...');

    // ✅ Verschiedene Login-Endpoints für v2
    const loginEndpoints = [
      '/store/auth/emailpass',                   // Mit @medusajs/auth-emailpass
      '/store/auth/customer/emailpass',          // Alternative v2 Struktur
      '/store/customers/me/auth',               // v2 Customer Auth
      '/store/auth',                            // v1 Fallback
    ];

    let lastError: any;

    for (const endpoint of loginEndpoints) {
      try {
        console.log(`🔐 Trying login endpoint: ${endpoint}`);

        const response = await fetch(`${CONFIG.api.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        console.log(`📥 Login response (${endpoint}):`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Login successful with endpoint: ${endpoint}`);

          // Token speichern
          if (data.access_token || data.token) {
            storeAuthToken(data.access_token || data.token);
          }

          const customer = data.customer || data.user;
          if (!customer) {
            throw new AuthError('Login successful but no customer data received');
          }

          return customer;
        } else {
          const errorText = await response.text();
          console.log(`❌ Login failed for ${endpoint}:`, response.status, errorText);

          if (response.status === 404) {
            lastError = new Error(`Endpoint ${endpoint} not found`);
            continue;
          }

          if (response.status === 401) {
            lastError = new AuthError('Invalid email or password');
            continue;
          }

          lastError = new Error(`${endpoint}: ${response.status} ${errorText}`);
        }
      } catch (endpointError: any) {
        console.log(`❌ Network error for ${endpoint}:`, endpointError);
        lastError = endpointError;

        if (endpointError instanceof AuthError) {
          throw endpointError;
        }
      }
    }

    // Wenn alle Endpoints fehlschlagen
    console.error('❌ All login endpoints failed:', lastError);
    throw lastError || new AuthError('Login failed: All endpoints unsuccessful');
  },

  /**
   * Logout customer
   */
  async logout() {
    try {
      console.log('🔐 Starting logout process...');

      // ✅ Verschiedene Logout-Endpoints versuchen
      const logoutEndpoints = [
        '/store/auth/session',
        '/store/auth/emailpass/session',
        '/store/customers/me/auth',
      ];

      for (const endpoint of logoutEndpoints) {
        try {
          await fetch(`${CONFIG.api.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(true),
            credentials: 'include',
          });
          console.log(`✅ Server logout successful: ${endpoint}`);
          break;
        } catch (error) {
          console.log(`❌ Server logout failed for ${endpoint}`);
        }
      }

      // ✅ Lokale Token immer löschen
      if (typeof window !== 'undefined') {
        const keysToRemove = [
          'medusa_auth_token',
          'auth_token',
          '_medusa_jwt',
          'medusa_jwt_token',
          'auth-storage',
        ];

        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
      }

      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout error:', error);

      // Bei Logout-Fehlern immer lokale Daten löschen
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    }
  },

  /**
   * Get current customer profile
   */
  async getCurrentCustomer() {
    try {
      console.log('🔐 Checking current customer...');

      const response = await fetch(`${CONFIG.api.baseUrl}/store/customers/me`, {
        headers: getHeaders(true),
        credentials: 'include',
        mode: 'cors',
      });

      console.log('📥 Current customer response:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('ℹ️ No active customer session (401)');
          return null;
        }

        const errorText = await response.text();
        throw new Error(`Get customer failed (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const customer = data.customer || data.user || data;

      if (customer && customer.email) {
        console.log('✅ Current customer found:', customer.email);
        return customer;
      } else {
        console.log('ℹ️ No valid customer data in response');
        return null;
      }
    } catch (error: any) {
      console.log('❌ Get current customer failed:', error);

      if (error?.message?.includes('401') || error?.status === 401) {
        return null;
      }

      throw new MedusaError(
        error?.message || 'Failed to get customer profile',
        error?.status,
        'CUSTOMER_FETCH_ERROR',
        'store/customers/me'
      );
    }
  },

  /**
   * Update customer profile
   */
  async updateProfile(data: UpdateProfileData) {
    try {
      console.log('🔐 Updating customer profile...');

      const response = await fetch(`${CONFIG.api.baseUrl}/store/customers/me`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log('📥 Profile update response:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Profile update failed:', response.status, errorText);

        if (response.status === 401) {
          throw new AuthError('You must be logged in to update your profile');
        }

        if (response.status === 400) {
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText };
          }

          if (errorData.message?.includes('email')) {
            throw new AuthError('Email address is already in use');
          }

          throw new AuthError(`Update failed: ${errorData.message}`);
        }

        throw new Error(`Profile update failed (${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      const customer = responseData.customer || responseData.user || responseData;

      console.log('✅ Profile updated successfully');
      return customer;
    } catch (error: any) {
      console.error('❌ Profile update error:', error);

      if (error instanceof AuthError) {
        throw error;
      }

      throw new MedusaError(
        error?.message || 'Profile update failed',
        error?.status,
        'PROFILE_UPDATE_ERROR',
        'store/customers/me'
      );
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    try {
      console.log('🔐 Requesting password reset for:', email);

      // ✅ Verschiedene Password-Reset Endpoints
      const resetEndpoints = [
        '/store/auth/emailpass/reset-password',
        '/store/customers/password-token',
        '/store/auth/reset-password',
      ];

      let lastError: any;

      for (const endpoint of resetEndpoints) {
        try {
          const response = await fetch(`${CONFIG.api.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ email }),
          });

          if (response.ok) {
            console.log(`✅ Password reset email sent via: ${endpoint}`);
            return;
          } else {
            const errorText = await response.text();
            lastError = new Error(`${endpoint}: ${response.status} ${errorText}`);
          }
        } catch (endpointError) {
          lastError = endpointError;
        }
      }

      throw lastError || new Error('Password reset failed');
    } catch (error: any) {
      console.error('❌ Password reset request failed:', error);
      throw new MedusaError(
        error?.message || 'Failed to send password reset email',
        error?.status,
        'PASSWORD_RESET_ERROR',
        'password-reset'
      );
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      console.log('🔐 Resetting password with token...');

      const resetEndpoints = [
        '/store/auth/emailpass/update-password',
        '/store/customers/password-reset',
        '/store/auth/update-password',
      ];

      let lastError: any;

      for (const endpoint of resetEndpoints) {
        try {
          const response = await fetch(`${CONFIG.api.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({
              token,
              password: newPassword,
            }),
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log(`✅ Password reset successful via: ${endpoint}`);
            return responseData;
          } else {
            const errorText = await response.text();

            if (response.status === 400) {
              throw new AuthError('Invalid or expired reset token');
            }

            lastError = new Error(`${endpoint}: ${response.status} ${errorText}`);
          }
        } catch (endpointError) {
          lastError = endpointError;

          if (endpointError instanceof AuthError) {
            throw endpointError;
          }
        }
      }

      throw lastError || new Error('Password reset failed');
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);

      if (error instanceof AuthError) {
        throw error;
      }

      throw new MedusaError(
        error?.message || 'Failed to reset password',
        error?.status,
        'PASSWORD_RESET_ERROR',
        'password-reset'
      );
    }
  },

  /**
   * Check if user has valid session
   */
  async hasValidSession(): Promise<boolean> {
    try {
      const customer = await this.getCurrentCustomer();
      return !!customer;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get stored auth token
   */
  getStoredToken: () => getStoredAuthToken(),

  /**
   * Refresh current user data
   */
  async refreshCurrentUser() {
    try {
      console.log('🔐 Refreshing current user...');
      return await this.getCurrentCustomer();
    } catch (error: any) {
      console.error('❌ Refresh user failed:', error);

      if (error?.status === 401) {
        return null;
      }

      throw error;
    }
  },

  /**
   * Verify email address (if your backend supports it)
   */
  async verifyEmail(token: string) {
    try {
      console.log('🔐 Verifying email...');

      const response = await fetch(`${CONFIG.api.baseUrl}/store/customers/email/verify`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Email verification failed (${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      console.log('✅ Email verified successfully');
      return responseData;
    } catch (error: any) {
      console.error('❌ Email verification failed:', error);
      throw new MedusaError(
        error?.message || 'Email verification failed',
        error?.status,
        'EMAIL_VERIFICATION_ERROR',
        'store/customers/email/verify'
      );
    }
  },

  /**
   * Change password (authenticated user)
   */
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      console.log('🔐 Changing password...');

      const response = await fetch(`${CONFIG.api.baseUrl}/store/customers/me/password`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 401) {
          throw new AuthError('Current password is incorrect');
        }

        if (response.status === 400) {
          throw new AuthError('New password does not meet requirements');
        }

        throw new Error(`Password change failed (${response.status}): ${errorText}`);
      }

      console.log('✅ Password changed successfully');
      return await response.json();
    } catch (error: any) {
      console.error('❌ Password change failed:', error);

      if (error instanceof AuthError) {
        throw error;
      }

      throw new MedusaError(
        error?.message || 'Password change failed',
        error?.status,
        'PASSWORD_CHANGE_ERROR',
        'store/customers/me/password'
      );
    }
  },

  /**
   * Debug: Test all auth endpoints
   */
  async debugEndpoints() {
    if (!CONFIG.debug?.enabled) return;

    console.log('🔍 Testing all auth endpoints...');

    const endpoints = [
      { method: 'GET', url: '/store/regions' },
      { method: 'GET', url: '/store/customers/me' },
      { method: 'POST', url: '/store/customers' },
      { method: 'POST', url: '/store/auth/emailpass/register' },
      { method: 'POST', url: '/store/auth/customer/emailpass/register' },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${CONFIG.api.baseUrl}${endpoint.url}`, {
          method: endpoint.method,
          headers: getHeaders(endpoint.url.includes('/me')),
          credentials: 'include',
        });

        console.log(`${endpoint.method} ${endpoint.url}:`, response.status, response.statusText);
      } catch (error) {
        console.log(`${endpoint.method} ${endpoint.url}: Network Error`);
      }
    }
  },
};

// ✅ Debug-Helper exportieren
export const debugAuth = authApi.debugEndpoints;
