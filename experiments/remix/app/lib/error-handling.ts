import { ApiError } from './types';

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