<!-- 值输入组件 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import { ElDatePicker, ElInput, ElOption, ElSelect, ElTag, ElTooltip } from 'element-plus';

import {
  IoTDataSpecsDataTypeEnum,
  IotRuleSceneTriggerConditionParameterOperatorEnum,
} from '#/views/iot/utils/constants';

/** 值输入组件 */
defineOptions({ name: 'ValueInput' });

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

interface Props {
  modelValue?: string;
  propertyType?: string;
  operator?: string;
  propertyConfig?: any;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const localValue = useVModel(props, 'modelValue', emit, {
  defaultValue: '',
});

const rangeStart = ref(''); // 范围开始值
const rangeEnd = ref(''); // 范围结束值
const dateValue = ref(''); // 日期值
const numberValue = ref<number>(); // 数字值

/** 计算属性：枚举选项 */
const enumOptions = computed(() => {
  if (props.propertyConfig?.enum) {
    return props.propertyConfig.enum.map((item: any) => ({
      label: item.name || item.label || item.value,
      value: item.value,
    }));
  }
  return [];
});

/** 计算属性：列表预览 */
const listPreview = computed(() => {
  if (
    props.operator ===
    IotRuleSceneTriggerConditionParameterOperatorEnum.IN.value &&
    localValue.value
  ) {
    return localValue.value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
});

/** 判断是否为数字类型 */
function isNumericType() {
  return [
    IoTDataSpecsDataTypeEnum.DOUBLE,
    IoTDataSpecsDataTypeEnum.FLOAT,
    IoTDataSpecsDataTypeEnum.INT,
  ].includes((props.propertyType || '') as any);
}

/** 获取输入框类型 */
function getInputType() {
  switch (props.propertyType) {
    case IoTDataSpecsDataTypeEnum.DOUBLE:
    case IoTDataSpecsDataTypeEnum.FLOAT:
    case IoTDataSpecsDataTypeEnum.INT: {
      return 'number';
    }
    default: {
      return 'text';
    }
  }
}

/** 获取占位符文本 */
function getPlaceholder() {
  const typeMap: Record<string, string> = {
    [IoTDataSpecsDataTypeEnum.TEXT]: '请输入字符串',
    [IoTDataSpecsDataTypeEnum.INT]: '请输入整数',
    [IoTDataSpecsDataTypeEnum.FLOAT]: '请输入浮点数',
    [IoTDataSpecsDataTypeEnum.DOUBLE]: '请输入双精度数',
    [IoTDataSpecsDataTypeEnum.STRUCT]: '请输入 JSON 格式数据',
    [IoTDataSpecsDataTypeEnum.ARRAY]: '请输入数组格式数据',
  };
  return typeMap[props.propertyType || ''] || '请输入值';
}

/** 获取数字精度 */
function getPrecision() {
  return props.propertyType === IoTDataSpecsDataTypeEnum.INT ? 0 : 2;
}

/** 获取数字步长 */
function getStep() {
  return props.propertyType === IoTDataSpecsDataTypeEnum.INT ? 1 : 0.1;
}

/** 获取最小值 */
function getMin() {
  return props.propertyConfig?.min !== undefined ? props.propertyConfig.min : undefined;
}

/** 获取最大值 */
function getMax() {
  return props.propertyConfig?.max !== undefined ? props.propertyConfig.max : undefined;
}

/** 处理范围变化事件 */
function handleRangeChange() {
  localValue.value =
    rangeStart.value && rangeEnd.value
      ? `${rangeStart.value},${rangeEnd.value}`
      : '';
}

/** 处理日期变化事件 */
function handleDateChange(value: string | null) {
  localValue.value = value || '';
}

/** 处理数字变化事件 */
function handleNumberChange(value: number | undefined) {
  localValue.value = value?.toString() || '';
}

/** 监听操作符变化 */
watch(
  () => props.operator,
  () => {
    localValue.value = '';
    rangeStart.value = '';
    rangeEnd.value = '';
    dateValue.value = '';
    numberValue.value = undefined;
  },
);
</script>

<template>
  <div class="value-input">
    <!-- 布尔值选择 -->
    <el-select
      v-if="propertyType === IoTDataSpecsDataTypeEnum.BOOL"
      v-model="localValue"
      placeholder="请选择布尔值"
      class="full-width"
    >
      <el-option label="真 (true)" :value="true" />
      <el-option label="假 (false)" :value="false" />
    </el-select>

    <!-- 枚举值选择 -->
    <el-select
      v-else-if="
        propertyType === IoTDataSpecsDataTypeEnum.ENUM && enumOptions.length > 0
      "
      v-model="localValue"
      placeholder="请选择枚举值"
      class="full-width"
    >
      <el-option
        v-for="option in enumOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>

    <!-- 范围输入 (between 操作符) -->
    <div
      v-else-if="
        operator ===
        IotRuleSceneTriggerConditionParameterOperatorEnum.BETWEEN.value
      "
      class="range-input"
    >
      <el-input
        v-model="rangeStart"
        :type="getInputType()"
        placeholder="最小值"
        class="flex-1"
        @input="handleRangeChange"
      />
      <span class="range-separator">至</span>
      <el-input
        v-model="rangeEnd"
        :type="getInputType()"
        placeholder="最大值"
        class="flex-1"
        @input="handleRangeChange"
      />
    </div>

    <!-- 列表输入 (in 操作符) -->
    <div
      v-else-if="
        operator === IotRuleSceneTriggerConditionParameterOperatorEnum.IN.value
      "
      class="list-input"
    >
      <el-input
        v-model="localValue"
        placeholder="请输入值列表，用逗号分隔"
        class="full-width"
      >
        <template #suffix>
          <el-tooltip content="多个值用逗号分隔，如：1,2,3" placement="top">
            <IconifyIcon icon="ep:question-filled" class="help-icon" />
          </el-tooltip>
        </template>
      </el-input>
      <div v-if="listPreview.length > 0" class="list-preview">
        <span class="preview-label">解析结果：</span>
        <el-tag
          v-for="(item, index) in listPreview"
          :key="index"
          size="small"
          class="preview-tag"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>

    <!-- 日期时间输入 -->
    <el-date-picker
      v-else-if="propertyType === IoTDataSpecsDataTypeEnum.DATE"
      v-model="dateValue"
      type="datetime"
      placeholder="请选择日期时间"
      format="YYYY-MM-DD HH:mm:ss"
      value-format="YYYY-MM-DD HH:mm:ss"
      class="full-width"
      @change="handleDateChange"
    />

    <!-- 数字输入 -->
    <el-input-number
      v-else-if="isNumericType()"
      v-model="numberValue"
      :precision="getPrecision()"
      :step="getStep()"
      :min="getMin()"
      :max="getMax()"
      placeholder="请输入数值"
      class="full-width"
      @change="handleNumberChange"
    />

    <!-- 文本输入 -->
    <el-input
      v-else
      v-model="localValue"
      :type="getInputType()"
      :placeholder="getPlaceholder()"
      class="full-width"
    >
      <template #suffix>
        <el-tooltip
          v-if="propertyConfig?.unit"
          :content="`单位：${propertyConfig.unit}`"
          placement="top"
        >
          <span class="unit-suffix">{{ propertyConfig.unit }}</span>
        </el-tooltip>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.value-input {
  width: 100%;
  min-width: 0;
}

.full-width {
  width: 100%;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.range-separator {
  white-space: nowrap;
  font-size: 12px;
  color: #909399;
}

.flex-1 {
  flex: 1;
}

.list-input {
  width: 100%;
}

.list-preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.preview-label {
  font-size: 12px;
  color: #909399;
}

.preview-tag {
  margin: 0;
}

.help-icon {
  cursor: help;
  color: #c0c4cc;
}

.help-icon:hover {
  color: #909399;
}

.unit-suffix {
  padding: 0 4px;
  font-size: 12px;
  color: #909399;
}

/* 数字输入框样式 */
:deep(.el-input-number) {
  width: 100%;
}

/* 日期选择器样式 */
:deep(.el-date-editor) {
  width: 100%;
}
</style>
