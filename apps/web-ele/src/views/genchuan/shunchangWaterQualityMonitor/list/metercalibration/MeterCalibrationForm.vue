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

import { MeterCalibrationApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/metercalibration';

/** 监测仪表校准管理 表单 */
defineOptions({ name: 'MeterCalibrationForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  meterId: undefined,
  meterType: undefined,
  calibrationCycle: undefined,
  lastCalibrationDate: undefined,
  currentCalibrationDate: undefined,
  standardSolutionConc: undefined,
  beforeCalibrationValue: undefined,
  afterCalibrationValue: undefined,
  operatorId: undefined,
});
const formRules = reactive({
  meterId: [{ required: true, message: '仪表ID不能为空', trigger: 'blur' }],
  meterType: [{ required: true, message: '仪表类型不能为空', trigger: 'blur' }],
  calibrationCycle: [{ required: true, message: '校准周期(天)不能为空', trigger: 'blur' }],
  currentCalibrationDate: [{ required: true, message: '本次校准日期不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增监测仪表校准' : '编辑监测仪表校准';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await MeterCalibrationApi.getMeterCalibration(id);
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
      await MeterCalibrationApi.createMeterCalibration(data);
      ElMessage.success('新增成功');
    } else {
      await MeterCalibrationApi.updateMeterCalibration(data);
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
    meterId: undefined,
    meterType: undefined,
    calibrationCycle: undefined,
    lastCalibrationDate: undefined,
    currentCalibrationDate: undefined,
    standardSolutionConc: undefined,
    beforeCalibrationValue: undefined,
    afterCalibrationValue: undefined,
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
      label-width="120px"
      v-loading="formLoading"
    >
      <ElFormItem label="仪表ID" prop="meterId">
        <ElInput v-model="formData.meterId" placeholder="请输入仪表ID" />
      </ElFormItem>
      <ElFormItem label="仪表类型" prop="meterType">
        <ElInput v-model="formData.meterType" placeholder="请输入仪表类型" />
      </ElFormItem>
      <ElFormItem label="校准周期(天)" prop="calibrationCycle">
        <ElInput v-model="formData.calibrationCycle" placeholder="请输入校准周期(天)" />
      </ElFormItem>
      <ElFormItem label="上次校准日期" prop="lastCalibrationDate">
        <ElDatePicker
          v-model="formData.lastCalibrationDate"
          type="date"
          value-format="x"
          placeholder="选择上次校准日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="本次校准日期" prop="currentCalibrationDate">
        <ElDatePicker
          v-model="formData.currentCalibrationDate"
          type="date"
          value-format="x"
          placeholder="选择本次校准日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="标准溶液浓度" prop="standardSolutionConc">
        <ElInput v-model="formData.standardSolutionConc" placeholder="请输入标准溶液浓度" />
      </ElFormItem>
      <ElFormItem label="校准前示值" prop="beforeCalibrationValue">
        <ElInput v-model="formData.beforeCalibrationValue" placeholder="请输入校准前示值" />
      </ElFormItem>
      <ElFormItem label="校准后示值" prop="afterCalibrationValue">
        <ElInput v-model="formData.afterCalibrationValue" placeholder="请输入校准后示值" />
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
