// lib/error-handling.ts

// Type-only import um das Vite-Problem zu lösen
import type { ApiError } from './types';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }
  return "Unknown error occurred";
}

export function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export function logError(context: string, error: unknown): void {
  console.error(`[${context}] Error:`, error);

  // Hier könntest du auch Error Tracking einbauen (Sentry, etc.)
  // trackError(error, context);
}

// Type Guard für ApiError (falls zur Runtime benötigt)
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

// Erweiterte Error-Handling-Funktionen
export function createApiError(message: string, status?: number, code?: string): ApiError {
  return {
    message,
    status,
    code,
  };
}

export function formatApiError(error: ApiError): string {
  let formatted = error.message;
  if (error.status) {
    formatted = `${error.status}: ${formatted}`;
  }
  if (error.code) {
    formatted = `[${error.code}] ${formatted}`;
  }
  return formatted;
}
