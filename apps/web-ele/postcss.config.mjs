// export { default } from '@vben/tailwind-config/postcss';
import baseConfig from '@vben/tailwind-config/postcss';

export default {
  ...baseConfig,
  tailwindcss: {
    // 👇 关键：关闭对第三方CSS的@layer严格检查
    respectLayers: false,
  },
};
