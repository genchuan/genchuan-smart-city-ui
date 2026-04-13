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

import { InstrumentCalibrationApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/instrumentcalibration';

/** 仪器零点/量程漂移校验 表单 */
defineOptions({ name: 'InstrumentCalibrationForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  instrumentId: undefined,
  calibrationDate: undefined,
  zeroPointConc: undefined,
  zeroDrift: undefined,
  spanConc: undefined,
  spanDrift: undefined,
  calibrationResult: undefined,
  operatorId: undefined,
});
const formRules = reactive({
  instrumentId: [
    { required: true, message: '仪器ID不能为空', trigger: 'blur' },
  ],
  calibrationDate: [
    { required: true, message: '校验日期不能为空', trigger: 'blur' },
  ],
  zeroPointConc: [
    { required: true, message: '零点校正液浓度不能为空', trigger: 'blur' },
  ],
  zeroDrift: [
    { required: true, message: '零点漂移值不能为空', trigger: 'blur' },
  ],
  spanConc: [
    { required: true, message: '量程校正液浓度不能为空', trigger: 'blur' },
  ],
  spanDrift: [
    { required: true, message: '量程漂移值不能为空', trigger: 'blur' },
  ],
  calibrationResult: [
    { required: true, message: '校验结果不能为空', trigger: 'blur' },
  ],
  operatorId: [
    { required: true, message: '操作人员ID不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create'
      ? '新增仪器零点/量程漂移校验'
      : '编辑仪器零点/量程漂移校验';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await InstrumentCalibrationApi.getInstrumentCalibration(id);
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
      await InstrumentCalibrationApi.createInstrumentCalibration(data);
      ElMessage.success('新增成功');
    } else {
      await InstrumentCalibrationApi.updateInstrumentCalibration(data);
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
    instrumentId: undefined,
    calibrationDate: undefined,
    zeroPointConc: undefined,
    zeroDrift: undefined,
    spanConc: undefined,
    spanDrift: undefined,
    calibrationResult: undefined,
    operatorId: undefined,
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
      <ElFormItem label="仪器ID" prop="instrumentId">
        <ElInput v-model="formData.instrumentId" placeholder="请输入仪器ID" />
      </ElFormItem>
      <ElFormItem label="校验日期" prop="calibrationDate">
        <ElDatePicker
          v-model="formData.calibrationDate"
          type="date"
          value-format="x"
          placeholder="选择校验日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="零点校正液浓度" prop="zeroPointConc">
        <ElInput
          v-model="formData.zeroPointConc"
          placeholder="请输入零点校正液浓度"
        />
      </ElFormItem>
      <ElFormItem label="零点漂移值" prop="zeroDrift">
        <ElInput v-model="formData.zeroDrift" placeholder="请输入零点漂移值" />
      </ElFormItem>
      <ElFormItem label="量程校正液浓度" prop="spanConc">
        <ElInput
          v-model="formData.spanConc"
          placeholder="请输入量程校正液浓度"
        />
      </ElFormItem>
      <ElFormItem label="量程漂移值" prop="spanDrift">
        <ElInput v-model="formData.spanDrift" placeholder="请输入量程漂移值" />
      </ElFormItem>
      <ElFormItem label="校验结果" prop="calibrationResult">
        <ElInput
          v-model="formData.calibrationResult"
          placeholder="请输入校验结果"
        />
      </ElFormItem>
      <ElFormItem label="操作人员ID" prop="operatorId">
        <ElInput v-model="formData.operatorId" placeholder="请输入操作人员ID" />
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
