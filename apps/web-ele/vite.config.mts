import { defineConfig } from '@vben/vite-config';
import { loadEnv } from 'vite';

import ElementPlus from 'unplugin-element-plus/vue';

export default defineConfig(async (config) => {
  const { mode } = config;
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    application: {},
    vite: {
      // ✅ 只加这一段，只屏蔽报错，不碰任何样式
      css: {
        postcss: {
          plugins: [
            {
              postcssPlugin: 'ignore-layer-error',
              OnceExit(root, { result }) {
                result.warnings = result.warnings().filter(
                  (w) => !w.text.includes('@layer base')
                );
              },
            },
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
            target: 'http://localhost:4000',
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