<script setup lang="ts">
import { computed } from 'vue';

// import { isHexColor } from '@/utils/color' // TODO @芋艿：【可优化】增加 cssClass 的处理 https://gitee.com/yudaocode/yudao-ui-admin-vben/blob/v2.4.1/src/components/DictTag/src/DictTag.vue#L60 @xingyu：这个要适配掉 ele 版本里么？
import { getDictObj } from '@vben/hooks';

import { ElTag } from 'element-plus';

interface DictTagProps {
  type: string; // 字典类型
  value: any; // 字典值
  icon?: string; // 图标
}

const props = defineProps<DictTagProps>();

/** 获取字典标签 */
const dictTag = computed(() => {
  const defaultDict = {
    label: '',
    colorType: 'primary',
  };
  // 校验参数有效性
  if (!props.type || props.value === undefined || props.value === null) {
    return defaultDict;
  }

  // 获取字典对象
  const dict = getDictObj(props.type, String(props.value));
  if (!dict) {
    return defaultDict;
  }

  // 处理颜色类型 - 支持所有字典配置的颜色类型
  let colorType = dict.colorType || 'primary';
  
  // 将后端的颜色类型映射到Element Plus支持的颜色类型
  const colorTypeMap: Record<string, string> = {
    'danger': 'danger',
    'error': 'danger',
    'info': 'info',
    'primary': 'primary',
    'success': 'success',
    'warning': 'warning',
    'blue': 'primary',
    'green': 'success',
    'orange': 'warning',
    'cyan': 'info',
    'purple': 'primary',
    'pink': 'danger',
    'red': 'danger',
    'yellow': 'warning',
  };
  
  // 如果colorType在映射表中，使用映射后的值
  if (colorTypeMap[colorType]) {
    colorType = colorTypeMap[colorType];
  } else if (!['danger', 'info', 'primary', 'success', 'warning'].includes(colorType)) {
    // 如果是不支持的颜色类型，默认使用primary
    colorType = 'primary';
  }

  return {
    label: dict.label || '',
    colorType,
  };
});
</script>

<template>
  <ElTag v-if="dictTag.label" :type="dictTag.colorType as any">
    {{ dictTag.label }}
  </ElTag>
</template>
