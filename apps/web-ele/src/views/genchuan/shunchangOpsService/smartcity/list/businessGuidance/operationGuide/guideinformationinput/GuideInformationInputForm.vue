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

import { GuideInformationInputApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/operationGuide/guideinformationinput';

/** 指南信息录入 表单 */
defineOptions({ name: 'GuideInformationInputForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  guideName: undefined,
  scopeOfApplication: undefined,
  publishingUnit: undefined,
  releaseDate: undefined,
  updateDate: undefined,
  mainContentOverview: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增指南信息录入' : '编辑指南信息录入';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await GuideInformationInputApi.getGuideInformationInput(id);
      formData.value.releaseDate = formData.value.releaseDate
        ? Number(formData.value.releaseDate)
        : '';
      formData.value.updateDate = formData.value.updateDate
        ? Number(formData.value.updateDate)
        : '';
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
      await GuideInformationInputApi.createGuideInformationInput(data);
      ElMessage.success('新增成功');
    } else {
      await GuideInformationInputApi.updateGuideInformationInput(data);
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
    guideName: undefined,
    scopeOfApplication: undefined,
    publishingUnit: undefined,
    releaseDate: undefined,
    updateDate: undefined,
    mainContentOverview: undefined,
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
      <ElFormItem label="指南名称" prop="guideName">
        <ElInput v-model="formData.guideName" placeholder="请输入指南名称" />
      </ElFormItem>
      <ElFormItem label="适用范围" prop="scopeOfApplication">
        <ElInput
          v-model="formData.scopeOfApplication"
          placeholder="请输入适用范围"
        />
      </ElFormItem>
      <ElFormItem label="发布单位" prop="publishingUnit">
        <ElInput
          v-model="formData.publishingUnit"
          placeholder="请输入发布单位"
        />
      </ElFormItem>
      <ElFormItem label="发布日期" prop="releaseDate">
        <ElDatePicker
          v-model="formData.releaseDate"
          type="date"
          value-format="x"
          placeholder="选择发布日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="更新日期" prop="updateDate">
        <ElDatePicker
          v-model="formData.updateDate"
          type="date"
          value-format="x"
          placeholder="选择更新日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="主要内容概述" prop="mainContentOverview">
        <ElInput
          v-model="formData.mainContentOverview"
          placeholder="请输入主要内容概述"
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
