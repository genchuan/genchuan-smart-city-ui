<script setup lang="ts">
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { getDictOptions } from '@vben/hooks';
import { DICT_TYPE } from '@vben/constants';

import { ElButton, ElMessage, ElRadio, ElRadioGroup } from 'element-plus';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  title: '批量更新状态',
  width: 500,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

const selectedIds = ref<string[]>([]);
const targetStatus = ref<string>('');
const confirmStep = ref<number>(1); // 1: 选择状态, 2: 二次确认

// 获取运行状态字典选项
const statusOptions = getDictOptions(DICT_TYPE.DATA_MANAGEPART_RUNSTATUS, 'string');

const open = (ids: string[]) => {
  selectedIds.value = ids;
  targetStatus.value = '';
  confirmStep.value = 1;
  modalApi.open();
};

const handleConfirm = async () => {
  if (confirmStep.value === 1) {
    // 第一步：验证是否选择了状态
    if (!targetStatus.value) {
      ElMessage.warning('请选择目标状态');
      return;
    }
    // 进入二次确认步骤
    confirmStep.value = 2;
  } else {
    // 第二步：执行批量更新
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      ElMessage.success(`成功更新 ${selectedIds.value.length} 条记录的状态`);
      emit('success');
      modalApi.close();
    } catch (error) {
      ElMessage.error('更新失败');
    }
  }
};

const handleBack = () => {
  confirmStep.value = 1;
};

const getStatusLabel = (value: string) => {
  const option = statusOptions.find(opt => opt.value === value);
  return option?.label || value;
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="batch-update-container">
      <!-- 第一步：选择目标状态 -->
      <div v-if="confirmStep === 1" class="step-content">
        <div class="info-text">
          已选择 <strong>{{ selectedIds.length }}</strong> 条记录
        </div>
        <div class="status-select">
          <div class="label">请选择目标状态：</div>
          <ElRadioGroup v-model="targetStatus" class="status-radio-group">
            <ElRadio 
              v-for="option in statusOptions" 
              :key="option.value" 
              :label="option.value"
              class="status-radio"
            >
              {{ option.label }}
            </ElRadio>
          </ElRadioGroup>
        </div>
      </div>

      <!-- 第二步：二次确认 -->
      <div v-else class="step-content">
        <div class="confirm-content">
          <div class="confirm-icon">
            <i class="el-icon-warning-outline"></i>
          </div>
          <div class="confirm-text">
            确认将选中的 <strong>{{ selectedIds.length }}</strong> 条记录
          </div>
          <div class="confirm-status">
            状态更新为：<el-tag :type="targetStatus === '2' ? 'success' : targetStatus === '1' ? 'danger' : targetStatus === '3' ? 'info' : 'warning'">{{ getStatusLabel(targetStatus) }}</el-tag>
          </div>
          <div class="confirm-warning">
            此操作不可撤销，请确认是否继续？
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <ElButton v-if="confirmStep === 2" @click="handleBack">
          返回
        </ElButton>
        <ElButton @click="modalApi.close()">
          {{ confirmStep === 1 ? '取消' : '取消' }}
        </ElButton>
        <ElButton type="primary" @click="handleConfirm">
          {{ confirmStep === 1 ? '下一步' : '确认更新' }}
        </ElButton>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.batch-update-container {
  padding: 20px;
}

.step-content {
  min-height: 150px;
}

.info-text {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 20px;
}

.info-text strong {
  color: var(--el-color-primary);
  font-size: 16px;
}

.status-select {
  margin-top: 16px;
}

.label {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  font-weight: 500;
}

.status-radio-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
}

.status-radio {
  margin-right: 0;
}

.confirm-content {
  text-align: center;
  padding: 20px 0;
}

.confirm-icon {
  font-size: 48px;
  color: var(--el-color-warning);
  margin-bottom: 16px;
}

.confirm-text {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 12px;
}

.confirm-status {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.confirm-warning {
  font-size: 13px;
  color: var(--el-color-danger);
  margin-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
