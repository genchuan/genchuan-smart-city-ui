import { defineConfig } from '@vben/vite-config';
import { loadEnv } from 'vite';

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
            {
              postcssPlugin: 'fix-tinyflow',
              Once(root) {
                // 强制移除 @tinyflow-ai/vue 里的 @layer 报错代码
                root.walkAtRules((rule) => {
                  if (
                    rule.source?.input?.file?.includes('@tinyflow-ai/vue') &&
                    (rule.name === 'layer' || rule.name === 'tailwind')
                  ) {
                    rule.remove();
                  }
                });
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