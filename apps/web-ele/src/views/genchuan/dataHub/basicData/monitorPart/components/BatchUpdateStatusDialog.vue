<script setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import {
  ElButton,
  ElMessage,
  ElRadio,
  ElRadioGroup,
  ElTag,
} from 'element-plus';

import { batchUpdateInstanceStatus } from '#/api/genchuan/dataHub/basicData/monitorPart';

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

const selectedIds = ref([]);
const targetStatus = ref('');
const confirmStep = ref(1); // 1: 选择状态, 2: 二次确认

// 状态选项 - 从字典动态获取
const statusOptions = computed(() => {
  return getDictOptions(DICT_TYPE.DATA_MANAGEPART_RUNSTATUS, 'string');
});

const open = (ids) => {
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
      // 调用批量更新接口
      // 将ID转换为数字类型
      const ids = selectedIds.value.map(Number);
      // 将状态值转换为数字类型
      const status = Number(targetStatus.value);

      await batchUpdateInstanceStatus(ids, status);

      ElMessage.success(`成功更新 ${selectedIds.value.length} 条记录的状态`);
      emit('success');
      modalApi.close();
    } catch {
      ElMessage.error('更新失败');
    }
  }
};

const handleBack = () => {
  confirmStep.value = 1;
};

const getStatusLabel = (value) => {
  const option = statusOptions.value.find((opt) => opt.value === value);
  return option?.label || value;
};

/** 获取状态颜色 - 将字典颜色映射到 Element Plus 支持的类型 */
const getStatusColor = (value) => {
  const dict = getDictObj(DICT_TYPE.DATA_MANAGEPART_RUNSTATUS, String(value));
  const colorType = dict?.colorType || 'primary';

  // 将后端的颜色类型映射到Element Plus支持的颜色类型
  const colorTypeMap = {
    danger: 'danger',
    error: 'danger',
    info: 'info',
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    blue: 'primary',
    green: 'success',
    orange: 'warning',
    cyan: 'info',
    purple: 'primary',
    pink: 'danger',
    red: 'danger',
    yellow: 'warning',
  };

  // 如果colorType在映射表中，使用映射后的值
  if (colorTypeMap[colorType]) {
    return colorTypeMap[colorType];
  }

  // 如果是不支持的颜色类型，默认使用primary
  return 'primary';
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
            状态更新为：<ElTag :type="getStatusColor(targetStatus)">
              {{ getStatusLabel(targetStatus) }}
            </ElTag>
          </div>
          <div class="confirm-warning">此操作不可撤销，请确认是否继续？</div>
        </div>
      </div>
    </div>

    <!-- 自定义底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <ElButton v-if="confirmStep === 2" @click="handleBack"> 返回 </ElButton>
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
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.info-text strong {
  font-size: 16px;
  color: var(--el-color-primary);
}

.status-select {
  margin-top: 16px;
}

.label {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.status-radio-group {
  display: flex;
  flex-flow: row wrap;
  gap: 16px;
}

.status-radio {
  margin-right: 0;
}

.confirm-content {
  padding: 20px 0;
  text-align: center;
}

.confirm-icon {
  margin-bottom: 16px;
  font-size: 48px;
  color: var(--el-color-warning);
}

.confirm-text {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.confirm-status {
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.confirm-warning {
  margin-top: 16px;
  font-size: 13px;
  color: var(--el-color-danger);
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
