<script setup lang="ts">
import type { Trigger } from '#/api/iot/rule/scene';

import { onMounted } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import { ElButton, ElCard, ElEmpty, ElForm, ElFormItem, ElTag } from 'element-plus';

import { CronTab } from '#/components/cron-tab';
import {
  getTriggerTypeLabel,
  IotRuleSceneTriggerTypeEnum,
  isDeviceTrigger,
} from '#/views/iot/utils/constants';

import DeviceTriggerConfig from '../configs/device-trigger-config.vue';

/** 触发器配置组件 */
defineOptions({ name: 'TriggerSection' });

const props = defineProps<{
  triggers: Trigger[];
}>();

const emit = defineEmits<{
  (e: 'update:triggers', value: Trigger[]): void;
}>();

const triggers = useVModel(props, 'triggers', emit);

/** 获取触发器标签类型 */
function getTriggerTagType(
  type: number,
): 'danger' | 'info' | 'primary' | 'success' | 'warning' {
  if (type === IotRuleSceneTriggerTypeEnum.TIMER) {
    return 'warning';
  }
  return isDeviceTrigger(type) ? 'success' : 'info';
}

/** 添加触发器 */
function addTrigger() {
  const newTrigger: Trigger = {
    type: IotRuleSceneTriggerTypeEnum.DEVICE_STATE_UPDATE.toString(),
    productId: undefined,
    deviceId: undefined,
    identifier: undefined,
    operator: undefined,
    value: undefined,
    cronExpression: undefined,
    conditionGroups: [], // 空的条件组数组
  };
  triggers.value.push(newTrigger);
}

/**
 * 删除触发器
 * @param index 触发器索引
 */
function removeTrigger(index: number) {
  if (triggers.value.length > 1) {
    triggers.value.splice(index, 1);
  }
}

/**
 * 更新触发器类型
 * @param index 触发器索引
 * @param type 触发器类型
 */
function updateTriggerType(index: number, type: number) {
  triggers.value[index]!.type = type.toString();
  onTriggerTypeChange(index, type);
}

/**
 * 更新触发器设备配置
 * @param index 触发器索引
 * @param newTrigger 新的触发器对象
 */
function updateTriggerDeviceConfig(index: number, newTrigger: Trigger) {
  triggers.value[index] = newTrigger;
}

/**
 * 更新触发器 CRON 配置
 * @param index 触发器索引
 * @param cronExpression CRON 表达式
 */
function updateTriggerCronConfig(index: number, cronExpression?: string) {
  triggers.value[index]!.cronExpression = cronExpression;
}

/**
 * 处理触发器类型变化事件
 * @param index 触发器索引
 * @param _ 触发器类型（未使用）
 */
function onTriggerTypeChange(index: number, _: number) {
  const triggerItem = triggers.value[index]!;
  triggerItem.productId = undefined;
  triggerItem.deviceId = undefined;
  triggerItem.identifier = undefined;
  triggerItem.operator = undefined;
  triggerItem.value = undefined;
  triggerItem.cronExpression = undefined;
  triggerItem.conditionGroups = [];
}

/** 初始化：确保至少有一个触发器 */
onMounted(() => {
  if (triggers.value.length === 0) {
    addTrigger();
  }
});
</script>

<template>
  <el-card class="trigger-card" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <IconifyIcon icon="ep:lightning" class="header-icon" />
          <span class="header-title">触发器配置</span>
          <el-tag size="small" type="info">{{ triggers.length }} 个触发器</el-tag>
        </div>
        <div class="header-right">
          <el-button type="primary" size="small" @click="addTrigger">
            <IconifyIcon icon="lucide:plus" />
            添加触发器
          </el-button>
        </div>
      </div>
    </template>

    <div class="card-content">
      <!-- 触发器列表 -->
      <div v-if="triggers.length > 0" class="triggers-list">
        <div
          v-for="(triggerItem, index) in triggers"
          :key="`trigger-${index}`"
          class="trigger-item"
        >
          <!-- 触发器头部 - 绿色主题 -->
          <div class="trigger-header">
            <div class="trigger-header-left">
              <div class="trigger-number">
                <div class="trigger-number-badge">{{ index + 1 }}</div>
                <span>触发器 {{ index + 1 }}</span>
              </div>
              <el-tag
                size="small"
                :type="getTriggerTagType(triggerItem.type as any)"
              >
                {{ getTriggerTypeLabel(triggerItem.type as any) }}
              </el-tag>
            </div>
            <div class="trigger-header-right">
              <el-button
                v-if="triggers.length > 1"
                type="danger"
                size="small"
                text
                @click="removeTrigger(index)"
              >
                <IconifyIcon icon="lucide:trash-2" />
                删除
              </el-button>
            </div>
          </div>

          <!-- 触发器内容区域 -->
          <div class="trigger-content">
            <!-- 设备触发配置 -->
            <DeviceTriggerConfig
              v-if="isDeviceTrigger(triggerItem.type as any)"
              :model-value="triggerItem"
              :index="index"
              @update:model-value="
                (value) => updateTriggerDeviceConfig(index, value)
              "
              @trigger-type-change="(type) => updateTriggerType(index, type)"
            />

            <!-- 定时触发配置 -->
            <div
              v-else-if="
                triggerItem.type ===
                IotRuleSceneTriggerTypeEnum.TIMER.toString()
              "
              class="timer-config"
            >
              <div class="timer-header">
                <IconifyIcon icon="lucide:timer" class="timer-icon" />
                <span class="timer-title">定时触发配置</span>
              </div>

              <!-- CRON 表达式配置 -->
              <div class="cron-config">
                <el-form-item label="CRON表达式" required>
                  <CronTab
                    :model-value="triggerItem.cronExpression || '0 0 12 * * ?'"
                    @update:model-value="
                      (value) => updateTriggerCronConfig(index, value)
                    "
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty description="暂无触发器">
          <template #description>
            <div class="empty-description">
              <p class="empty-text">暂无触发器配置</p>
              <p class="empty-hint">请使用上方的"添加触发器"按钮来设置触发规则</p>
            </div>
          </template>
        </el-empty>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.trigger-card {
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #409eff;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 18px;
  color: #409eff;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.triggers-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.trigger-item {
  border-radius: 8px;
  border: 2px solid #95d475;
  background-color: #f0f9eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.trigger-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.trigger-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #95d475;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(135deg, #f0f9eb, #e8f5e9);
}

.trigger-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trigger-number {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #2e7d32;
}

.trigger-number-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background-color: #67c23a;
  border-radius: 50%;
}

.trigger-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trigger-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timer-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #fff;
  border: 1px solid #409eff;
  border-radius: 6px;
}

.timer-icon {
  font-size: 18px;
  color: #f56c6c;
}

.timer-title {
  font-size: 14px;
  font-weight: 500;
  color: #409eff;
}

.cron-config {
  padding: 16px;
  background-color: #fff;
  border: 1px solid #409eff;
  border-radius: 6px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-description {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-text {
  color: #909399;
}

.empty-hint {
  font-size: 12px;
  color: #409eff;
}

/* 表单项样式调整 */
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
