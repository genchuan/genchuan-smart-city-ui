<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';

import { ConsumableManagementApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/consumablemanagement';

/** 耗材库存与更换管理 表单 */
defineOptions({ name: 'ConsumableManagementForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  consumableId: undefined,
  consumableType: undefined,
  stockQuantity: undefined,
  warningThreshold: undefined,
  lastReplacementDate: undefined,
  nextReplacementDate: undefined,
  replacementQuantity: undefined,
  relatedEquipmentId: undefined,
});
const formRules = reactive({
  consumableId: [{ required: true, message: '耗材ID不能为空', trigger: 'blur' }],
  consumableType: [{ required: true, message: '耗材类型不能为空', trigger: 'blur' }],
  stockQuantity: [{ required: true, message: '库存余量不能为空', trigger: 'blur' }],
  warningThreshold: [{ required: true, message: '预警阈值不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增耗材库存与更换管理' : '编辑耗材库存与更换管理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await ConsumableManagementApi.getConsumableManagement(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value;
    if (formType.value === 'create') {
      await ConsumableManagementApi.createConsumableManagement(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await ConsumableManagementApi.updateConsumableManagement(
        data,
      );
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
    consumableId: undefined,
    consumableType: undefined,
    stockQuantity: undefined,
    warningThreshold: undefined,
    lastReplacementDate: undefined,
    nextReplacementDate: undefined,
    replacementQuantity: undefined,
    relatedEquipmentId: undefined,
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
      label-width="130px"
      v-loading="formLoading"
    >
      <ElFormItem label="耗材ID" prop="consumableId">
        <ElInput v-model="formData.consumableId" placeholder="请输入耗材ID" />
      </ElFormItem>
      <ElFormItem label="耗材类型" prop="consumableType">
        <ElInput v-model="formData.consumableType" placeholder="请输入耗材类型" />
      </ElFormItem>
      <ElFormItem label="库存余量" prop="stockQuantity">
        <ElInput v-model="formData.stockQuantity" placeholder="请输入库存余量" />
      </ElFormItem>
      <ElFormItem label="预警阈值" prop="warningThreshold">
        <ElInput v-model="formData.warningThreshold" placeholder="请输入预警阈值" />
      </ElFormItem>
      <ElFormItem label="上次更换日期" prop="lastReplacementDate">
        <ElDatePicker
          v-model="formData.lastReplacementDate"
          type="date"
          value-format="x"
          placeholder="选择上次更换日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="预计下次更换日期" prop="nextReplacementDate">
        <ElDatePicker
          v-model="formData.nextReplacementDate"
          type="date"
          value-format="x"
          placeholder="选择预计下次更换日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="更换数量" prop="replacementQuantity">
        <ElInput v-model="formData.replacementQuantity" placeholder="请输入更换数量" />
      </ElFormItem>
      <ElFormItem label="关联设备ID" prop="relatedEquipmentId">
        <ElInput v-model="formData.relatedEquipmentId" placeholder="请输入关联设备ID" />
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
