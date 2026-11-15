import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Keep the Laravel origin server-side in development. Browser requests stay
  // relative, which also works through Arena's preview host.
  const env = loadEnv(mode, process.cwd(), '');
  const proxy = env.BMS_PROXY_TARGET ? { '/api': { target: env.BMS_PROXY_TARGET, changeOrigin: true } } : undefined;
  return {
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { host: '0.0.0.0', port: 5173, allowedHosts: ['.e2b.app'], proxy },
    preview: { host: '0.0.0.0', port: 5173, allowedHosts: ['.e2b.app'], proxy },
  };
});
