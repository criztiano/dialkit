import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Honor a PORT env var when set (e.g. an auto-assigned preview port);
// `npm run dev` still pins 3000 via its --port flag.
export default defineConfig({
  plugins: [react()],
  server: process.env.PORT ? { port: Number(process.env.PORT), host: true } : undefined,
});
