<script setup lang="ts">
import { ref, reactive } from 'vue';
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
import { LawEnforcementSupervisionApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawenforcementsupervision';

/** 执法监督 表单 */
defineOptions({ name: 'LawEnforcementSupervisionForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  supervisionId: undefined,
  eventNumber: undefined,
  officials: undefined,
  personnel: undefined,
  time: undefined,
  method: undefined,
  integrityCollection: undefined,
  satisfactionInvolved: undefined,
  resultEvaluation: undefined,
  violationDescription: undefined,
  evidenceDetail: undefined,
  rectifyRequirements: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增执法监督' : '编辑执法监督';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await LawEnforcementSupervisionApi.getLawEnforcementSupervision(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 定义 success 事件，用于操作成功后的回调

/** 证据类型变化处理 */
const handleEvidenceChange = () => {
  if (formData.value.integrityCollection === 'no_evidence') {
    formData.value.evidenceDetail = undefined;
  }
};

/** 监督结果变化处理 */
const handleResultChange = () => {
  if (
    formData.value.resultEvaluation !== 'minor_violation' &&
    formData.value.resultEvaluation !== 'serious_violation'
  ) {
    formData.value.rectifyRequirements = undefined;
  }
};

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value;
    if (formType.value === 'create') {
      await LawEnforcementSupervisionApi.createLawEnforcementSupervision(data);
      ElMessage.success('新增成功');
    } else {
      await LawEnforcementSupervisionApi.updateLawEnforcementSupervision(data);
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
    supervisionId: undefined,
    eventNumber: undefined,
    officials: undefined,
    personnel: undefined,
    time: undefined,
    method: undefined,
    integrityCollection: undefined,
    satisfactionInvolved: undefined,
    resultEvaluation: undefined,
    violationDescription: undefined,
    evidenceDetail: undefined,
    rectifyRequirements: undefined,
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
      <ElFormItem label="监督编号" prop="supervisionId">
        <ElInput
          v-model="formData.supervisionId"
          placeholder="请输入监督编号"
        />
      </ElFormItem>
      <ElFormItem label="执法事件编号" prop="eventNumber">
        <ElInput
          v-model="formData.eventNumber"
          placeholder="请输入执法事件编号"
        />
      </ElFormItem>
      <ElFormItem label="执法人员" prop="officials">
        <ElInput v-model="formData.officials" placeholder="请输入执法人员" />
      </ElFormItem>
      <ElFormItem label="监督人员" prop="personnel">
        <ElInput v-model="formData.personnel" placeholder="请输入监督人员" />
      </ElFormItem>
      <ElFormItem label="监督时间" prop="time">
        <ElDatePicker
          v-model="formData.time"
          type="date"
          value-format="x"
          placeholder="选择监督时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="监督类型" prop="method">
        <ElSelect
          v-model="formData.method"
          placeholder="请选择监督类型"
          clearable
        >
          <ElOption value="internal_recorder" label="执法记录仪核查" />
          <ElOption value="internal_replay" label="执法过程回放" />
          <ElOption value="internal_document" label="执法文书审查" />
          <ElOption value="internal_case_review" label="执法案件评查" />
          <ElOption value="internal_performance" label="执法绩效考核" />
          <ElOption value="external_complaint" label="投诉举报核查" />
          <ElOption value="external_satisfaction" label="满意度调查" />
          <ElOption value="external_information" label="信息公开检查" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="监督证据" prop="integrityCollection">
        <ElSelect
          v-model="formData.integrityCollection"
          placeholder="请选择监督证据类型"
          clearable
          @change="handleEvidenceChange"
        >
          <ElOption value="recorder_video" label="执法记录仪视频" />
          <ElOption value="law_document" label="执法文书" />
          <ElOption value="complaint_evidence" label="投诉举报证据" />
          <ElOption value="satisfaction_survey" label="满意度调查问卷" />
          <ElOption value="information_public" label="信息公开材料" />
          <ElOption value="no_evidence" label="无监督证据" />
        </ElSelect>
        <ElInput
          v-if="
            formData.integrityCollection &&
            formData.integrityCollection !== 'no_evidence'
          "
          v-model="formData.evidenceDetail"
          placeholder="请补充证据详情（如设备编号、上传状态等）"
          style=" width: 100%;margin-top: 10px"
        />
      </ElFormItem>
      <ElFormItem label="群众满意度" prop="satisfactionInvolved">
        <ElInput
          v-model="formData.satisfactionInvolved"
          placeholder="请输入当事人满意度"
        />
      </ElFormItem>
      <ElFormItem label="监督结果" prop="resultEvaluation">
        <ElSelect
          v-model="formData.resultEvaluation"
          placeholder="请选择监督结果"
          clearable
          @change="handleResultChange"
        >
          <ElOption value="qualified" label="合格" />
          <ElOption value="minor_violation" label="轻微违规" />
          <ElOption value="serious_violation" label="严重违规" />
          <ElOption value="rectified" label="已完成整改" />
          <ElOption value="no_need_rectify" label="无需整改" />
        </ElSelect>
        <ElInput
          v-if="
            formData.resultEvaluation === 'minor_violation' ||
            formData.resultEvaluation === 'serious_violation'
          "
          v-model="formData.rectifyRequirements"
          placeholder="请输入整改要求（如：3 日内补正执法文书）"
          style=" width: 100%;margin-top: 10px"
        />
      </ElFormItem>
      <ElFormItem label="监督问题描述" prop="violationDescription">
        <ElInput
          v-model="formData.violationDescription"
          placeholder="请输入违规行为描述"
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
