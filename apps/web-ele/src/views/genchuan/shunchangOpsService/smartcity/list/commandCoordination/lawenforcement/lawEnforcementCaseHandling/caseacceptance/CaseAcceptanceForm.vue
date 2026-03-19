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

import { CaseAcceptanceApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/caseacceptance';

/** 案件受理 表单 */
defineOptions({ name: 'CaseAcceptanceForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  caseCode: undefined,
  caseName: undefined,
  caseType: undefined,
  caseSource: undefined,
  caseTime: undefined,
  caseLocation: undefined,
  reportUnit: undefined,
  reportPerson: undefined,
  reportPhone: undefined,
  caseDesc: undefined,
  caseStatus: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增案件受理' : '编辑案件受理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      const res = await CaseAcceptanceApi.getCaseAcceptance(id);
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        caseTime: res.caseTime ? Number(res.caseTime) : undefined,
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
      await CaseAcceptanceApi.createCaseAcceptance(data);
      ElMessage.success('新增成功');
    } else {
      await CaseAcceptanceApi.updateCaseAcceptance(data);
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
    caseCode: undefined,
    caseName: undefined,
    caseType: undefined,
    caseSource: undefined,
    caseTime: undefined,
    caseLocation: undefined,
    reportUnit: undefined,
    reportPerson: undefined,
    reportPhone: undefined,
    caseDesc: undefined,
    caseStatus: undefined,
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
      <ElFormItem label="案件编号" prop="caseCode">
        <ElInput v-model="formData.caseCode" placeholder="请输入案件编号" />
      </ElFormItem>
      <ElFormItem label="案件名称" prop="caseName">
        <ElInput v-model="formData.caseName" placeholder="请输入案件名称" />
      </ElFormItem>
      <ElFormItem label="案件类型" prop="caseType">
        <ElInput v-model="formData.caseType" placeholder="请输入案件类型" />
      </ElFormItem>
      <ElFormItem label="案件来源" prop="caseSource">
        <ElSelect v-model="formData.caseSource" placeholder="请选择案件来源">
          <ElOption label="电话举报" value="telephone" />
          <ElOption label="网络举报" value="network" />
          <ElOption label="微信举报" value="wechat" />
          <ElOption label="市民随手拍" value="citizen_photo" />
          <ElOption label="在线监测系统自动上报" value="online_monitor" />
          <ElOption label="现场巡查发现" value="on_site_inspection" />
          <ElOption label="其他部门移交" value="other_department" />
          <ElOption label="来信举报" value="letter_report" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="案件时间" prop="caseTime">
        <ElDatePicker
          v-model="formData.caseTime"
          type="datetime"
          value-format="x"
          placeholder="选择案件时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="案件地点" prop="caseLocation">
        <ElInput v-model="formData.caseLocation" placeholder="请输入案件地点" />
      </ElFormItem>
      <ElFormItem label="报案单位" prop="reportUnit">
        <ElInput v-model="formData.reportUnit" placeholder="请输入报案单位" />
      </ElFormItem>
      <ElFormItem label="当事人信息" prop="reportPerson">
        <ElInput
          v-model="formData.reportPerson"
          placeholder="请输入当事人信息"
        />
      </ElFormItem>
      <ElFormItem label="联系电话" prop="reportPhone">
        <ElInput v-model="formData.reportPhone" placeholder="请输入联系电话" />
      </ElFormItem>
      <ElFormItem label="案件描述" prop="caseDesc">
        <ElInput
          v-model="formData.caseDesc"
          type="textarea"
          placeholder="请输入案件描述"
        />
      </ElFormItem>
      <ElFormItem label="立案状态" prop="caseStatus">
        <ElSelect v-model="formData.caseStatus" placeholder="请选择立案状态">
          <ElOption label="待立案" value="pending_filing" />
          <ElOption label="已立案" value="filed" />
          <ElOption label="不予立案" value="rejected_filing" />
          <ElOption label="驳回重审" value="rejected_review" />
        </ElSelect>
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
