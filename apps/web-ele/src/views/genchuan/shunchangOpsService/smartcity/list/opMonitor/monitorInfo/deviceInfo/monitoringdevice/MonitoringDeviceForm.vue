<script setup lang="ts">
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';
import { reactive, ref } from 'vue';

import { MonitoringDeviceApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/opMonitor/monitorInfo/deviceInfo/monitoringdevice';

/** 监测设备 表单 */
defineOptions({ name: 'MonitoringDeviceForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceNumber: undefined,
  deviceName: undefined,
  deviceType: undefined,
  manufacturer: undefined,
  maintenanceRecord: undefined,
  createTime: undefined,
});
const formRules = reactive({
  deviceNumber: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
  deviceName: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增监测设备' : '编辑监测设备';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await MonitoringDeviceApi.getMonitoringDevice(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value;
    if (formType.value === 'create') {
      await MonitoringDeviceApi.createMonitoringDevice(data);
      ElMessage.success('新增成功');
    } else {
      await MonitoringDeviceApi.updateMonitoringDevice(data);
      ElMessage.success('修改成功');
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    deviceNumber: undefined,
    deviceName: undefined,
    deviceType: undefined,
    manufacturer: undefined,
    maintenanceRecord: undefined,
    createTime: undefined,
  };
  formRef.value?.resetFields();
};
</script>

<template>
  <ElDialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="设备编号" prop="deviceNumber">
        <ElInput v-model="formData.deviceNumber" placeholder="请输入设备编号" />
      </ElFormItem>
      <ElFormItem label="设备名称" prop="deviceName">
        <ElInput v-model="formData.deviceName" placeholder="请输入设备名称" />
      </ElFormItem>
      <ElFormItem label="设备类型" prop="deviceType">
        <ElInput v-model="formData.deviceType" placeholder="请输入设备类型" />
      </ElFormItem>
      <ElFormItem label="生产厂家" prop="manufacturer">
        <ElInput v-model="formData.manufacturer" placeholder="请输入生产厂家" />
      </ElFormItem>
      <ElFormItem label="维护记录" prop="maintenanceRecord">
        <ElInput v-model="formData.maintenanceRecord" placeholder="请输入维护记录" />
      </ElFormItem>
      <ElFormItem label="安装时间" prop="createTime">
        <ElDatePicker
          v-model="formData.createTime"
          type="date"
          value-format="x"
          placeholder="选择安装时间"
          style="width: 100%"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>
