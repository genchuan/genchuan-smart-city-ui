<!-- 基础信息配置组件 -->
<script setup lang="ts">
import type { IotSceneRule } from '#/api/iot/rule/scene';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import { ElCard, ElCol, ElForm, ElFormItem, ElInput, ElRadio, ElRadioGroup, ElRow } from 'element-plus';

import { DictTag } from '#/components/dict-tag';

/** 基础信息配置组件 */
defineOptions({ name: 'BasicInfoSection' });

const props = defineProps<{
  modelValue: IotSceneRule;
  rules?: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: IotSceneRule): void;
}>();

const formData = useVModel(props, 'modelValue', emit); // 表单数据
</script>

<template>
  <el-card class="basic-info-card" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <IconifyIcon icon="ep:info-filled" class="header-icon" />
          <span class="header-title">基础信息</span>
        </div>
        <div class="header-right">
          <DictTag :type="DICT_TYPE.COMMON_STATUS" :value="formData.status" />
        </div>
      </div>
    </template>

    <div class="card-content">
      <el-row :gutter="24" class="info-row">
        <el-col :span="12">
          <el-form-item label="场景名称" prop="name" required>
            <el-input
              v-model="formData.name"
              placeholder="请输入场景名称"
              :maxlength="50"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="场景状态" prop="status" required>
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="(dict, index) in getDictOptions(
                  DICT_TYPE.COMMON_STATUS,
                  'number',
                )"
                :key="index"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="场景描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入场景描述（可选）"
          :rows="3"
          :maxlength="200"
          show-word-limit
          resize="none"
        />
      </el-form-item>
    </div>
  </el-card>
</template>

<style scoped>
.basic-info-card {
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
  padding: 0;
}

.info-row {
  margin-bottom: 20px;
}

/* 表单项样式调整 */
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

/* 文本域样式 */
:deep(.el-textarea__inner) {
  resize: none;
}
</style>
