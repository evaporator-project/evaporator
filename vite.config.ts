import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// @ts-ignore
import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'
// gzip压缩
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  plugins: [
    importToCDN.default({
      modules: [
        autoComplete('react'),
        autoComplete('react-dom'),
        autoComplete('axios'),
        autoComplete('antd'),
        autoComplete('ahooks')
      ],
    }),
    react({
      jsxImportSource: '@emotion/react',
    }),
    viteCompression(),
  ],
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
  }
});
