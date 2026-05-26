<!-- dataType：array 数组类型 -->
<script lang="ts" setup>
import type { Ref } from 'vue';

import { useVModel } from '@vueuse/core';
import { ElFormItem, ElInput, ElRadio, ElRadioGroup } from 'element-plus';

import {
  getDataTypeOptions,
  IoTDataSpecsDataTypeEnum,
} from '#/views/iot/utils/constants';

import ThingModelStructDataSpecs from './thing-model-struct-data-specs.vue';

/** 数组型的 dataSpecs 配置组件 */
defineOptions({ name: 'ThingModelArrayDataSpecs' });

const props = defineProps<{ modelValue: any }>();
const emits = defineEmits(['update:modelValue']);
const dataSpecs = useVModel(props, 'modelValue', emits) as Ref<any>;

/** 元素类型改变时间。当值为 struct 时，对 dataSpecs 中的 dataSpecsList 进行初始化 */
function handleChange(val: any) {
  if (val !== IoTDataSpecsDataTypeEnum.STRUCT) {
    return;
  }
  dataSpecs.value.dataSpecsList = [];
}
</script>

<template>
  <el-form-item label="元素类型" prop="property.dataSpecs.childDataType">
    <el-radio-group v-model="dataSpecs.childDataType" @change="handleChange">
      <el-radio
        v-for="item in getDataTypeOptions()"
        :key="item.value"
        v-if="
          !(
            [
              IoTDataSpecsDataTypeEnum.ENUM,
              IoTDataSpecsDataTypeEnum.ARRAY,
              IoTDataSpecsDataTypeEnum.DATE,
            ] as any[]
          ).includes(item.value)
        "
        :value="item.value"
        class="radio-item"
      >
        {{ `${item.value}(${item.label})` }}
      </el-radio>
    </el-radio-group>
  </el-form-item>

  <el-form-item label="元素个数" prop="property.dataSpecs.size">
    <el-input
      v-model="dataSpecs.size"
      placeholder="请输入数组中的元素个数"
    />
  </el-form-item>

  <!-- Struct 型配置 -->
  <ThingModelStructDataSpecs
    v-if="dataSpecs.childDataType === IoTDataSpecsDataTypeEnum.STRUCT"
    v-model="dataSpecs.dataSpecsList"
  />
</template>

<style scoped>
.radio-item {
  width: 33.333333%;
}

/* 表单项嵌套样式调整 */
:deep(.el-form-item) .el-form-item {
  margin-bottom: 0;
}
</style>
