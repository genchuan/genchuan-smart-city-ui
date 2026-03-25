<template>
  <ElDialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="180px"
      v-loading="formLoading"
    >
      <ElFormItem label="采样点编号" prop="pointCode">
        <ElInput v-model="formData.pointCode" placeholder="请输入采样点编号" />
      </ElFormItem>
      <ElFormItem label="指标名称" prop="indicatorName">
        <ElInput v-model="formData.indicatorName" placeholder="请输入指标名称" />
      </ElFormItem>
      <ElFormItem label="采样频率" prop="frequency">
        <ElInput v-model="formData.frequency" placeholder="请输入采样频率(次/月/季)" />
      </ElFormItem>
      <ElFormItem label="执行周期" prop="executionCycle">
        <ElInput v-model="formData.executionCycle" placeholder="请输入执行周期" />
      </ElFormItem>
      <ElFormItem label="特殊时段(如汛期)调整规则" prop="specialPeriodRule">
        <ElInput v-model="formData.specialPeriodRule" placeholder="请输入特殊时段(如汛期)调整规则" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElSpace>
        <ElButton @click="submitForm" type="primary" :disabled="formLoading">
          确 定
        </ElButton>
        <ElButton @click="dialogVisible = false">取 消</ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElSpace,
} from 'element-plus';

import {
  SamplingFrequencyApi,
  SamplingFrequencyVO,
} from '#/api/genchuan/shunchangWaterQualityMonitor/list/samplingfrequency';

/** 采样频率设置 表单 */
defineOptions({ name: 'SamplingFrequencyForm' });

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  pointCode: undefined,
  indicatorName: undefined,
  frequency: undefined,
  executionCycle: undefined,
  specialPeriodRule: undefined,
});
const formRules = reactive({
  pointCode: [{ required: true, message: '采样点编号不能为空', trigger: 'blur' }],
  indicatorName: [{ required: true, message: '指标名称不能为空', trigger: 'blur' }],
  frequency: [{ required: true, message: '采样频率不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增采样频率设置' : '编辑采样频率设置';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await SamplingFrequencyApi.getSamplingFrequency(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as SamplingFrequencyVO;
    if (formType.value === 'create') {
      await SamplingFrequencyApi.createSamplingFrequency(data);
      ElMessage.success('新增成功');
    } else {
      await SamplingFrequencyApi.updateSamplingFrequency(data);
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
    pointCode: undefined,
    indicatorName: undefined,
    frequency: undefined,
    executionCycle: undefined,
    specialPeriodRule: undefined,
  };
  formRef.value?.resetFields();
};
</script>
