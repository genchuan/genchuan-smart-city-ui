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

import { EquipmentAssetApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/equipmentasset';

/** 设备资产台账管理 表单 */
defineOptions({ name: 'EquipmentAssetForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  equipmentCode: undefined,
  equipmentName: undefined,
  model: undefined,
  specification: undefined,
  installLocation: undefined,
  installDate: undefined,
  manufacturer: undefined,
  maintenanceRecord: undefined,
});
const formRules = reactive({
  equipmentCode: [
    { required: true, message: '设备编号不能为空', trigger: 'blur' },
  ],
  equipmentName: [
    { required: true, message: '设备名称不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增设备资产台账' : '编辑设备资产台账';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await EquipmentAssetApi.getEquipmentAsset(id);
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
      await EquipmentAssetApi.createEquipmentAsset(data);
      ElMessage.success('新增成功');
    } else {
      await EquipmentAssetApi.updateEquipmentAsset(data);
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
    equipmentCode: undefined,
    equipmentName: undefined,
    model: undefined,
    specification: undefined,
    installLocation: undefined,
    installDate: undefined,
    manufacturer: undefined,
    maintenanceRecord: undefined,
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
      <ElFormItem label="设备编号" prop="equipmentCode">
        <ElInput
          v-model="formData.equipmentCode"
          placeholder="请输入设备编号"
        />
      </ElFormItem>
      <ElFormItem label="设备名称" prop="equipmentName">
        <ElInput
          v-model="formData.equipmentName"
          placeholder="请输入设备名称"
        />
      </ElFormItem>
      <ElFormItem label="型号" prop="model">
        <ElInput v-model="formData.model" placeholder="请输入型号" />
      </ElFormItem>
      <ElFormItem label="规格" prop="specification">
        <ElInput v-model="formData.specification" placeholder="请输入规格" />
      </ElFormItem>
      <ElFormItem label="安装位置" prop="installLocation">
        <ElInput
          v-model="formData.installLocation"
          placeholder="请输入安装位置"
        />
      </ElFormItem>
      <ElFormItem label="安装日期" prop="installDate">
        <ElDatePicker
          v-model="formData.installDate"
          type="date"
          value-format="x"
          placeholder="选择安装日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="生产厂家" prop="manufacturer">
        <ElInput v-model="formData.manufacturer" placeholder="请输入生产厂家" />
      </ElFormItem>
      <ElFormItem label="维护记录" prop="maintenanceRecord">
        <ElInput
          v-model="formData.maintenanceRecord"
          placeholder="请输入维护记录"
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
