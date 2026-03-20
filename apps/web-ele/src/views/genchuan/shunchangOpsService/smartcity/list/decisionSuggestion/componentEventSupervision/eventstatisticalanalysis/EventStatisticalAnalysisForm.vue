<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
} from 'element-plus';

import { EventStatisticalAnalysisApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/decisionSuggestion/componentEventSupervision/eventstatisticalanalysis';

/** 事件统计分析 表单 */
defineOptions({ name: 'EventStatisticalAnalysisForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  statisticalCycle: undefined,
  eventType: undefined,
  numberOfEvents: undefined,
  place: undefined,
  highIncidencePeriod: undefined,
  aht: undefined,
  processingSuccessRate: undefined,
  severityDistribution: undefined,
  involvedDepartments: undefined,
  responsibleParty: undefined,
  proportionOfProcessing: undefined,
  resourceConsumption: undefined,
  proportionOfReporting: undefined,
  numberOfRepeatedEvents: undefined,
  timeSeriesTrend: undefined,
  numberOfRelated: undefined,
  publicFeedbackSatisfaction: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增事件统计分析' : '编辑事件统计分析';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await EventStatisticalAnalysisApi.getEventStatisticalAnalysis(id);
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
      await EventStatisticalAnalysisApi.createEventStatisticalAnalysis(data);
      ElMessage.success('新增成功');
    } else {
      await EventStatisticalAnalysisApi.updateEventStatisticalAnalysis(data);
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
    statisticalCycle: undefined,
    eventType: undefined,
    numberOfEvents: undefined,
    place: undefined,
    highIncidencePeriod: undefined,
    aht: undefined,
    processingSuccessRate: undefined,
    severityDistribution: undefined,
    involvedDepartments: undefined,
    responsibleParty: undefined,
    proportionOfProcessing: undefined,
    resourceConsumption: undefined,
    proportionOfReporting: undefined,
    numberOfRepeatedEvents: undefined,
    timeSeriesTrend: undefined,
    numberOfRelated: undefined,
    publicFeedbackSatisfaction: undefined,
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
      label-width="140px"
      v-loading="formLoading"
    >
      <ElFormItem label="统计周期" prop="statisticalCycle">
        <ElInput
          v-model="formData.statisticalCycle"
          placeholder="请输入统计周期"
        />
      </ElFormItem>
      <ElFormItem label="事件类型" prop="eventType">
        <ElSelect v-model="formData.eventType" placeholder="请选择事件类型">
          <ElOption label="故障事件" value="fault" />
          <ElOption label="维护事件" value="maintenance" />
          <ElOption label="异常运行事件" value="abnormal_operation" />
          <ElOption label="预警事件" value="early_warning" />
          <ElOption label="更换事件" value="replacement" />
          <ElOption label="巡检发现事件" value="inspection_found" />
          <ElOption label="报废事件" value="scrap" />
          <ElOption label="其他事件" value="other" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="事件数量" prop="numberOfEvents">
        <ElInput
          v-model="formData.numberOfEvents"
          placeholder="请输入事件数量"
        />
      </ElFormItem>
      <ElFormItem label="发生地点" prop="place">
        <ElInput v-model="formData.place" placeholder="请输入发生地点" />
      </ElFormItem>
      <ElFormItem label="高发时段" prop="highIncidencePeriod">
        <ElInput
          v-model="formData.highIncidencePeriod"
          placeholder="请输入高发时段"
        />
      </ElFormItem>
      <ElFormItem label="平均处理时长" prop="aht">
        <ElInput v-model="formData.aht" placeholder="请输入平均处理时长" />
      </ElFormItem>
      <ElFormItem label="处理成功率" prop="processingSuccessRate">
        <ElInput
          v-model="formData.processingSuccessRate"
          placeholder="请输入处理成功率"
        />
      </ElFormItem>
      <ElFormItem label="严重程度分布" prop="severityDistribution">
        <ElInput
          v-model="formData.severityDistribution"
          placeholder="请输入严重程度分布"
        />
      </ElFormItem>
      <ElFormItem label="涉及部门" prop="involvedDepartments">
        <ElInput
          v-model="formData.involvedDepartments"
          placeholder="请输入涉及部门"
        />
      </ElFormItem>
      <ElFormItem label="责任主体" prop="responsibleParty">
        <ElInput
          v-model="formData.responsibleParty"
          placeholder="请输入责任主体"
        />
      </ElFormItem>
      <ElFormItem label="处理方式占比" prop="proportionOfProcessing">
        <ElInput
          v-model="formData.proportionOfProcessing"
          placeholder="请输入处理方式占比"
        />
      </ElFormItem>
      <ElFormItem label="资源消耗统计" prop="resourceConsumption">
        <ElInput
          v-model="formData.resourceConsumption"
          placeholder="请输入资源消耗统计"
        />
      </ElFormItem>
      <ElFormItem label="不同渠道上报占比" prop="proportionOfReporting">
        <ElInput
          v-model="formData.proportionOfReporting"
          placeholder="请输入不同渠道上报占比"
        />
      </ElFormItem>
      <ElFormItem label="重复事件数量" prop="numberOfRepeatedEvents">
        <ElInput
          v-model="formData.numberOfRepeatedEvents"
          placeholder="请输入重复事件数量"
        />
      </ElFormItem>
      <ElFormItem label="时间序列趋势" prop="timeSeriesTrend">
        <ElInput
          v-model="formData.timeSeriesTrend"
          placeholder="请输入时间序列趋势"
        />
      </ElFormItem>
      <ElFormItem label="关联部件故障次数" prop="numberOfRelated">
        <ElInput
          v-model="formData.numberOfRelated"
          placeholder="请输入关联部件故障次数"
        />
      </ElFormItem>
      <ElFormItem label="公众反馈满意度评分" prop="publicFeedbackSatisfaction">
        <ElInput
          v-model="formData.publicFeedbackSatisfaction"
          placeholder="请输入公众反馈满意度评分"
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
