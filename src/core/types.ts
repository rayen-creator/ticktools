export type RetryOptions = {
  retries: number;
  delayMs?: number;
  shouldRetry?: (error: any) => boolean;
};