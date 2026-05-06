<script setup>
import { reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { processInspectReport } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectReport';

import { auditorOptions } from '../table/data';

const emit = defineEmits(['success']);

const formRef = ref(null);
const rowData = ref({});
const submitting = ref(false);

const form = reactive({
  processMode: '',
  processUserId: undefined,
  processResult: '',
});

const rules = {
  // processMode: [
  //   {
  //     required: true,
  //     message: '请输入处置方式',
  //     trigger: 'blur',
  //   },
  // ],
  processUserId: [
    {
      required: true,
      message: '请选择处置人',
      trigger: 'change',
    },
  ],
};

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  footer: false,
  modal: false,
  title: '执行巡检上报处置',
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    await submitProcess();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    rowData.value = drawerApi.getData() || {};
    resetForm();
  },
});

function resetForm() {
  form.processMode = '';
  form.processUserId = undefined;
  form.processResult = '';
  formRef.value?.resetFields?.();
}

async function submitProcess() {
  try {
    await formRef.value?.validate();
  } catch {
    ElMessage.warning('请完善处置信息');
    return;
  }

  submitting.value = true;
  try {
    await processInspectReport({
      id: rowData.value.id,
      // processMode: form.processMode,
      processUserId: form.processUserId,
      // processResult: form.processResult,
    });
    ElMessage.success('处置执行成功');
    emit('success');
    drawerApi.close();
  } catch (error) {
    console.error('巡检上报处置失败:', error);
    ElMessage.error('处置失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
}

function open(row) {
  drawerApi.setData(row || {}).open();
}

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <div class="process-tip">上报ID：{{ rowData.id || '-' }}</div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <!-- <el-form-item label="处置方式" prop="processMode">
        <el-input
          v-model="form.processMode"
          maxlength="100"
          placeholder="请输入处置方式"
          show-word-limit
        />
      </el-form-item> -->
      <el-form-item label="处置人" prop="processUserId">
        <el-select
          v-model="form.processUserId"
          clearable
          filterable
          placeholder="请选择处置人"
        >
          <el-option
            v-for="item in auditorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="处置结果">
        <el-input
          v-model="form.processResult"
          maxlength="255"
          placeholder="请输入处置结果"
          rows="4"
          show-word-limit
          type="textarea"
        />
      </el-form-item> -->
    </el-form>
    <div class="drawer-footer">
      <el-button @click="drawerApi.close()">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submitProcess">
        保存
      </el-button>
    </div>
  </Drawer>
</template>

<style scoped>
.process-tip {
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.drawer-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
}

:deep(.el-select) {
  width: 100%;
}
</style>
