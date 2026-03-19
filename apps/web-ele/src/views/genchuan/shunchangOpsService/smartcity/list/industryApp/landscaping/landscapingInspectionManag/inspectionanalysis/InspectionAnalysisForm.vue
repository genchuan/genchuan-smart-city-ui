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

import { InspectionAnalysisApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingInspectionManag/inspectionanalysis';

/** 巡查分析 表单 */
defineOptions({ name: 'InspectionAnalysisForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  inspector: undefined,
  cycleStartTime: undefined,
  cycleEndTime: undefined,
  completedTaskCount: undefined,
  totalMileageKm: undefined,
  totalDurationH: undefined,
  foundProblemCount: undefined,
});
const formRules = reactive({
  inspector: [{ required: true, message: '请输入巡查人员', trigger: 'blur' }],
  cycleStartTime: [
    { required: true, message: '请选择巡查开始时间', trigger: 'change' },
  ],
  cycleEndTime: [
    { required: true, message: '请选择巡查结束时间', trigger: 'change' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡查分析' : '编辑巡查分析';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await InspectionAnalysisApi.getInspectionAnalysis(id);
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
      await InspectionAnalysisApi.createInspectionAnalysis(data);
      ElMessage.success('新增成功');
    } else {
      await InspectionAnalysisApi.updateInspectionAnalysis(data);
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
    inspector: undefined,
    cycleStartTime: undefined,
    cycleEndTime: undefined,
    completedTaskCount: undefined,
    totalMileageKm: undefined,
    totalDurationH: undefined,
    foundProblemCount: undefined,
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
      label-width="150px"
      v-loading="formLoading"
    >
      <ElFormItem label="巡查人员" prop="inspector">
        <ElInput v-model="formData.inspector" placeholder="请输入巡查人员" />
      </ElFormItem>
      <ElFormItem label="巡查开始时间" prop="cycleStartTime">
        <ElDatePicker
          v-model="formData.cycleStartTime"
          type="datetime"
          value-format="x"
          placeholder="请选择巡查开始时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="巡查结束时间" prop="cycleEndTime">
        <ElDatePicker
          v-model="formData.cycleEndTime"
          type="datetime"
          value-format="x"
          placeholder="请选择巡查结束时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="完成巡查任务数" prop="completedTaskCount">
        <ElInput
          v-model.number="formData.completedTaskCount"
          placeholder="请输入完成巡查任务数"
          type="number"
        />
      </ElFormItem>
      <ElFormItem label="巡查总里程（km）" prop="totalMileageKm">
        <ElInput
          v-model.number="formData.totalMileageKm"
          placeholder="请输入巡查总里程"
          type="number"
          step="0.1"
        />
      </ElFormItem>
      <ElFormItem label="巡查总时长（h）" prop="totalDurationH">
        <ElInput
          v-model.number="formData.totalDurationH"
          placeholder="请输入巡查总时长"
          type="number"
          step="0.1"
        />
      </ElFormItem>
      <ElFormItem label="发现问题总数" prop="foundProblemCount">
        <ElInput
          v-model.number="formData.foundProblemCount"
          placeholder="请输入发现问题总数"
          type="number"
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
