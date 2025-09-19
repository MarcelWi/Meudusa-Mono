// lib/api/config.ts - Zentrale Medusa-Konfiguration
export const CONFIG = {
  api: {
    baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000",
    publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "",
    maxRetries: parseInt(import.meta.env.VITE_MEDUSA_MAX_RETRIES || '3'),
    timeout: 10000,
    retryDelay: 1000,
  },
  debug: {
    enabled: import.meta.env.DEV && import.meta.env.VITE_DEBUG_MEDUSA === 'true',
    healthCheck: import.meta.env.DEV,
    errorReporting: import.meta.env.PROD,
  },
  auth: {
    storageMethod: 'localStorage' as const,
    tokenType: 'jwt' as const,
  },
  app: {
    environment: import.meta.env.VITE_APP_ENV || 'development',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
} as const;

// ✅ Validation-Funktion
export const validateConfig = () => {
  const missing = [];

  if (!CONFIG.api.publishableKey) {
    missing.push('VITE_MEDUSA_PUBLISHABLE_KEY');
  }

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // ✅ URL Sanitization
  const sanitizedBaseUrl = CONFIG.api.baseUrl.replace(/\/$/, '');

  console.log('✅ API configuration validated');
  console.log('🔧 Medusa Config:', {
    baseUrl: sanitizedBaseUrl,
    hasKey: !!CONFIG.api.publishableKey,
    keyPrefix: CONFIG.api.publishableKey.substring(0, 8) + '...',
    maxRetries: CONFIG.api.maxRetries,
    debug: CONFIG.debug.enabled,
    environment: CONFIG.app.environment,
  });

  return {
    ...CONFIG,
    api: {
      ...CONFIG.api,
      baseUrl: sanitizedBaseUrl,
    }
  };
};

// ✅ Type Exports
export type ConfigType = typeof CONFIG;
