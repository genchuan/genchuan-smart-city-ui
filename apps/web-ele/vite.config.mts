import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/admin-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/admin-api/, ''),
            // mock代理目标地址
            target: 'http://localhost:48080/admin-api',
            ws: true,
          },
          '/thingsBoard-api': {
            target: env.VITE_THINGS_BOARD_URL,
            ws: false,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/thingsBoard-api/, ''),
          },
        },
      },
    },
  };
});
