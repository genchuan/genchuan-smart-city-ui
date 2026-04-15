<script setup>
import { reactive, ref, shallowRef } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
} from 'element-plus';

import { checkInspectTrack } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTrack';

const emit = defineEmits(['success']);

const formRef = ref(null);
const rowData = shallowRef({});
const submitting = shallowRef(false);

const form = reactive({
  checkRemark: '',
});

const rules = {
  checkRemark: [
    {
      required: true,
      message: '请输入核查意见',
      trigger: 'blur',
    },
  ],
};

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  footer: false,
  modal: false,
  title: '异常轨迹核查',
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    rowData.value = drawerApi.getData() || {};
    resetForm();
  },
});

function resetForm() {
  form.checkRemark = '';
  formRef.value?.resetFields?.();
}

async function submitCheck() {
  try {
    await formRef.value?.validate();
  } catch {
    ElMessage.warning('请填写核查意见');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确认提交轨迹 ${rowData.value.id || '-'} 的核查结果吗？`,
      '确认核查',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );
  } catch {
    return;
  }

  submitting.value = true;
  try {
    await checkInspectTrack({
      id: rowData.value.id,
      checkRemark: form.checkRemark,
    });
    ElMessage.success('异常轨迹核查成功');
    emit('success');
    drawerApi.close();
  } catch (error) {
    console.error('异常轨迹核查失败:', error);
    ElMessage.error('核查失败，请稍后重试');
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
    <div class="check-summary">
      <div>轨迹ID：{{ rowData.id || '-' }}</div>
      <div>巡检人员：{{ rowData.userName || '-' }}</div>
      <div>异常说明：{{ rowData.exceptionSummary || '轨迹存在异常点' }}</div>
    </div>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="96px">
      <ElFormItem label="核查意见" prop="checkRemark">
        <ElInput
          v-model="form.checkRemark"
          maxlength="255"
          placeholder="请输入异常轨迹核查意见"
          rows="5"
          show-word-limit
          type="textarea"
        />
      </ElFormItem>
    </ElForm>
    <div class="drawer-footer">
      <ElButton @click="drawerApi.close()">取消</ElButton>
      <ElButton type="primary" :loading="submitting" @click="submitCheck">
        保存
      </ElButton>
    </div>
  </Drawer>
</template>

<style scoped>
.check-summary {
  display: grid;
  gap: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border-radius: 6px;
}

.drawer-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
}
</style>
