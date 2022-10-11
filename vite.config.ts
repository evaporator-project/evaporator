import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { themePreprocessorPlugin } from '@zougt/vite-plugin-theme-preprocessor';
import themePreprocessorOptions from './config/themePreprocessorOptions';
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    themePreprocessorPlugin(themePreprocessorOptions),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // modifyVars: {
        //   'primary-color': '#1DA57A',
        //   'link-color': '#1DA57A',
        //   'border-radius-base': '2px',
        // },
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
