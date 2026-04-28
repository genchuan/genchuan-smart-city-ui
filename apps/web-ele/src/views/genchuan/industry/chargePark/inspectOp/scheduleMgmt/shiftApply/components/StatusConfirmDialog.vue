<script setup>
import { computed, reactive, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { WarningFilled } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';

import {
  approveShiftApply,
  confirmShiftApply,
  rejectShiftApply,
} from '#/api/genchuan/industry/chargePark/inspectOp/scheduleMgmt/shiftApply';

const emit = defineEmits(['success']);
const actionType = shallowRef('approve');
const rowData = shallowRef({});
const rejectFormRef = shallowRef(null);
const rejectForm = reactive({ auditRemark: '' });
const rejectRules = {
  auditRemark: [
    { required: true, message: '请输入驳回理由', trigger: 'blur' },
    { min: 10, message: '驳回理由不能少于10个字', trigger: 'blur' },
  ],
};
const actionConfig = {
  approve: {
    title: '通过换班申请',
    message: (row) =>
      `确定通过“${row.applyUserName || row.id || ''}”的换班申请吗？`,
    successMessage: '换班申请审核通过成功',
    loadingMessage: '正在通过换班申请...',
  },
  reject: {
    title: '驳回换班申请',
    message: (row) =>
      `确定驳回“${row.applyUserName || row.id || ''}”的换班申请吗？`,
    successMessage: '换班申请驳回成功',
    loadingMessage: '正在驳回换班申请...',
  },
  confirm: {
    title: '确认换班生效',
    message: (row) =>
      `确定确认申请“${row.id || ''}”生效吗？确认后将更新排班信息。`,
    successMessage: '换班申请确认成功',
    loadingMessage: '正在确认换班生效...',
  },
};
const currentAction = computed(() => actionConfig[actionType.value] || {});
const [Modal, modalApi] = useVbenModal({
  title: computed(() => currentAction.value.title || '确认操作'),
  width: 460,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await handleConfirm();
  },
});
async function validateRejectForm() {
  if (actionType.value !== 'reject') return true;
  try {
    await rejectFormRef.value?.validate?.();
    return true;
  } catch {
    return false;
  }
}
async function handleConfirm() {
  if (!actionType.value || !rowData.value?.id) {
    ElMessage.warning('操作参数错误');
    return;
  }
  const valid = await validateRejectForm();
  if (!valid) return;
  const loadingInstance = ElLoading.service({
    text: currentAction.value.loadingMessage,
  });
  try {
    if (actionType.value === 'approve')
      await approveShiftApply({ id: rowData.value.id, auditRemark: '' });
    if (actionType.value === 'reject')
      await rejectShiftApply({
        id: rowData.value.id,
        auditRemark: rejectForm.auditRemark,
      });
    if (actionType.value === 'confirm')
      await confirmShiftApply({ id: rowData.value.id });
    ElMessage.success(currentAction.value.successMessage);
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('换班申请状态操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
}
function open(type, row) {
  actionType.value = type;
  rowData.value = row || {};
  rejectForm.auditRemark = '';
  rejectFormRef.value?.clearValidate?.();
  modalApi.open();
}
defineExpose({ open });
</script>

<template>
  <Modal>
    <div class="confirm-container">
      <div class="confirm-icon">
        <el-icon><WarningFilled /></el-icon>
      </div>
      <div class="confirm-message">
        {{ currentAction.message ? currentAction.message(rowData) : '' }}
      </div>
      <el-form
        v-if="actionType === 'reject'"
        ref="rejectFormRef"
        class="reject-form"
        label-position="top"
        :model="rejectForm"
        :rules="rejectRules"
      >
        <el-form-item label="驳回理由" prop="auditRemark">
          <el-input
            v-model="rejectForm.auditRemark"
            maxlength="255"
            placeholder="请输入驳回理由，至少10个字"
            :rows="4"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div class="confirm-tip">确认后将刷新换班申请列表。</div>
    </div>
  </Modal>
</template>

<style scoped>
.confirm-container {
  padding: 20px;
  text-align: center;
}
.confirm-icon {
  margin-bottom: 16px;
  font-size: 44px;
  color: var(--el-color-warning);
}
.confirm-message {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
}
.reject-form {
  margin: 12px 0;
  text-align: left;
}
.confirm-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
