<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus';

import { updateInstance } from '#/api/genchuan/dataHub/basicData/monitorEvent';

const emit = defineEmits(['success']);

const [Drawer, drawerApi] = useVbenDrawer({
  title: '事件处置',
  width: 500,
  modal: false,
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

const record = ref({});
const formData = ref({
  handleContent: '',
  handleResult: '',
});
const loading = ref(false);

const open = (row) => {
  record.value = row;
  formData.value = {
    handleContent: '',
    handleResult: '',
  };
  drawerApi.open();
};

const handleConfirm = async () => {
  if (!formData.value.handleContent.trim()) {
    ElMessage.warning('请输入处置内容');
    return;
  }
  if (!formData.value.handleResult.trim()) {
    ElMessage.warning('请输入处置结果');
    return;
  }

  try {
    loading.value = true;
    await updateInstance({
      ...record.value,
      status: '2', // 已办结
      handleContent: formData.value.handleContent,
      handleResult: formData.value.handleResult,
      dealTime: Date.now().toString(),
    });
    ElMessage.success('处置成功');
    drawerApi.close();
    emit('success');
  } catch (error) {
    console.error('处置失败:', error);
    ElMessage.error('处置失败');
  } finally {
    loading.value = false;
  }
};

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <div class="handle-drawer-content">
      <ElForm label-width="100px">
        <ElFormItem label="事件名称">
          <span>{{ record.name }}</span>
        </ElFormItem>
        <ElFormItem label="18位标识码">
          <span>{{ record.uniqueCode }}</span>
        </ElFormItem>
        <ElFormItem label="处置内容" required>
          <ElInput
            v-model="formData.handleContent"
            type="textarea"
            :rows="4"
            placeholder="请输入处置内容"
          />
        </ElFormItem>
        <ElFormItem label="处置结果" required>
          <ElInput
            v-model="formData.handleResult"
            type="textarea"
            :rows="4"
            placeholder="请输入处置结果"
          />
        </ElFormItem>
      </ElForm>
    </div>
    <template #footer>
      <ElButton @click="drawerApi.close()">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm">
        确认
      </ElButton>
    </template>
  </Drawer>
</template>

<style scoped>
.handle-drawer-content {
  padding: 20px;
}
</style>
