import { defineConfig } from '@vben/vite-config';
import { loadEnv } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async (config) => {
  const { mode } = config;
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    application: {},
    vite: {
      css: {
        postcss: {
          plugins: [
            tailwindcss({
              content: [
                './node_modules/@tinyflow-ai/vue/dist/**/*.{js,ts,vue}',
              ],
            }),
            autoprefixer(),
          ],
        },
      },
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