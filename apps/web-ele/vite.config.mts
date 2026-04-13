import { defineConfig } from '@vben/vite-config';
import { loadEnv } from 'vite';

export default defineConfig(async (config) => {
  const { mode } = config;
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    application: {},
    vite: {
      
      // ✅ 只加这一小段！只屏蔽报错，不修改任何样式！
      css: {
        postcss: {
          plugins: [
            {
              postcssPlugin: 'ignore-warning',
              OnceExit(_, result) {
                const warnings = result.warnings();
                for (const w of warnings) {
                  if (w.text.includes('@layer base')) {
                    result.messages = result.messages.filter(m => m !== w);
                  }
                }
              }
            }
          ]
        }
      },

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