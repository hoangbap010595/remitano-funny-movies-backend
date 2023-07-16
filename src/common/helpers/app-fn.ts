const MIN = 3000;
const MAX = 10000;

/**
 * Exists due to failing e2e tests where the port 3000 was occupied suddenly.
 * Nest.js somehow initializes test modules with port 3000.
 * Therefor I overwrote every test case and assigned a random port. 🤷‍♂️
 * Maybe you as a reader in the future know how to fix it 'properly'.
 * My solution feels like a hack but it works 🤓
 */

export function getRandomPort() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}
