<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
  ElSelect,
  ElOption,
} from 'element-plus';

import { EventAnalysisApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/decisionSuggestion/componentEventSupervision/eventanalysis';

/** 事件关联分析 表单 */
defineOptions({ name: 'EventAnalysisForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  analysisNumber: undefined,
  mainEventNumber: undefined,
  mainEventName: undefined,
  relatedEventNumber: undefined,
  relatedEventName: undefined,
  associationType: undefined,
  associationStrength: undefined,
  analysisTime: undefined,
  analysts: undefined,
  conclusion: undefined,
  relatedEvidence: undefined,
  recommendedMeasure: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增事件关联分析' : '编辑事件关联分析';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      const res = await EventAnalysisApi.getEventAnalysis(id);
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        analysisTime: res.analysisTime ? Number(res.analysisTime) : undefined,
      };
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
      await EventAnalysisApi.createEventAnalysis(data);
      ElMessage.success('新增成功');
    } else {
      await EventAnalysisApi.updateEventAnalysis(data);
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
    analysisNumber: undefined,
    mainEventNumber: undefined,
    mainEventName: undefined,
    relatedEventNumber: undefined,
    relatedEventName: undefined,
    associationType: undefined,
    associationStrength: undefined,
    analysisTime: undefined,
    analysts: undefined,
    conclusion: undefined,
    relatedEvidence: undefined,
    recommendedMeasure: undefined,
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
      <ElFormItem label="关联分析编号" prop="analysisNumber">
        <ElInput
          v-model="formData.analysisNumber"
          placeholder="请输入关联分析编号"
        />
      </ElFormItem>
      <ElFormItem label="主事件编号" prop="mainEventNumber">
        <ElInput
          v-model="formData.mainEventNumber"
          placeholder="请输入主事件编号"
        />
      </ElFormItem>
      <ElFormItem label="主事件名称" prop="mainEventName">
        <ElInput
          v-model="formData.mainEventName"
          placeholder="请输入主事件名称"
        />
      </ElFormItem>
      <ElFormItem label="关联事件编号" prop="relatedEventNumber">
        <ElInput
          v-model="formData.relatedEventNumber"
          placeholder="请输入关联事件编号"
        />
      </ElFormItem>
      <ElFormItem label="关联事件名称" prop="relatedEventName">
        <ElInput
          v-model="formData.relatedEventName"
          placeholder="请输入关联事件名称"
        />
      </ElFormItem>
      <ElFormItem label="关联类型" prop="associationType">
        <ElSelect
          v-model="formData.associationType"
          placeholder="请选择关联类型"
        >
          <ElOption label="直接因果" value="direct_causal" />
          <ElOption label="间接因果" value="indirect_causal" />
          <ElOption label="同期发生" value="same_period" />
          <ElOption label="时序依赖" value="time_dependent" />
          <ElOption label="同部件关联" value="same_component" />
          <ElOption label="上下游关联" value="upstream_downstream" />
          <ElOption label="同系统关联" value="same_system" />
          <ElOption label="衍生关联" value="derivative" />
          <ElOption label="耦合关联" value="coupling" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="关联强度" prop="associationStrength">
        <ElInput
          v-model="formData.associationStrength"
          placeholder="请输入关联强度"
        />
      </ElFormItem>
      <ElFormItem label="分析时间" prop="analysisTime">
        <ElDatePicker
          v-model="formData.analysisTime"
          type="datetime"
          value-format="x"
          placeholder="选择分析时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="分析人员" prop="analysts">
        <ElInput v-model="formData.analysts" placeholder="请输入分析人员" />
      </ElFormItem>
      <ElFormItem label="分析结论" prop="conclusion">
        <ElInput v-model="formData.conclusion" placeholder="请输入分析结论" />
      </ElFormItem>
      <ElFormItem label="关联证据" prop="relatedEvidence">
        <ElInput
          v-model="formData.relatedEvidence"
          placeholder="请输入关联证据"
        />
      </ElFormItem>
      <ElFormItem label="建议措施" prop="recommendedMeasure">
        <ElInput
          v-model="formData.recommendedMeasure"
          placeholder="请输入建议措施"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading"
        >确 定</ElButton
      >
    </template>
  </ElDialog>
</template>
