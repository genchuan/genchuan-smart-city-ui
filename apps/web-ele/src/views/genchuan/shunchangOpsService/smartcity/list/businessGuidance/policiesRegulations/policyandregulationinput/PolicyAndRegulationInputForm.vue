<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
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
import { PolicyAndRegulationInputApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/policyandregulationinput';
import { ClassificationOfPoliciesAndRegulationsApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/classificationofpoliciesandregulations';

/** 政策法规录入 表单 */
defineOptions({ name: 'PolicyAndRegulationInputForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const regulatoryCategoryOptions = ref([]); // 法规分类
const formData = ref({
  id: undefined,
  developingAgencies: undefined,
  nameOfPolicyAndRegulation: undefined,
  documentNumber: undefined,
  releaseDate: undefined,
  effectiveDate: undefined,
  expiringDate: undefined,
  regulatoryCategory: undefined,
  isArea: undefined,
  scopeOfApplication: undefined,
  mainContent: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 初始化法规分类数据 */
const initData = async () => {
  const queryParams = {
    pageNo: 1,
    pageSize: 100,
  };
  const data =
    await ClassificationOfPoliciesAndRegulationsApi.getClassificationOfPoliciesAndRegulationsPage(
      queryParams,
    );
  regulatoryCategoryOptions.value = data.list.map((item) => ({
    label: item.regulatoryCategory,
    value: item.id,
  }));
};

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增政策法规录入' : '编辑政策法规录入';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await PolicyAndRegulationInputApi.getPolicyAndRegulationInput(id);
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
      await PolicyAndRegulationInputApi.createPolicyAndRegulationInput(data);
      ElMessage.success('新增成功');
    } else {
      await PolicyAndRegulationInputApi.updatePolicyAndRegulationInput(data);
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
    developingAgencies: undefined,
    nameOfPolicyAndRegulation: undefined,
    documentNumber: undefined,
    releaseDate: undefined,
    effectiveDate: undefined,
    expiringDate: undefined,
    regulatoryCategory: undefined,
    isArea: undefined,
    scopeOfApplication: undefined,
    mainContent: undefined,
  };
  formRef.value?.resetFields();
};

/** 初始化 */
onMounted(() => {
  initData();
});
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
      <ElFormItem label="制定机关" prop="developingAgencies">
        <ElInput
          v-model="formData.developingAgencies"
          placeholder="请输入制定机关"
        />
      </ElFormItem>
      <ElFormItem label="政策法规名称" prop="nameOfPolicyAndRegulation">
        <ElInput
          v-model="formData.nameOfPolicyAndRegulation"
          placeholder="请输入政策法规名称"
        />
      </ElFormItem>
      <ElFormItem label="文号" prop="documentNumber">
        <ElInput v-model="formData.documentNumber" placeholder="请输入文号" />
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
      <ElFormItem label="生效日期" prop="effectiveDate">
        <ElDatePicker
          v-model="formData.effectiveDate"
          type="date"
          value-format="x"
          placeholder="选择生效日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="失效日期" prop="expiringDate">
        <ElDatePicker
          v-model="formData.expiringDate"
          type="date"
          value-format="x"
          placeholder="选择失效日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="法规类别" prop="regulatoryCategory">
        <ElSelect
          v-model="formData.regulatoryCategory"
          placeholder="请选择法规类别"
        >
          <ElOption
            v-for="item in regulatoryCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="所属领域" prop="isArea">
        <ElInput v-model="formData.isArea" placeholder="请输入所属领域" />
      </ElFormItem>
      <ElFormItem label="适用范围" prop="scopeOfApplication">
        <ElInput
          v-model="formData.scopeOfApplication"
          placeholder="请输入适用范围"
        />
      </ElFormItem>
      <ElFormItem label="正文内容" prop="mainContent">
        <ElInput
          v-model="formData.mainContent"
          type="textarea"
          placeholder="请输入正文内容"
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
