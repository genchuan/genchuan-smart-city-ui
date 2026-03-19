<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton
} from 'element-plus';
import {
  ClassificationOfExperienceInformationApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/classificationofexperienceinformation';

/** 经验信息分类 表单 */
defineOptions({ name: 'ClassificationOfExperienceInformationForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  sector: undefined,
  applicationScenarios: undefined,
  empiricalNature: undefined,
  applicableObjects: undefined,
  sourceChannel: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增经验信息分类' : '编辑经验信息分类';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await ClassificationOfExperienceInformationApi.getClassificationOfExperienceInformation(id);
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
      await ClassificationOfExperienceInformationApi.createClassificationOfExperienceInformation(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await ClassificationOfExperienceInformationApi.updateClassificationOfExperienceInformation(
        data,
      );
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
    sector: undefined,
    applicationScenarios: undefined,
    empiricalNature: undefined,
    applicableObjects: undefined,
    sourceChannel: undefined,
  };
  formRef.value?.resetFields();
};
</script>
<template>
  <ElDialog :title="dialogTitle" v-model="dialogVisible" width="600px" append-to-body>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="所属行业" prop="sector">
        <ElInput v-model="formData.sector" placeholder="请输入所属行业" />
      </ElFormItem>
      <ElFormItem label="应用场景" prop="applicationScenarios">
        <ElInput v-model="formData.applicationScenarios" placeholder="请输入应用场景" />
      </ElFormItem>
      <ElFormItem label="经验性质" prop="empiricalNature">
        <ElInput v-model="formData.empiricalNature" placeholder="请输入经验性质" />
      </ElFormItem>
      <ElFormItem label="适用对象" prop="applicableObjects">
        <ElInput v-model="formData.applicableObjects" placeholder="请输入适用对象" />
      </ElFormItem>
      <ElFormItem label="来源渠道" prop="sourceChannel">
        <ElInput v-model="formData.sourceChannel" placeholder="请输入来源渠道" />
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
