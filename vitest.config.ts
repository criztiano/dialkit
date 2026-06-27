import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // The functions under test are pure and DOM-free (the AudioBuffer is faked and
    // duck-typed), so the plain Node environment is enough — no jsdom needed.
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
