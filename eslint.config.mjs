// @ts-check

import { defineConfig } from '@vben/eslint-config';

// export default defineConfig();
export default defineConfig([
  {
    rules: {
      // 降低规则级别为警告
      'perfectionist/sort-imports': 'warn',
      'perfectionist/sort-exports': 'warn',
      'prettier/prettier': 'warn',
    },
  },
]);
