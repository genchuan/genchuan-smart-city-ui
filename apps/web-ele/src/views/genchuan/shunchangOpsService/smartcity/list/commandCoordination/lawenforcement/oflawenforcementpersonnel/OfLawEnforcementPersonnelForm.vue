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

import { OfLawEnforcementPersonnelApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/oflawenforcementpersonnel';

/** 执法人员管理 表单 */
defineOptions({ name: 'OfLawEnforcementPersonnelForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  fullName: undefined,
  gender: undefined,
  idNumber: undefined,
  contactInformation: undefined,
  belongingLawDepartment: undefined,
  position: undefined,
  lawEnforcementNumber: undefined,
  validityCertificate: undefined,
  entryTime: undefined,
  educationalBackground: undefined,
  major: undefined,
  trainingExperience: undefined,
  resultOfExamination: undefined,
  rewardsRecord: undefined,
  violationRegulations: undefined,
  responsibleArea: undefined,
  emergencyContactName: undefined,
  emergencyContactPhone: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增执法人员管理' : '编辑执法人员管理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      const res =
        await OfLawEnforcementPersonnelApi.getOfLawEnforcementPersonnel(id);
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        validityCertificate: res.validityCertificate
          ? Number(res.validityCertificate)
          : undefined,
        entryTime: res.entryTime ? Number(res.entryTime) : undefined,
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
      await OfLawEnforcementPersonnelApi.createOfLawEnforcementPersonnel(data);
      ElMessage.success('新增成功');
    } else {
      await OfLawEnforcementPersonnelApi.updateOfLawEnforcementPersonnel(data);
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
    fullName: undefined,
    gender: undefined,
    idNumber: undefined,
    contactInformation: undefined,
    belongingLawDepartment: undefined,
    position: undefined,
    lawEnforcementNumber: undefined,
    validityCertificate: undefined,
    entryTime: undefined,
    educationalBackground: undefined,
    major: undefined,
    trainingExperience: undefined,
    resultOfExamination: undefined,
    rewardsRecord: undefined,
    violationRegulations: undefined,
    responsibleArea: undefined,
    emergencyContactName: undefined,
    emergencyContactPhone: undefined,
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
      <ElFormItem label="姓名" prop="fullName">
        <ElInput v-model="formData.fullName" placeholder="请输入姓名" />
      </ElFormItem>
      <ElFormItem label="性别" prop="gender">
        <ElInput v-model="formData.gender" placeholder="请输入性别" />
      </ElFormItem>
      <ElFormItem label="身份证号" prop="idNumber">
        <ElInput v-model="formData.idNumber" placeholder="请输入身份证号" />
      </ElFormItem>
      <ElFormItem label="联系方式" prop="contactInformation">
        <ElInput
          v-model="formData.contactInformation"
          placeholder="请输入联系方式"
        />
      </ElFormItem>
      <ElFormItem label="所属执法部门" prop="belongingLawDepartment">
        <ElInput
          v-model="formData.belongingLawDepartment"
          placeholder="请输入所属执法部门"
        />
      </ElFormItem>
      <ElFormItem label="职务" prop="position">
        <ElInput v-model="formData.position" placeholder="请输入职务" />
      </ElFormItem>
      <ElFormItem label="执法证编号" prop="lawEnforcementNumber">
        <ElInput
          v-model="formData.lawEnforcementNumber"
          placeholder="请输入执法证编号"
        />
      </ElFormItem>
      <ElFormItem label="执法证有效期" prop="validityCertificate">
        <ElDatePicker
          v-model="formData.validityCertificate"
          type="date"
          value-format="x"
          placeholder="选择执法证有效期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="入职时间" prop="entryTime">
        <ElDatePicker
          v-model="formData.entryTime"
          type="date"
          value-format="x"
          placeholder="选择入职时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="学历" prop="educationalBackground">
        <ElInput
          v-model="formData.educationalBackground"
          placeholder="请输入学历"
        />
      </ElFormItem>
      <ElFormItem label="专业" prop="major">
        <ElInput v-model="formData.major" placeholder="请输入专业" />
      </ElFormItem>
      <ElFormItem label="培训经历" prop="trainingExperience">
        <ElInput
          v-model="formData.trainingExperience"
          placeholder="请输入培训经历"
        />
      </ElFormItem>
      <ElFormItem label="考核成绩" prop="resultOfExamination">
        <ElInput
          v-model="formData.resultOfExamination"
          placeholder="请输入考核成绩"
        />
      </ElFormItem>
      <ElFormItem label="奖惩记录" prop="rewardsRecord">
        <ElInput
          v-model="formData.rewardsRecord"
          placeholder="请输入奖惩记录"
        />
      </ElFormItem>
      <ElFormItem label="违规违纪情况" prop="violationRegulations">
        <ElInput
          v-model="formData.violationRegulations"
          placeholder="请输入违规违纪情况"
        />
      </ElFormItem>
      <ElFormItem label="负责区域" prop="responsibleArea">
        <ElInput
          v-model="formData.responsibleArea"
          placeholder="请输入负责区域"
        />
      </ElFormItem>
      <ElFormItem label="紧急联系人姓名" prop="emergencyContactName">
        <ElInput
          v-model="formData.emergencyContactName"
          placeholder="请输入紧急联系人姓名"
        />
      </ElFormItem>
      <ElFormItem label="紧急联系人电话" prop="emergencyContactPhone">
        <ElInput
          v-model="formData.emergencyContactPhone"
          placeholder="请输入紧急联系人电话"
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
