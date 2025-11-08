import { RetryOptions } from "./types";

/**
 * Creates a debounced version of the provided function that delays its execution 
 * until after the specified delay has elapsed since the last time it was invoked.
 *
 * @template T - The type of the function to debounce.
 * @param {T} fn - The function to debounce.
 * @param {number} [delay=300] - The delay in milliseconds to wait before invoking the function.
 * @returns {(...args: Parameters<T>) => void} - A debounced version of the input function.
 */
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Creates a throttled version of the provided function that only invokes the 
 * function at most once per specified interval.
 *
 * @template T - The type of the function to throttle.
 * @param {T} fn - The function to throttle.
 * @param {number} [interval=300] - The interval in milliseconds to limit function calls.
 * @returns {(...args: Parameters<T>) => void} - A throttled version of the input function.
 */
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval = 300
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn(...args);
    }
  };
}

/**
 * Returns a promise that resolves after the specified delay in milliseconds.
 *
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retries an asynchronous function a specified number of times with a delay 
 * between each attempt, optionally retrying only on certain errors.
 *
 * @template T - The return type of the function to retry.
 * @param {() => Promise<T>} fn - The asynchronous function to retry.
 * @param {RetryOptions} options - Configuration options for retries.
 * @param {number} options.retries - Number of retry attempts.
 * @param {number} [options.delayMs=1000] - Delay in milliseconds between retries.
 * @param {(error: any) => boolean} [options.shouldRetry] - Optional function to determine whether to retry based on the error.
 * @returns {Promise<T>} - The result of the function if successful.
 * @throws Will throw the last encountered error if all retries fail or if `shouldRetry` returns false.
 */
async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { retries, delayMs = 1000, shouldRetry = () => true } = options;

  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries || !shouldRetry(error)) {
        throw error;
      }
      attempt++;
      await wait(delayMs);
    }
  }

  throw new Error("Retry failed unexpectedly");
}

export { debounce, throttle, retry };
