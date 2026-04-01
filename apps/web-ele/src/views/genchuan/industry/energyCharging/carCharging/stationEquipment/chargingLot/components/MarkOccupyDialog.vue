<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElForm, ElFormItem, ElInputNumber, ElMessage } from 'element-plus';

import { updateChargingLotStatus } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingLot';

const [Modal, modalApi] = useVbenModal({
  title: '占用标记',
  width: 400,
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await handleSubmit();
  },
});

const formRef = ref(null);
const formData = ref({
  occupyTime: 0,
});

const record = ref({});

const formRules = {
  occupyTime: [
    { required: true, message: '请输入占用时长', trigger: 'blur' },
    { type: 'number', min: 0, message: '占用时长不能小于0', trigger: 'blur' },
  ],
};

const open = (row) => {
  record.value = row;
  formData.value.occupyTime = 0;
  modalApi.open();
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    const params = {
      id: Number(record.value.id),
      lotStatus: '1', // 1-占用
      occupyTime: formData.value.occupyTime,
    };

    await updateChargingLotStatus(params);
    ElMessage.success('占用标记成功');
    modalApi.close();
    // 通知父组件刷新
    emit('success');
  } catch (error) {
    if (error !== 'validation') {
      ElMessage.error('占用标记失败');
      console.error(error);
    }
  }
};

const emit = defineEmits(['success']);

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      class="occupy-form"
    >
      <ElFormItem label="车位编号">
        <span>{{ record.lotCode }}</span>
      </ElFormItem>
      <ElFormItem label="所属场站">
        <span>{{ record.stationName }}</span>
      </ElFormItem>
      <ElFormItem label="占用时长" prop="occupyTime">
        <ElInputNumber
          v-model="formData.occupyTime"
          :min="0"
          :precision="0"
          placeholder="请输入占用时长"
          style="width: 200px"
        />
        <span class="unit">分钟</span>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="modalApi.close()">取消</ElButton>
      <ElButton type="primary" @click="handleSubmit">确认</ElButton>
    </template>
  </Modal>
</template>

<style scoped>
.occupy-form {
  padding: 20px;
}

.unit {
  margin-left: 8px;
  color: #606266;
}
</style>
