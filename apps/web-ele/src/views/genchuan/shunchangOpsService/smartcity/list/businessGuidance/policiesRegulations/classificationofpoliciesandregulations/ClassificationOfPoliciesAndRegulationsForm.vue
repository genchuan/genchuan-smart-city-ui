<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
} from 'element-plus';
import { ClassificationOfPoliciesAndRegulationsApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/classificationofpoliciesandregulations';

/** 政策法规分类 表单 */
defineOptions({ name: 'ClassificationOfPoliciesAndRegulationsForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  regulatoryCategory: undefined,
  isArea: undefined,
  theme: undefined,
  applicableObjects: undefined,
  levelOfEffectiveness: undefined,
  departmentOfPublication: undefined,
  implementationTime: undefined,
  revocatoryDate: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增政策法规分类' : '编辑政策法规分类';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await ClassificationOfPoliciesAndRegulationsApi.getClassificationOfPoliciesAndRegulations(
          id,
        );
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
      await ClassificationOfPoliciesAndRegulationsApi.createClassificationOfPoliciesAndRegulations(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await ClassificationOfPoliciesAndRegulationsApi.updateClassificationOfPoliciesAndRegulations(
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
    regulatoryCategory: undefined,
    isArea: undefined,
    theme: undefined,
    applicableObjects: undefined,
    levelOfEffectiveness: undefined,
    departmentOfPublication: undefined,
    implementationTime: undefined,
    revocatoryDate: undefined,
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
      <ElFormItem label="法规类别" prop="regulatoryCategory">
        <ElInput
          v-model="formData.regulatoryCategory"
          placeholder="请输入法规类别"
        />
      </ElFormItem>
      <ElFormItem label="所属领域" prop="isArea">
        <ElInput v-model="formData.isArea" placeholder="请输入所属领域" />
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
