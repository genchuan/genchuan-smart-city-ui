import baseConfig from '@vben/tailwind-config';

export default {
  ...baseConfig,
  future: {
    respectDefaultLayers: false,
  },
  corePlugins: {
    preflight: false,
  },
  content: [],
};
