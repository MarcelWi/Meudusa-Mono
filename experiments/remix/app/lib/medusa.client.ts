import Medusa from "@medusajs/js-sdk";

const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;

console.log("Config:", {
  baseUrl: MEDUSA_BACKEND_URL,
  hasKey: !!PUBLISHABLE_KEY
});

const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
  maxRetries: 3,
  auth: {
    type: "jwt" as const,
    jwtTokenStorageMethod: "memory" as const,
  },
  debug: import.meta.env.DEV,
});
console.log('medusaClient initialized:', medusaClient);
export { medusaClient };