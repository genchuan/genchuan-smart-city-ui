<!-- JSON参数输入组件 - 通用版本 -->
<script setup lang="ts">
import type { JsonParamsInputType } from '#/views/iot/utils/constants';

import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import { ElButton, ElInput, ElPopover, ElTag } from 'element-plus';

import {
  IoTDataSpecsDataTypeEnum,
  JSON_PARAMS_EXAMPLE_VALUES,
  JSON_PARAMS_INPUT_CONSTANTS,
  JSON_PARAMS_INPUT_ICONS,
  JsonParamsInputTypeEnum,
} from '#/views/iot/utils/constants';

/** JSON参数输入组件 - 通用版本 */
defineOptions({ name: 'JsonParamsInput' });

const props = withDefaults(defineProps<Props>(), {
  type: JsonParamsInputTypeEnum.SERVICE,
  placeholder: JSON_PARAMS_INPUT_CONSTANTS.PLACEHOLDER,
});

const emit = defineEmits<Emits>();

interface JsonParamsConfig {
  // 服务配置
  service?: {
    inputParams?: any[];
    name: string;
  };
  // 事件配置
  event?: {
    name: string;
    outputParams?: any[];
  };
  // 属性配置
  properties?: any[];
  // 自定义配置
  custom?: {
    name: string;
    params: any[];
  };
}

interface Props {
  modelValue: string;
  config: JsonParamsConfig;
  type?: JsonParamsInputType;
  placeholder?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const localValue = useVModel(props, 'modelValue', emit, {
  defaultValue: '',
});

const paramsJson = ref(''); // JSON参数字符串
const jsonError = ref(''); // JSON验证错误信息

// 计算属性：参数列表
const paramsList = computed(() => {
  switch (props.type) {
    case JsonParamsInputTypeEnum.CUSTOM: {
      return props.config?.custom?.params || [];
    }
    case JsonParamsInputTypeEnum.EVENT: {
      return props.config?.event?.outputParams || [];
    }
    case JsonParamsInputTypeEnum.PROPERTY: {
      return props.config?.properties || [];
    }
    case JsonParamsInputTypeEnum.SERVICE: {
      return props.config?.service?.inputParams || [];
    }
    default: {
      return [];
    }
  }
});

// 计算属性：标题
const title = computed(() => {
  switch (props.type) {
    case JsonParamsInputTypeEnum.CUSTOM: {
      return JSON_PARAMS_INPUT_CONSTANTS.TITLES.CUSTOM(
        props.config?.custom?.name,
      );
    }
    case JsonParamsInputTypeEnum.EVENT: {
      return JSON_PARAMS_INPUT_CONSTANTS.TITLES.EVENT(
        props.config?.event?.name,
      );
    }
    case JsonParamsInputTypeEnum.PROPERTY: {
      return JSON_PARAMS_INPUT_CONSTANTS.TITLES.PROPERTY;
    }
    case JsonParamsInputTypeEnum.SERVICE: {
      return JSON_PARAMS_INPUT_CONSTANTS.TITLES.SERVICE(
        props.config?.service?.name,
      );
    }
    default: {
      return JSON_PARAMS_INPUT_CONSTANTS.TITLES.DEFAULT;
    }
  }
});

// 计算属性：标题图标
const titleIcon = computed(() => {
  switch (props.type) {
    case JsonParamsInputTypeEnum.CUSTOM: {
      return JSON_PARAMS_INPUT_ICONS.TITLE_ICONS.CUSTOM;
    }
    case JsonParamsInputTypeEnum.EVENT: {
      return JSON_PARAMS_INPUT_ICONS.TITLE_ICONS.EVENT;
    }
    case JsonParamsInputTypeEnum.PROPERTY: {
      return JSON_PARAMS_INPUT_ICONS.TITLE_ICONS.PROPERTY;
    }
    case JsonParamsInputTypeEnum.SERVICE: {
      return JSON_PARAMS_INPUT_ICONS.TITLE_ICONS.SERVICE;
    }
    default: {
      return JSON_PARAMS_INPUT_ICONS.TITLE_ICONS.DEFAULT;
    }
  }
});

// 计算属性：参数图标
const paramsIcon = computed(() => {
  switch (props.type) {
    case JsonParamsInputTypeEnum.CUSTOM: {
      return JSON_PARAMS_INPUT_ICONS.PARAMS_ICONS.CUSTOM;
    }
    case JsonParamsInputTypeEnum.EVENT: {
      return JSON_PARAMS_INPUT_ICONS.PARAMS_ICONS.EVENT;
    }
    case JsonParamsInputTypeEnum.PROPERTY: {
      return JSON_PARAMS_INPUT_ICONS.PARAMS_ICONS.PROPERTY;
    }
    case JsonParamsInputTypeEnum.SERVICE: {
      return JSON_PARAMS_INPUT_ICONS.PARAMS_ICONS.SERVICE;
    }
    default: {
      return JSON_PARAMS_INPUT_ICONS.PARAMS_ICONS.DEFAULT;
    }
  }
});

// 计算属性：参数标签
const paramsLabel = computed(() => {
  switch (props.type) {
    case JsonParamsInputTypeEnum.CUSTOM: {
      return JSON_PARAMS_INPUT_CONSTANTS.PARAMS_LABELS.CUSTOM;
    }
    case JsonParamsInputTypeEnum.EVENT: {
      return JSON_PARAMS_INPUT_CONSTANTS.PARAMS_LABELS.EVENT;
    }
    case JsonParamsInputTypeEnum.PROPERTY: {
      return JSON_PARAMS_INPUT_CONSTANTS.PARAMS_LABELS.PROPERTY;
    }
    case JsonParamsInputTypeEnum.SERVICE: {
      return JSON_PARAMS_INPUT_CONSTANTS.PARAMS_LABELS.SERVICE;
    }
    default: {
      return JSON_PARAMS_INPUT_CONSTANTS.PARAMS_LABELS.DEFAULT;
    }
  }
});

// 计算属性：空状态消息
const emptyMessage = computed(() => {
  switch (props.type) {
    case JsonParamsInputTypeEnum.CUSTOM: {
      return JSON_PARAMS_INPUT_CONSTANTS.EMPTY_MESSAGES.CUSTOM;
    }
    case JsonParamsInputTypeEnum.EVENT: {
      return JSON_PARAMS_INPUT_CONSTANTS.EMPTY_MESSAGES.EVENT;
    }
    case JsonParamsInputTypeEnum.PROPERTY: {
      return JSON_PARAMS_INPUT_CONSTANTS.EMPTY_MESSAGES.PROPERTY;
    }
    case JsonParamsInputTypeEnum.SERVICE: {
      return JSON_PARAMS_INPUT_CONSTANTS.EMPTY_MESSAGES.SERVICE;
    }
    default: {
      return JSON_PARAMS_INPUT_CONSTANTS.EMPTY_MESSAGES.DEFAULT;
    }
  }
});

/**
 * 处理参数变化事件
 */
function handleParamsChange() {
  try {
    jsonError.value = ''; // 清除之前的错误

    if (paramsJson.value.trim()) {
      const parsed = JSON.parse(paramsJson.value);
      localValue.value = paramsJson.value;

      // 额外的参数验证
      if (typeof parsed !== 'object' || parsed === null) {
        jsonError.value = JSON_PARAMS_INPUT_CONSTANTS.PARAMS_MUST_BE_OBJECT;
        return;
      }

      // 验证必填参数
      for (const param of paramsList.value) {
        if (
          param.required &&
          (!parsed[param.identifier] || parsed[param.identifier] === '')
        ) {
          jsonError.value = JSON_PARAMS_INPUT_CONSTANTS.PARAM_REQUIRED_ERROR(
            param.name,
          );
          return;
        }
      }
    } else {
      localValue.value = '';
    }

    // 验证通过
    jsonError.value = '';
  } catch (error) {
    jsonError.value = JSON_PARAMS_INPUT_CONSTANTS.JSON_FORMAT_ERROR(
      error instanceof Error
        ? error.message
        : JSON_PARAMS_INPUT_CONSTANTS.UNKNOWN_ERROR,
    );
  }
}

/**
 * 快速填充示例数据
 */
function fillExampleJson() {
  paramsJson.value = generateExampleJson();
  handleParamsChange();
}

/**
 * 清空参数
 */
function clearParams() {
  paramsJson.value = '';
  localValue.value = '';
  jsonError.value = '';
}

/**
 * 获取参数类型名称
 * @param dataType 数据类型
 * @returns 类型名称
 */
function getParamTypeName(dataType: string) {
  const typeMap: Record<string, string> = {
    [IoTDataSpecsDataTypeEnum.INT]: '整数',
    [IoTDataSpecsDataTypeEnum.FLOAT]: '浮点数',
    [IoTDataSpecsDataTypeEnum.DOUBLE]: '双精度',
    [IoTDataSpecsDataTypeEnum.TEXT]: '字符串',
    [IoTDataSpecsDataTypeEnum.BOOL]: '布尔值',
    [IoTDataSpecsDataTypeEnum.ENUM]: '枚举',
    [IoTDataSpecsDataTypeEnum.DATE]: '日期',
    [IoTDataSpecsDataTypeEnum.STRUCT]: '结构体',
    [IoTDataSpecsDataTypeEnum.ARRAY]: '数组',
  };
  return typeMap[dataType] || dataType;
}

/**
 * 获取参数类型标签样式
 * @param dataType 数据类型
 * @returns 标签样式
 */
function getParamTypeTag(dataType: string) {
  const tagMap: Record<string, string> = {
    [IoTDataSpecsDataTypeEnum.INT]: 'primary',
    [IoTDataSpecsDataTypeEnum.FLOAT]: 'success',
    [IoTDataSpecsDataTypeEnum.DOUBLE]: 'success',
    [IoTDataSpecsDataTypeEnum.TEXT]: 'info',
    [IoTDataSpecsDataTypeEnum.BOOL]: 'warning',
    [IoTDataSpecsDataTypeEnum.ENUM]: 'danger',
    [IoTDataSpecsDataTypeEnum.DATE]: 'primary',
    [IoTDataSpecsDataTypeEnum.STRUCT]: 'info',
    [IoTDataSpecsDataTypeEnum.ARRAY]: 'warning',
  };
  return tagMap[dataType] || 'info';
}

/**
 * 获取示例值
 * @param param 参数对象
 * @returns 示例值
 */
function getExampleValue(param: any) {
  const exampleConfig: any =
    JSON_PARAMS_EXAMPLE_VALUES[param.dataType] ||
    JSON_PARAMS_EXAMPLE_VALUES.DEFAULT;
  return exampleConfig.display;
}

/**
 * 生成示例JSON
 * @returns JSON字符串
 */
function generateExampleJson() {
  if (paramsList.value.length === 0) {
    return '{}';
  }

  const example: Record<string, any> = {};
  paramsList.value.forEach((param) => {
    const exampleConfig: any =
      JSON_PARAMS_EXAMPLE_VALUES[param.dataType] ||
      JSON_PARAMS_EXAMPLE_VALUES.DEFAULT;
    example[param.identifier] = exampleConfig.value;
  });

  return JSON.stringify(example, null, 2);
}

/**
 * 处理数据回显
 * @param value 值字符串
 */
function handleDataDisplay(value: string) {
  if (!value || !value.trim()) {
    paramsJson.value = '';
    jsonError.value = '';
    return;
  }

  try {
    const parsed = JSON.parse(value);
    paramsJson.value = JSON.stringify(parsed, null, 2);
    jsonError.value = '';
  } catch {
    paramsJson.value = value;
    jsonError.value = '';
  }
}

// 监听外部值变化
watch(
  () => localValue.value,
  async (newValue, oldValue) => {
    if (newValue === oldValue) return;
    await nextTick();
    handleDataDisplay(newValue || '');
  },
  { immediate: true },
);

// 组件挂载后也尝试处理一次数据回显
onMounted(async () => {
  await nextTick();
  if (localValue.value) {
    handleDataDisplay(localValue.value);
  }
});

// 监听配置变化
watch(
  () => props.config,
  (newConfig, oldConfig) => {
    if (
      JSON.stringify(newConfig) !== JSON.stringify(oldConfig) &&
      !localValue.value
    ) {
      paramsJson.value = '';
      jsonError.value = '';
    }
  },
);
</script>

<template>
  <div class="json-params-input">
    <!-- JSON 输入框 -->
    <div class="input-wrapper">
      <el-input
        v-model="paramsJson"
        type="textarea"
        :rows="4"
        :placeholder="placeholder"
        class="json-textarea"
        :class="{ 'is-error': jsonError }"
        @input="handleParamsChange"
      />
      <!-- 查看详细示例弹出层 -->
      <div class="info-btn">
        <el-popover
          placement="left-start"
          :width="450"
          trigger="click"
          :show-arrow="true"
          :offset="8"
        >
          <template #reference>
            <el-button text type="primary" circle size="small" :title="JSON_PARAMS_INPUT_CONSTANTS.VIEW_EXAMPLE_TITLE">
              <IconifyIcon icon="ep:info-filled" />
            </el-button>
          </template>

          <!-- 弹出层内容 -->
          <div class="popover-content">
            <div class="popover-header">
              <IconifyIcon :icon="titleIcon" class="header-icon" />
              <span class="header-title">{{ title }}</span>
            </div>

            <div class="popover-body">
              <!-- 参数列表 -->
              <div v-if="paramsList.length > 0">
                <div class="params-header">
                  <IconifyIcon :icon="paramsIcon" class="params-icon" />
                  <span class="params-title">{{ paramsLabel }}</span>
                </div>
                <div class="params-list">
                  <div
                    v-for="param in paramsList"
                    :key="param.identifier"
                    class="param-item"
                  >
                    <div class="param-info">
                      <div class="param-name">
                        {{ param.name }}
                        <el-tag
                          v-if="param.required"
                          size="small"
                          type="danger"
                          class="required-tag"
                        >
                          {{ JSON_PARAMS_INPUT_CONSTANTS.REQUIRED_TAG }}
                        </el-tag>
                      </div>
                      <div class="param-identifier">
                        {{ param.identifier }}
                      </div>
                    </div>
                    <div class="param-meta">
                      <el-tag :type="getParamTypeTag(param.dataType)" size="small">
                        {{ getParamTypeName(param.dataType) }}
                      </el-tag>
                      <span class="example-value">
                        {{ getExampleValue(param) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="json-example">
                  <div class="example-label">
                    {{ JSON_PARAMS_INPUT_CONSTANTS.COMPLETE_JSON_FORMAT }}
                  </div>
                  <pre class="example-code"><code>{{ generateExampleJson() }}</code></pre>
                </div>
              </div>

              <!-- 无参数提示 -->
              <div v-else class="empty-params">
                <p class="empty-text">{{ emptyMessage }}</p>
              </div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>

    <!-- 验证状态和错误提示 -->
    <div class="status-bar">
      <div class="status-info">
        <IconifyIcon
          :icon="
            jsonError
              ? JSON_PARAMS_INPUT_ICONS.STATUS_ICONS.ERROR
              : JSON_PARAMS_INPUT_ICONS.STATUS_ICONS.SUCCESS
          "
          :class="jsonError ? 'status-error' : 'status-success'"
          class="status-icon"
        />
        <span :class="jsonError ? 'status-error' : 'status-success'" class="status-text">
          {{ jsonError || JSON_PARAMS_INPUT_CONSTANTS.JSON_FORMAT_CORRECT }}
        </span>
      </div>

      <!-- 快速填充按钮 -->
      <div v-if="paramsList.length > 0" class="action-buttons">
        <span class="action-label">
          {{ JSON_PARAMS_INPUT_CONSTANTS.QUICK_FILL_LABEL }}
        </span>
        <el-button size="small" type="primary" plain @click="fillExampleJson">
          {{ JSON_PARAMS_INPUT_CONSTANTS.EXAMPLE_DATA_BUTTON }}
        </el-button>
        <el-button size="small" type="danger" plain @click="clearParams">
          {{ JSON_PARAMS_INPUT_CONSTANTS.CLEAR_BUTTON }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.json-params-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-wrapper {
  position: relative;
}

.json-textarea {
  width: 100%;
}

.json-textarea.is-error :deep(.el-textarea__inner) {
  border-color: #f56c6c;
}

.info-btn {
  position: absolute;
  right: 8px;
  top: 8px;
}

.popover-content {
  padding: 4px 0;
}

.popover-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.header-icon {
  font-size: 18px;
  color: #409eff;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #409eff;
}

.popover-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.params-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.params-icon {
  font-size: 16px;
  color: #409eff;
}

.params-title {
  font-size: 16px;
  font-weight: 700;
  color: #409eff;
}

.params-list {
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.param-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.param-info {
  flex: 1;
}

.param-name {
  font-size: 14px;
  font-weight: 700;
  color: #409eff;
}

.required-tag {
  margin-left: 4px;
}

.param-identifier {
  font-size: 12px;
  color: #909399;
}

.param-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.example-value {
  font-size: 12px;
  color: #909399;
}

.json-example {
  margin-left: 24px;
  margin-top: 12px;
}

.example-label {
  margin-bottom: 4px;
  font-size: 12px;
  color: #909399;
}

.example-code {
  overflow-x: auto;
  padding: 12px;
  font-size: 13px;
  color: #409eff;
  background-color: #f5f7fa;
  border-left: 3px solid #409eff;
  border-radius: 8px;
}

.empty-params {
  padding: 16px 0;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #909399;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  font-size: 14px;
}

.status-error {
  color: #f56c6c;
}

.status-success {
  color: #67c23a;
}

.status-text {
  font-size: 12px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-label {
  font-size: 12px;
  color: #909399;
}

/* 弹出层样式 */
:deep(.el-popover) {
  max-width: 500px;
}

:deep(.el-popover .el-popover__content) {
  padding: 16px;
}
</style>
