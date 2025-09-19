// lib/medusa.client.ts - Minimale Konfiguration
import Medusa from "@medusajs/js-sdk";
import { validateConfig } from "./api/config";

const config = validateConfig();

// ✅ Nur die erforderlichen Optionen
const medusaClient = new Medusa({
  baseUrl: config.api.baseUrl,
  publishableKey: config.api.publishableKey,
  debug: config.debug.enabled,
});

// ✅ Error Handler
if (typeof medusaClient.on === 'function') {
  medusaClient.on('error', (error: any) => {
    console.error('🔥 Medusa Client Error:', error);
  });
}

console.log('✅ Medusa client initialized');

export { medusaClient };
export { config as MEDUSA_CONFIG };
