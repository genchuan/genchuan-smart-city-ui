<script setup>
import { computed, reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';

import {
  batchAuditInspectReport,
  rejectInspectReport,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectReport';

const emit = defineEmits(['success']);

const visible = ref(false);
const formRef = ref(null);
const actionType = ref('batchAudit');
const rowData = ref({});
const reportIds = ref([]);
const submitting = ref(false);

const form = reactive({
  auditResult: '3',
  auditRemark: '',
});

const isRejectAction = computed(
  () => actionType.value === 'reject' || form.auditResult === '2',
);
const title = computed(() =>
  actionType.value === 'reject' ? '驳回巡检上报' : '批量审核巡检上报',
);
const tipText = computed(() => {
  if (actionType.value === 'batchAudit') {
    return `已选择 ${reportIds.value.length} 条待审核上报`;
  }
  return rowData.value?.id ? `上报ID：${rowData.value.id}` : '';
});
const rules = computed(() => ({
  auditResult: [
    {
      required: actionType.value === 'batchAudit',
      message: '请选择审核结果',
      trigger: 'change',
    },
  ],
  auditRemark: [
    {
      required: isRejectAction.value,
      message: '请输入驳回理由',
      trigger: 'blur',
    },
    {
      min: isRejectAction.value ? 10 : 0,
      message: '驳回理由不少于10个字',
      trigger: 'blur',
    },
  ],
}));

function resetForm() {
  form.auditResult = actionType.value === 'reject' ? '2' : '3';
  form.auditRemark = '';
  formRef.value?.resetFields?.();
}

function open(type, payload = {}) {
  actionType.value = type;
  rowData.value = payload.row || {};
  reportIds.value = payload.ids || (payload.row?.id ? [payload.row.id] : []);
  resetForm();
  visible.value = true;
}

async function submitAction() {
  try {
    await formRef.value?.validate();
  } catch {
    ElMessage.warning('请完善审核信息');
    return;
  }

  submitting.value = true;
  try {
    if (actionType.value === 'batchAudit') {
      await batchAuditInspectReport({
        ids: reportIds.value,
        auditResult: form.auditResult,
        auditRemark: form.auditRemark,
      });
      ElMessage.success('批量审核成功');
    }
    if (actionType.value === 'reject') {
      await rejectInspectReport({
        id: rowData.value.id,
        auditRemark: form.auditRemark,
      });
      ElMessage.success('巡检上报已驳回');
    }
    visible.value = false;
    emit('success');
  } catch (error) {
    console.error('巡检上报审核失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
}

defineExpose({
  open,
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="520px"
    :close-on-click-modal="false"
  >
    <div class="audit-tip">{{ tipText }}</div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item
        v-if="actionType === 'batchAudit'"
        label="审核结果"
        prop="auditResult"
      >
        <el-select v-model="form.auditResult" placeholder="请选择审核结果">
          <el-option label="待处置" value="2" />
          <el-option label="已完成" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="isRejectAction ? '驳回理由' : '审核意见'"
        prop="auditRemark"
      >
        <el-input
          v-model="form.auditRemark"
          maxlength="255"
          :placeholder="
            isRejectAction ? '请输入驳回理由，不少于10个字' : '请输入审核意见'
          "
          rows="4"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submitAction">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.audit-tip {
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

:deep(.el-select) {
  width: 100%;
}
</style>
