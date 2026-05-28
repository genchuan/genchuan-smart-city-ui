<!-- 执行器配置组件 -->
<script setup lang="ts">
import type { Action } from '#/api/iot/rule/scene';

import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import { ElButton, ElCard, ElEmpty, ElForm, ElFormItem, ElOption, ElSelect, ElTag } from 'element-plus';

import {
  getActionTypeLabel,
  getActionTypeOptions,
  IotRuleSceneActionTypeEnum,
} from '#/views/iot/utils/constants';

import AlertConfig from '../configs/alert-config.vue';
import DeviceControlConfig from '../configs/device-control-config.vue';

/** 执行器配置组件 */
defineOptions({ name: 'ActionSection' });

const props = defineProps<{
  actions: Action[];
}>();

const emit = defineEmits<{
  (e: 'update:actions', value: Action[]): void;
}>();

const actions = useVModel(props, 'actions', emit);

/** 获取执行器标签类型 */
function getActionTypeTag(
  type: number,
): 'danger' | 'info' | 'primary' | 'success' | 'warning' {
  const actionTypeTags: Record<
    number,
    'danger' | 'info' | 'primary' | 'success' | 'warning'
    > = {
    [IotRuleSceneActionTypeEnum.DEVICE_PROPERTY_SET]: 'primary',
    [IotRuleSceneActionTypeEnum.DEVICE_SERVICE_INVOKE]: 'success',
    [IotRuleSceneActionTypeEnum.ALERT_TRIGGER]: 'danger',
    [IotRuleSceneActionTypeEnum.ALERT_RECOVER]: 'warning',
  } as const;
  return actionTypeTags[type] || 'info';
}

/** 判断是否为设备执行器类型 */
function isDeviceAction(type: number): boolean {
  const deviceActionTypes = [
    IotRuleSceneActionTypeEnum.DEVICE_PROPERTY_SET,
    IotRuleSceneActionTypeEnum.DEVICE_SERVICE_INVOKE,
  ] as number[];
  return deviceActionTypes.includes(type);
}

/** 判断是否为告警执行器类型 */
function isAlertAction(type: number): boolean {
  const alertActionTypes = [
    IotRuleSceneActionTypeEnum.ALERT_TRIGGER,
    IotRuleSceneActionTypeEnum.ALERT_RECOVER,
  ] as number[];
  return alertActionTypes.includes(type);
}

/**
 * 创建默认的执行器数据
 * @returns 默认执行器对象
 */
function createDefaultActionData(): Action {
  return {
    type: IotRuleSceneActionTypeEnum.DEVICE_PROPERTY_SET.toString(), // 默认为设备属性设置
    productId: undefined,
    deviceId: undefined,
    identifier: undefined, // 物模型标识符（服务调用时使用）
    params: undefined,
    alertConfigId: undefined,
  };
}

/**
 * 添加执行器
 */
function addAction() {
  const newAction = createDefaultActionData();
  actions.value.push(newAction);
}

/**
 * 删除执行器
 * @param index 执行器索引
 */
function removeAction(index: number) {
  actions.value.splice(index, 1);
}

/**
 * 更新执行器类型
 * @param index 执行器索引
 * @param type 执行器类型
 */
function updateActionType(index: number, type: number) {
  actions.value[index]!.type = type.toString();
  onActionTypeChange(actions.value[index] as Action, type);
}

/**
 * 更新执行器
 * @param index 执行器索引
 * @param action 执行器对象
 */
function updateAction(index: number, action: Action) {
  actions.value[index] = action;
}

/**
 * 更新告警配置
 * @param index 执行器索引
 * @param alertConfigId 告警配置ID
 */
function updateActionAlertConfig(index: number, alertConfigId?: number) {
  actions.value[index]!.alertConfigId = alertConfigId;
  if (actions.value[index]) {
    actions.value[index].alertConfigId = alertConfigId;
  }
}

/**
 * 监听执行器类型变化
 * @param action 执行器对象
 * @param type 执行器类型
 */
function onActionTypeChange(action: Action, type: any) {
  // 清理不相关的配置，确保数据结构干净
  if (isDeviceAction(type)) {
    // 设备控制类型：清理告警配置，确保设备参数存在
    action.alertConfigId = undefined;
    if (!(action as any).params) {
      (action as any).params = '';
    }
    // 如果从其他类型切换到设备控制类型，清空identifier（让用户重新选择）
    if (action.identifier && type !== (action as any).type) {
      action.identifier = undefined;
    }
  } else if (isAlertAction(type)) {
    action.productId = undefined;
    action.deviceId = undefined;
    action.identifier = undefined; // 清理服务标识符
    action.params = undefined;
    action.alertConfigId = undefined;
  }
}
</script>

<template>
  <el-card class="action-card" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <IconifyIcon icon="ep:setting" class="header-icon" />
          <span class="header-title">执行器配置</span>
          <el-tag size="small" type="info">{{ actions.length }} 个执行器</el-tag>
        </div>
        <div class="header-right">
          <el-button type="primary" size="small" @click="addAction">
            <IconifyIcon icon="ep:plus" />
            添加执行器
          </el-button>
        </div>
      </div>
    </template>

    <div class="card-content">
      <!-- 空状态 -->
      <div v-if="actions.length === 0" class="empty-state">
        <el-empty description="暂无执行器配置">
          <el-button type="primary" @click="addAction">
            <IconifyIcon icon="ep:plus" />
            添加第一个执行器
          </el-button>
        </el-empty>
      </div>

      <!-- 执行器列表 -->
      <div v-else class="actions-list">
        <div
          v-for="(action, index) in actions"
          :key="`action-${index}`"
          class="action-item"
        >
          <!-- 执行器头部 -->
          <div class="action-header">
            <div class="action-header-left">
              <div class="action-number">
                <div class="action-number-badge">{{ index + 1 }}</div>
                <span>执行器 {{ index + 1 }}</span>
              </div>
              <el-tag :type="getActionTypeTag(action.type as any)" size="small">
                {{ getActionTypeLabel(action.type as any) }}
              </el-tag>
            </div>
            <div class="action-header-right">
              <el-button
                v-if="actions.length > 1"
                type="danger"
                size="small"
                text
                @click="removeAction(index)"
              >
                <IconifyIcon icon="lucide:trash-2" />
                删除
              </el-button>
            </div>
          </div>

          <!-- 执行器内容区域 -->
          <div class="action-content">
            <!-- 执行类型选择 -->
            <div class="action-field">
              <el-form-item label="执行类型" required>
                <el-select
                  :model-value="action.type"
                  @update:model-value="(value: number) => updateActionType(index, value)"
                  @change="(value) => onActionTypeChange(action, value)"
                  placeholder="请选择执行类型"
                  class="full-width"
                >
                  <el-option
                    v-for="option in getActionTypeOptions()"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </div>

            <!-- 设备控制配置 -->
            <DeviceControlConfig
              v-if="isDeviceAction(action.type as any)"
              :model-value="action"
              @update:model-value="(value) => updateAction(index, value)"
            />

            <!-- 告警配置 - 只有恢复告警时才显示 -->
            <AlertConfig
              v-if="
                action.type ===
                IotRuleSceneActionTypeEnum.ALERT_RECOVER.toString()
              "
              :model-value="action.alertConfigId"
              @update:model-value="
                (value) => updateActionAlertConfig(index, value)
              "
            />

            <!-- 触发告警提示 - 触发告警时显示 -->
            <div
              v-if="
                action.type ===
                IotRuleSceneActionTypeEnum.ALERT_TRIGGER.toString()
              "
              class="alert-trigger-hint"
            >
              <div class="hint-header">
                <IconifyIcon icon="ep:warning" class="hint-icon" />
                <span class="hint-title">触发告警</span>
                <el-tag size="small" type="warning">自动执行</el-tag>
              </div>
              <div class="hint-description">
                当触发条件满足时，系统将自动发送告警通知，可在菜单 [告警中心 -> 告警配置] 管理。
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加提示 -->
      <div v-if="actions.length > 0" class="add-more">
        <el-button type="primary" plain @click="addAction">
          <IconifyIcon icon="ep:plus" />
          继续添加执行器
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.action-card {
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
  padding: 0;
}

.empty-state {
  padding: 20px 0;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-item {
  border-radius: 8px;
  border: 2px solid #91caff;
  background-color: #ecf5ff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.action-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #91caff;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(135deg, #ecf5ff, #f0f9ff);
}

.action-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-number {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #1e40af;
}

.action-number-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background-color: #409eff;
  border-radius: 50%;
}

.action-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-field {
  width: 100%;
}

.full-width {
  width: 100%;
}

.alert-trigger-hint {
  padding: 16px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.hint-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.hint-icon {
  font-size: 16px;
  color: #e6a23c;
}

.hint-title {
  font-weight: 600;
  font-size: 14px;
  color: #409eff;
}

.hint-description {
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}

.add-more {
  padding: 16px 0;
  text-align: center;
}

/* 表单样式调整 */
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
