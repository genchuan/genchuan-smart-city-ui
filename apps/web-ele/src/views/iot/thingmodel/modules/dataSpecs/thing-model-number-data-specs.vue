<!-- dataType：number 数组类型 -->
<script lang="ts" setup>
import type { Ref } from 'vue';
import type { DataSpecsNumberData } from '#/api/iot/thingmodel';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { useVModel } from '@vueuse/core';
import { ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus';

/** 数值型的 dataSpecs 配置组件 */
defineOptions({ name: 'ThingModelNumberDataSpecs' });

const props = defineProps<{ modelValue: any }>();
const emits = defineEmits(['update:modelValue']);
const dataSpecs = useVModel(
  props,
  'modelValue',
  emits,
) as Ref<DataSpecsNumberData>;

/** 单位发生变化时触发 */
const unitChange = (UnitSpecs: any) => {
  if (!UnitSpecs) return;
  const [unitName, unit] = String(UnitSpecs).split('-');
  dataSpecs.value.unitName = unitName;
  dataSpecs.value.unit = unit;
};
</script>

<template>
  <el-form-item label="取值范围">
    <div class="range-wrapper">
      <div class="range-input">
        <el-input v-model="dataSpecs.min" placeholder="请输入最小值" />
      </div>
      <span class="range-separator">~</span>
      <div class="range-input">
        <el-input v-model="dataSpecs.max" placeholder="请输入最大值" />
      </div>
    </div>
  </el-form-item>

  <el-form-item label="步长">
    <el-input v-model="dataSpecs.step" placeholder="请输入步长" />
  </el-form-item>

  <el-form-item label="单位">
    <el-select
      :model-value="
        dataSpecs.unit ? `${dataSpecs.unitName}-${dataSpecs.unit}` : ''
      "
      filterable
      placeholder="请选择单位"
      class="full-width"
      @change="unitChange"
    >
      <el-option
        v-for="(item, index) in getDictOptions(
          DICT_TYPE.IOT_THING_MODEL_UNIT,
          'string',
        )"
        :key="index"
        :label="`${item.label}-${item.value}`"
        :value="`${item.label}-${item.value}`"
      />
    </el-select>
  </el-form-item>
</template>

<style scoped>
.range-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.range-input {
  flex: 1;
}

.range-separator {
  margin: 0 8px;
}

.full-width {
  width: 100%;
}

/* 表单项嵌套样式调整 */
:deep(.el-form-item) .el-form-item {
  margin-bottom: 0;
}
</style>
