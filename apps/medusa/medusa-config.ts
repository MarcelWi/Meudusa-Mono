// medusa-config.ts - Korrekte Provider-ID
import { loadEnv, defineConfig } from '@medusajs/utils'

loadEnv(process.env.NODE_ENV, process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:5173",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:5173",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    workerMode: process.env.MEDUSA_WORKER_MODE || "shared",
  },

  // ✅ Korrekte Provider-Konfiguration
  modules: [
    {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {
              // ✅ Alle EmailPass-Optionen explizit
              emailField: "email",
              passwordField: "password",
              // Hash-Optionen
              hashConfig: {
                rounds: 12
              }
            }
          }
        ]
      }
    },
    {
      resolve: "@medusajs/customer"
    }
  ]
})
