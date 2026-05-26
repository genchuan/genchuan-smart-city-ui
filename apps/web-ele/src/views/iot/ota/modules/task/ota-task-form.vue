<template>
  <Modal title="新增升级任务" class="w-3/5">
    <div v-loading="formLoading" class="form-spin">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        class="task-form"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
          />
        </el-form-item>
        <el-form-item label="升级范围" prop="deviceScope">
          <el-select v-model="formData.deviceScope" placeholder="请选择升级范围" class="full-width">
            <el-option
              v-for="option in deviceScopeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.deviceScope === IoTOtaTaskDeviceScopeEnum.SELECT.value"
          label="选择设备"
          prop="deviceIds"
        >
          <el-select
            v-model="formData.deviceIds"
            multiple
            filterable
            placeholder="请选择设备"
            class="full-width"
          >
            <el-option
              v-for="option in deviceOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import type { IotDeviceApi } from '#/api/iot/device/device';
import type { OtaTask } from '#/api/iot/ota/task';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElForm, ElFormItem, ElInput, ElMessage, ElSelect, ElOption } from 'element-plus';

import { getDeviceListByProductId } from '#/api/iot/device/device';
import { createOtaTask } from '#/api/iot/ota/task';
import { IoTOtaTaskDeviceScopeEnum } from '#/views/iot/utils/constants';

/** IoT OTA 升级任务表单 */
defineOptions({ name: 'OtaTaskForm' });

const props = defineProps<{
  firmwareId: number;
  productId: number;
}>();

const emit = defineEmits(['success']);

const formLoading = ref(false);
const formData = ref<OtaTask>({
  name: '',
  deviceScope: IoTOtaTaskDeviceScopeEnum.ALL.value,
  firmwareId: props.firmwareId,
  description: '',
  deviceIds: [],
});
const formRef = ref();
const formRules = {
  name: [
    {
      required: true,
      message: '请输入任务名称',
      trigger: 'blur',
    },
  ],
  deviceScope: [
    {
      required: true,
      message: '请选择升级范围',
      trigger: 'change',
    },
  ],
  deviceIds: [
    {
      required: true,
      message: '请至少选择一个设备',
      trigger: 'change',
    },
  ],
};
const devices = ref<IotDeviceApi.Device[]>([]);

/** 设备选项 */
const deviceOptions = computed(() => {
  return devices.value.map((device) => ({
    label: device.nickname
      ? `${device.deviceName} (${device.nickname})`
      : device.deviceName,
    value: device.id,
  }));
});

/** 升级范围选项 */
const deviceScopeOptions = computed(() => {
  return Object.values(IoTOtaTaskDeviceScopeEnum).map((item) => ({
    label: item.label,
    value: item.value,
  }));
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    try {
      // 验证表单
      if (!formRef.value) return;
      await formRef.value.validate();

      modalApi.lock();
      await createOtaTask(formData.value);
      ElMessage.success('创建成功');
      await modalApi.close();
      emit('success');
    } catch (error) {
      console.error('创建失败:', error);
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      resetForm();
      return;
    }
    // 加载设备列表
    formLoading.value = true;
    try {
      devices.value = (await getDeviceListByProductId(props.productId)) || [];
    } finally {
      formLoading.value = false;
    }
  },
});

/** 重置表单 */
function resetForm() {
  formData.value = {
    name: '',
    deviceScope: IoTOtaTaskDeviceScopeEnum.ALL.value,
    firmwareId: props.firmwareId,
    description: '',
    deviceIds: [],
  };
  formRef.value?.resetFields();
}

/** 打开弹窗 */
async function open() {
  await modalApi.open();
}

defineExpose({ open });
</script>

<style scoped>
.w-3\/5 {
  width: 60%;
}

.mx-4 {
  margin-left: 16px;
  margin-right: 16px;
}

.form-spin {
  display: block;
  width: 100%;
}

.task-form {
  margin: 0 16px;
}

.full-width {
  width: 100%;
}

/* 表单项样式调整 */
:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

/* 多选下拉框样式 */
:deep(.el-select__tags) {
  max-width: calc(100% - 40px);
}
</style>
