import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cast process to any to resolve TS error "Property 'cwd' does not exist on type 'Process'"
  const env = loadEnv(mode, (process as any).cwd(), '');
  const apiKey = process.env.API_KEY ?? env.API_KEY ?? '';
  return {
    plugins: [react()],
    // This allows process.env.API_KEY to work in the browser
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    base: './', // Ensures assets are loaded correctly on GitHub Pages
  };
});