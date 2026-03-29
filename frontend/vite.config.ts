import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_API_KEY || env.GEMINI_API_KEY || '';
  const supabaseUrl = env.VITE_SUPABASE_URL || '';
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || '';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    plugins: [react()],
    css: {
      postcss: './postcss.config.js',
    },
    define: {
      'process.env.VITE_API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
