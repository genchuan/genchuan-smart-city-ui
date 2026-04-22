<script setup>
import { computed, reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';

import {
  batchDispatchInspectTask,
  dispatchInspectTask,
  updateInspectTaskProgress,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTask';

import { userOptions } from '../table/data';

const emit = defineEmits(['success']);

const visible = ref(false);
const formRef = ref(null);
const actionType = ref('dispatch');
const rowData = ref({});
const taskIds = ref([]);
const submitting = ref(false);
const form = reactive({
  userId: undefined,
  progress: 0,
});

const actionConfig = {
  batchDispatch: {
    title: '批量派发巡检任务',
    confirmText: '确认派发',
  },
  dispatch: {
    title: '派发巡检任务',
    confirmText: '确认派发',
  },
  progress: {
    title: '更新任务进度',
    confirmText: '确认更新',
  },
};

const currentConfig = computed(() => actionConfig[actionType.value]);
const isDispatchAction = computed(() =>
  ['batchDispatch', 'dispatch'].includes(actionType.value),
);
const isProgressAction = computed(() => actionType.value === 'progress');
const taskCountText = computed(() => {
  if (actionType.value === 'batchDispatch') {
    return `已选择 ${taskIds.value.length} 条待派发任务`;
  }
  return rowData.value?.id ? `任务ID：${rowData.value.id}` : '';
});

const rules = computed(() => ({
  userId: [
    {
      required: isDispatchAction.value,
      message: '请选择巡检人员',
      trigger: 'change',
    },
  ],
  progress: [
    {
      required: isProgressAction.value,
      message: '请输入执行进度',
      trigger: 'blur',
    },
  ],
}));

function resetForm() {
  form.userId = undefined;
  form.progress = 0;
  formRef.value?.resetFields?.();
}

function open(type, payload = {}) {
  actionType.value = type;
  rowData.value = payload.row || {};
  taskIds.value = payload.ids || (payload.row?.id ? [payload.row.id] : []);
  resetForm();
  if (type === 'progress') {
    form.progress = Number(payload.row?.progress || 0);
  }
  visible.value = true;
}

async function submitAction() {
  try {
    await formRef.value?.validate();
  } catch {
    ElMessage.warning('请完善必填信息');
    return;
  }

  submitting.value = true;
  try {
    if (actionType.value === 'batchDispatch') {
      await batchDispatchInspectTask({
        ids: taskIds.value,
        userId: form.userId,
      });
      ElMessage.success('批量派发成功');
    }
    if (actionType.value === 'dispatch') {
      await dispatchInspectTask({ ids: [rowData.value.id], userId: form.userId });
      ElMessage.success('任务派发成功');
    }
    if (actionType.value === 'progress') {
      await updateInspectTaskProgress({
        id: rowData.value.id,
        progress: form.progress,
      });
      ElMessage.success('任务进度更新成功');
    }
    visible.value = false;
    emit('success');
  } catch (error) {
    console.error('巡检任务操作失败:', error);
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
    :title="currentConfig.title"
    width="520px"
    :close-on-click-modal="false"
  >
    <div class="task-tip">{{ taskCountText }}</div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item v-if="isDispatchAction" label="巡检人员" prop="userId">
        <el-select
          v-model="form.userId"
          clearable
          filterable
          placeholder="请选择巡检人员"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="isProgressAction" label="执行进度" prop="progress">
        <el-input-number
          v-model="form.progress"
          :max="100"
          :min="0"
          :step="5"
          controls-position="right"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submitAction">
        {{ currentConfig.confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.task-tip {
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

:deep(.el-select) {
  width: 100%;
}
</style>
