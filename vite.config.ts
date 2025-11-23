import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Casting process to any to fix: Property 'cwd' does not exist on type 'Process'.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so standard env vars work
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    server: {
      port: 3000,
    },
  };
});