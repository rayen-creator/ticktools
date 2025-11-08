
# ticktools

A lightweight TypeScript utility library for time-based functions like debounce, throttle, retry, and delay helpers.

## Installation

```bash
npm install ticktools
# or
yarn add ticktools
````

## Usage

```ts
import { debounce, throttle, retry, wait } from 'ticktools';

// Debounce example
const debouncedFn = debounce(() => {
  console.log('Called after 300ms of inactivity');
}, 300);

// Throttle example
const throttledFn = throttle(() => {
  console.log('Called at most once every 300ms');
}, 300);

// Retry example
const fetchWithRetry = () =>
  retry(() => fetch('https://api.example.com/data'), {
    retries: 3,
    delayMs: 1000,
    shouldRetry: (error) => error.message.includes('Network'),
  });

fetchWithRetry()
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);

// Wait example: delay execution
async function delayedLog() {
  console.log('Waiting 1 second...');
  await wait(1000);
  console.log('Done waiting!');
}

delayedLog();
```

## API

* `debounce(fn, delay)`: Returns a debounced version of `fn`.
* `throttle(fn, interval)`: Returns a throttled version of `fn`.
* `retry(fn, options)`: Retries an async function with options `{ retries, delayMs, shouldRetry }`.
* `wait(ms)`: Returns a Promise that resolves after `ms` milliseconds.




