// lib/api/errors.ts
export class MedusaError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly endpoint?: string
  ) {
    super(message);
    this.name = 'MedusaError';
  }

  // ✅ Utility-Methoden für bessere Error-Handling
  isClientError(): boolean {
    return !!(this.status && this.status >= 400 && this.status < 500);
  }

  isServerError(): boolean {
    return !!(this.status && this.status >= 500);
  }

  isTimeout(): boolean {
    return this.code === 'TIMEOUT';
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export class TimeoutError extends MedusaError {
  constructor(endpoint?: string) {
    super('Request timeout: Backend took too long to respond', undefined, 'TIMEOUT', endpoint);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends MedusaError {
  constructor(message: string, field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthError extends MedusaError {
  constructor(message: string) {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}
