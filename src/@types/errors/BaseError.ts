abstract class BaseError extends Error implements NodeJS.ErrnoException {
  constructor(
    readonly name: string,
    readonly message: string,
    readonly stack?: string,
    readonly payload?: unknown,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  toClientConsumable = (): Record<string, string | unknown> => {
    return {
      error: this.name,
      message: this.message,
      ...(this.payload ? { payload: this.payload } : {}),
    };
  };
}

export default BaseError;
