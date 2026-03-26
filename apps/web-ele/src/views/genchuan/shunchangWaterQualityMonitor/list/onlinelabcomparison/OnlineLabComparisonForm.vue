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

import { OnlineLabComparisonApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/onlinelabcomparison';

/** 在线数据与实验室比对 表单 */
defineOptions({ name: 'OnlineLabComparisonForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  comparisonDate: undefined,
  monitorPointId: undefined,
  instrumentType: undefined,
  onlineValue: undefined,
  labValue: undefined,
  deviationValue: undefined,
  isExceeded: undefined,
  warningStatus: undefined,
});
const formRules = reactive({
  comparisonDate: [{ required: true, message: '比对日期不能为空', trigger: 'blur' }],
  monitorPointId: [{ required: true, message: '监测点ID不能为空', trigger: 'blur' }],
  instrumentType: [{ required: true, message: '仪器类型不能为空', trigger: 'blur' }],
  onlineValue: [{ required: true, message: '在线监测值不能为空', trigger: 'blur' }],
  labValue: [{ required: true, message: '实验室检测值不能为空', trigger: 'blur' }],
  deviationValue: [{ required: true, message: '偏差值不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增在线数据与实验室比对' : '编辑在线数据与实验室比对';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await OnlineLabComparisonApi.getOnlineLabComparison(id);
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
      await OnlineLabComparisonApi.createOnlineLabComparison(data);
      ElMessage.success('新增成功');
    } else {
      await OnlineLabComparisonApi.updateOnlineLabComparison(data);
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
    comparisonDate: undefined,
    monitorPointId: undefined,
    instrumentType: undefined,
    onlineValue: undefined,
    labValue: undefined,
    deviationValue: undefined,
    isExceeded: undefined,
    warningStatus: undefined,
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
      label-width="120px"
      v-loading="formLoading"
    >
      <ElFormItem label="比对日期" prop="comparisonDate">
        <ElDatePicker
          v-model="formData.comparisonDate"
          type="date"
          value-format="x"
          placeholder="选择比对日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="监测点ID" prop="monitorPointId">
        <ElInput v-model="formData.monitorPointId" placeholder="请输入监测点ID" />
      </ElFormItem>
      <ElFormItem label="仪器类型" prop="instrumentType">
        <ElInput v-model="formData.instrumentType" placeholder="请输入仪器类型" />
      </ElFormItem>
      <ElFormItem label="在线监测值" prop="onlineValue">
        <ElInput v-model="formData.onlineValue" placeholder="请输入在线监测值" />
      </ElFormItem>
      <ElFormItem label="实验室检测值" prop="labValue">
        <ElInput v-model="formData.labValue" placeholder="请输入实验室检测值" />
      </ElFormItem>
      <ElFormItem label="偏差值" prop="deviationValue">
        <ElInput v-model="formData.deviationValue" placeholder="请输入偏差值" />
      </ElFormItem>
      <ElFormItem label="是否超标" prop="isExceeded">
        <ElInput v-model="formData.isExceeded" placeholder="请输入是否超标(0否1是)" />
      </ElFormItem>
      <ElFormItem label="预警状态" prop="warningStatus">
        <ElInput v-model="formData.warningStatus" placeholder="请输入预警状态" />
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
