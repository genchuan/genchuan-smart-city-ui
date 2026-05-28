<script setup lang="ts">
import type { TriggerCondition } from '#/api/iot/rule/scene';

import { computed, nextTick } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import { ElButton } from 'element-plus';

import {
  IotRuleSceneTriggerConditionParameterOperatorEnum,
  IotRuleSceneTriggerConditionTypeEnum,
} from '#/views/iot/utils/constants';

import ConditionConfig from './condition-config.vue';

/** 子条件组配置组件 */
defineOptions({ name: 'SubConditionGroupConfig' });

const props = defineProps<{
  maxConditions?: number;
  modelValue: TriggerCondition[];
  triggerType: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TriggerCondition[]): void;
}>();

const subGroup = useVModel(props, 'modelValue', emit);

const maxConditions = computed(() => props.maxConditions || 3); // 最大条件数量

/** 添加条件 */
async function addCondition() {
  // 确保 subGroup.value 是一个数组
  if (!subGroup.value) {
    subGroup.value = [];
  }

  // 检查是否达到最大条件数量限制
  if (subGroup.value?.length >= maxConditions.value) {
    return;
  }

  const newCondition: TriggerCondition = {
    type: IotRuleSceneTriggerConditionTypeEnum.DEVICE_PROPERTY.toString(), // 默认为设备属性
    productId: undefined,
    deviceId: undefined,
    identifier: '',
    operator: IotRuleSceneTriggerConditionParameterOperatorEnum.EQUALS.value, // 使用枚举默认值
    param: '',
  };

  // 使用 nextTick 确保响应式更新完成后再添加新条件
  await nextTick();
  if (subGroup.value) {
    subGroup.value.push(newCondition);
  }
}

/**
 * 移除条件
 * @param index 条件索引
 */
function removeCondition(index: number) {
  if (subGroup.value) {
    subGroup.value.splice(index, 1);
  }
}

/**
 * 更新条件
 * @param index 条件索引
 * @param condition 条件对象
 */
function updateCondition(index: number, condition: TriggerCondition) {
  if (subGroup.value) {
    subGroup.value[index] = condition;
  }
}
</script>

<template>
  <div class="sub-condition-group">
    <!-- 空状态 -->
    <div v-if="!subGroup || subGroup.length === 0" class="empty-state">
      <div class="empty-content">
        <IconifyIcon icon="lucide:plus" class="empty-icon" />
        <div class="empty-text">
          <p class="empty-title">暂无条件</p>
          <p class="empty-hint">点击下方按钮添加第一个条件</p>
        </div>
        <el-button type="primary" @click="addCondition">
          <IconifyIcon icon="lucide:plus" />
          添加条件
        </el-button>
      </div>
    </div>

    <!-- 条件列表 -->
    <div v-else class="conditions-list">
      <div
        v-for="(condition, conditionIndex) in subGroup"
        :key="`condition-${conditionIndex}`"
        class="condition-wrapper"
      >
        <!-- 条件配置 -->
        <div class="condition-card">
          <div class="condition-header">
            <div class="header-left">
              <div class="condition-badge">{{ conditionIndex + 1 }}</div>
              <span class="condition-title">条件 {{ conditionIndex + 1 }}</span>
            </div>
            <el-button
              v-if="subGroup!.length > 1"
              type="danger"
              size="small"
              text
              @click="removeCondition(conditionIndex)"
            >
              <IconifyIcon icon="lucide:trash-2" />
            </el-button>
          </div>

          <div class="condition-body">
            <ConditionConfig
              :model-value="condition"
              @update:model-value="
                (value: TriggerCondition) =>
                  updateCondition(conditionIndex, value)
              "
              :trigger-type="triggerType"
            />
          </div>
        </div>
      </div>

      <!-- 添加条件按钮 -->
      <div
        v-if="
          subGroup && subGroup.length > 0 && subGroup.length < maxConditions
        "
        class="add-more"
      >
        <el-button type="primary" plain @click="addCondition">
          <IconifyIcon icon="lucide:plus" />
          继续添加条件
        </el-button>
        <span class="add-hint">最多可添加 {{ maxConditions }} 个条件</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-condition-group {
  padding: 16px;
}

.empty-state {
  padding: 24px 0;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 32px;
  color: #909399;
}

.empty-text {
  color: #909399;
}

.empty-title {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 700;
}

.empty-hint {
  font-size: 12px;
}

.conditions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.condition-wrapper {
  position: relative;
}

.condition-card {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.condition-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 4px 4px 0 0;
  background-color: #fafafa;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.condition-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background-color: #409eff;
  border-radius: 50%;
}

.condition-title {
  font-size: 16px;
  font-weight: 700;
  color: #409eff;
}

.condition-body {
  padding: 12px;
}

.add-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  text-align: center;
}

.add-hint {
  display: block;
  font-size: 12px;
  color: #909399;
}

/* 按钮文本样式 */
:deep(.el-button.is-text) {
  color: #f56c6c;
}

:deep(.el-button.is-text:hover) {
  background-color: rgba(245, 108, 108, 0.1);
}
</style>
