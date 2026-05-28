<!-- 设备触发配置组件 -->
<script setup lang="ts">
import type { RuleSceneApi } from '#/api/iot/rule/scene';

import { nextTick } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import { ElButton, ElTag } from 'element-plus';

import MainConditionInnerConfig from './main-condition-inner-config.vue';
import SubConditionGroupConfig from './sub-condition-group-config.vue';

/** 设备触发配置组件 */
defineOptions({ name: 'DeviceTriggerConfig' });

const props = defineProps<{
  index: number;
  modelValue: RuleSceneApi.Trigger;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: RuleSceneApi.Trigger): void;
  (e: 'triggerTypeChange', type: number): void;
}>();

const trigger = useVModel(props, 'modelValue', emit);

const maxSubGroups = 3; // 最多 3 个子条件组
const maxConditionsPerGroup = 3; // 每组最多 3 个条件

/**
 * 更新条件
 * @param condition 条件对象
 */
function updateCondition(condition: RuleSceneApi.Trigger) {
  trigger.value = condition;
}

/**
 * 处理触发器类型变化事件
 * @param type 触发器类型
 */
function handleTriggerTypeChange(type: number) {
  trigger.value.type = type.toString();
  emit('triggerTypeChange', type);
}

/** 添加子条件组 */
async function addSubGroup() {
  if (!trigger.value.conditionGroups) {
    trigger.value.conditionGroups = [];
  }

  // 检查是否达到最大子组数量限制
  if (trigger.value.conditionGroups?.length >= maxSubGroups) {
    return;
  }

  // 使用 nextTick 确保响应式更新完成后再添加新的子组
  await nextTick();
  if (trigger.value.conditionGroups) {
    trigger.value.conditionGroups.push([] as any);
  }
}

/**
 * 移除子条件组
 * @param index 子条件组索引
 */
function removeSubGroup(index: number) {
  if (trigger.value.conditionGroups) {
    trigger.value.conditionGroups.splice(index, 1);
  }
}

/**
 * 更新子条件组
 * @param index 子条件组索引
 * @param subGroup 子条件组数据
 */
function updateSubGroup(index: number, subGroup: any) {
  if (trigger.value.conditionGroups) {
    trigger.value.conditionGroups[index] = subGroup;
  }
}

/** 移除整个条件组 */
function removeConditionGroup() {
  trigger.value.conditionGroups = undefined;
}
</script>

<template>
  <div class="device-trigger-config">
    <!-- 主条件配置 - 默认直接展示 -->
    <div class="main-condition-section">
      <!-- 主条件配置 -->
      <div class="main-condition-content">
        <!-- 主条件头部 - 与附加条件组保持一致的绿色风格 -->
        <div class="main-condition-header">
          <div class="header-left">
            <div class="header-badge-group">
              <div class="badge-main">主</div>
              <span>主条件</span>
            </div>
            <el-tag size="small" type="success">必须满足</el-tag>
          </div>
        </div>

        <!-- 主条件内容配置 -->
        <MainConditionInnerConfig
          :model-value="trigger"
          @update:model-value="updateCondition"
          :trigger-type="trigger.type as any"
          @trigger-type-change="handleTriggerTypeChange"
        />
      </div>
    </div>

    <!-- 条件组配置 -->
    <div class="condition-group-section">
      <!-- 条件组配置 -->
      <div class="condition-group-content">
        <!-- 条件组容器头部 -->
        <div class="condition-group-header">
          <div class="header-left">
            <div class="header-badge-group">
              <div class="badge-group">组</div>
              <span>附加条件组</span>
            </div>
            <el-tag size="small" type="success">与"主条件"为且关系</el-tag>
            <el-tag size="small" type="info">
              {{ trigger.conditionGroups?.length || 0 }} 个子条件组
            </el-tag>
          </div>
          <div class="header-right">
            <el-button
              type="primary"
              size="small"
              @click="addSubGroup"
              :disabled="(trigger.conditionGroups?.length || 0) >= maxSubGroups"
            >
              <IconifyIcon icon="lucide:plus" />
              添加子条件组
            </el-button>
            <el-button type="danger" size="small" text @click="removeConditionGroup">
              <IconifyIcon icon="lucide:trash-2" />
              删除条件组
            </el-button>
          </div>
        </div>

        <!-- 子条件组列表 -->
        <div
          v-if="trigger.conditionGroups && trigger.conditionGroups.length > 0"
          class="sub-groups-list"
        >
          <!-- 逻辑关系说明 -->
          <div class="sub-groups-container">
            <div
              v-for="(subGroup, subGroupIndex) in trigger.conditionGroups"
              :key="`sub-group-${subGroupIndex}`"
              class="sub-group-wrapper"
            >
              <!-- 子条件组容器 -->
              <div class="sub-group-card">
                <div class="sub-group-header">
                  <div class="header-left">
                    <div class="header-badge-group">
                      <div class="badge-sub">{{ subGroupIndex + 1 }}</div>
                      <span>子条件组 {{ subGroupIndex + 1 }}</span>
                    </div>
                    <el-tag size="small" type="warning">组内条件为"且"关系</el-tag>
                    <el-tag size="small" type="info">
                      {{ (subGroup as any)?.length || 0 }}个条件
                    </el-tag>
                  </div>
                  <el-button
                    type="danger"
                    size="small"
                    text
                    @click="removeSubGroup(subGroupIndex)"
                  >
                    <IconifyIcon icon="lucide:trash-2" />
                    删除组
                  </el-button>
                </div>

                <SubConditionGroupConfig
                  :model-value="subGroup as any"
                  @update:model-value="
                    (value) => updateSubGroup(subGroupIndex, value)
                  "
                  :trigger-type="trigger.type as any"
                  :max-conditions="maxConditionsPerGroup"
                />
              </div>

              <!-- 子条件组间的'或'连接符 -->
              <div
                v-if="subGroupIndex < trigger.conditionGroups!.length - 1"
                class="or-connector"
              >
                <div class="or-line"></div>
                <div class="or-badge">或</div>
                <div class="or-line"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-content">
            <IconifyIcon icon="lucide:plus" class="empty-icon" />
            <div class="empty-text">
              <p class="empty-title">暂无子条件组</p>
              <p class="empty-hint">点击上方"添加子条件组"按钮开始配置</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-trigger-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-condition-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-condition-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-condition-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #95d475;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0f9eb, #e8f5e9);
}

.condition-group-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.condition-group-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.condition-group-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #95d475;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0f9eb, #e8f5e9);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-badge-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #2e7d32;
}

.badge-main,
.badge-group,
.badge-sub {
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

.badge-sub {
  background-color: #e6a23c;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sub-groups-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sub-groups-container {
  position: relative;
}

.sub-group-wrapper {
  position: relative;
}

.sub-group-card {
  border-radius: 8px;
  border: 2px solid #e6a23c;
  background-color: #fdf6ec;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.sub-group-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sub-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e6a23c;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(135deg, #fdf6ec, #fef7e8);
}

.or-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
}

.or-line {
  width: 32px;
  height: 1px;
  background-color: #e6a23c;
}

.or-badge {
  padding: 6px 16px;
  font-weight: 600;
  font-size: 14px;
  color: #e6a23c;
  background-color: #fdf6ec;
  border: 2px solid #e6a23c;
  border-radius: 9999px;
}

.empty-state {
  padding: 24px;
  text-align: center;
  border: 2px dashed #e6a23c;
  border-radius: 8px;
  background-color: #fdf6ec;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 32px;
  color: #e6a23c;
}

.empty-text {
  color: #e6a23c;
}

.empty-title {
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
}

.empty-hint {
  font-size: 12px;
}

/* 按钮文本样式 */
:deep(.el-button.is-text) {
  color: #f56c6c;
}

:deep(.el-button.is-text:hover) {
  background-color: rgba(245, 108, 108, 0.1);
}
</style>
