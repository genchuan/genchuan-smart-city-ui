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

import { EnforcementPublicityApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/enforcementpublicity';

/** 执法公示 表单 */
defineOptions({ name: 'EnforcementPublicityForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  publicityNumber: undefined,
  publicityTitle: undefined,
  publicityContent: undefined,
  publicityType: undefined,
  enforcement: undefined,
  enforcementLocation: undefined,
  enforcementBasis: undefined,
  enforcementResults: undefined,
  announcementStartTime: undefined,
  announcementDeadline: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增执法公示' : '编辑执法公示';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      const res = await EnforcementPublicityApi.getEnforcementPublicity(id);
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        announcementStartTime: res.announcementStartTime
          ? Number(res.announcementStartTime)
          : undefined,
        announcementDeadline: res.announcementDeadline
          ? Number(res.announcementDeadline)
          : undefined,
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
      await EnforcementPublicityApi.createEnforcementPublicity(data);
      ElMessage.success('新增成功');
    } else {
      await EnforcementPublicityApi.updateEnforcementPublicity(data);
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
    publicityNumber: undefined,
    publicityTitle: undefined,
    publicityContent: undefined,
    publicityType: undefined,
    enforcement: undefined,
    enforcementLocation: undefined,
    enforcementBasis: undefined,
    enforcementResults: undefined,
    announcementStartTime: undefined,
    announcementDeadline: undefined,
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
      <ElFormItem label="执法公示编号" prop="publicityNumber">
        <ElInput
          v-model="formData.publicityNumber"
          placeholder="请输入执法公示编号"
        />
      </ElFormItem>
      <ElFormItem label="公示标题" prop="publicityTitle">
        <ElInput
          v-model="formData.publicityTitle"
          placeholder="请输入公示标题"
        />
      </ElFormItem>
      <ElFormItem label="公示内容" prop="publicityContent">
        <ElInput
          v-model="formData.publicityContent"
          type="textarea"
          placeholder="请输入公示内容"
        />
      </ElFormItem>
      <ElFormItem label="公示类型" prop="publicityType">
        <ElSelect v-model="formData.publicityType" placeholder="请选择公示类型">
          <ElOption label="行政处罚公示" value="administrative_penalty" />
          <ElOption label="行政许可公示" value="administrative_permit" />
          <ElOption label="行政强制公示" value="administrative_enforcement" />
          <ElOption label="执法依据公示" value="law_enforcement_basis" />
          <ElOption label="执法流程公示" value="law_enforcement_process" />
          <ElOption label="执法监督公示" value="law_enforcement_supervision" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="执法部门" prop="enforcement">
        <ElInput v-model="formData.enforcement" placeholder="请输入执法部门" />
      </ElFormItem>
      <ElFormItem label="执法地点" prop="enforcementLocation">
        <ElInput
          v-model="formData.enforcementLocation"
          placeholder="请输入执法地点"
        />
      </ElFormItem>
      <ElFormItem label="执法依据" prop="enforcementBasis">
        <ElInput
          v-model="formData.enforcementBasis"
          placeholder="请输入执法依据"
        />
      </ElFormItem>
      <ElFormItem label="执法结果" prop="enforcementResults">
        <ElInput
          v-model="formData.enforcementResults"
          placeholder="请输入执法结果"
        />
      </ElFormItem>
      <ElFormItem label="公示开始时间" prop="announcementStartTime">
        <ElDatePicker
          v-model="formData.announcementStartTime"
          type="datetime"
          value-format="x"
          placeholder="选择公示开始时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="公示截止时间" prop="announcementDeadline">
        <ElDatePicker
          v-model="formData.announcementDeadline"
          type="datetime"
          value-format="x"
          placeholder="选择公示截止时间"
          style="width: 100%"
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
