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
} from 'element-plus';
import { LawDocumentApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/lawdocument';

/** 执法文书 表单 */
defineOptions({ name: 'LawDocumentForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  caseId: undefined,
  documentType: undefined,
  documentCode: undefined,
  documentTitle: undefined,
  documentContent: undefined,
  documentCreator: undefined,
  approver: undefined,
  approvalTime: undefined,
  approvalStatus: undefined,
  signatory: undefined,
  signTime: undefined,
  sealStatus: undefined,
  sealTime: undefined,
  printStatus: undefined,
  printTimes: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增执法文书' : '编辑执法文书';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await LawDocumentApi.getLawDocument(id);
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
      await LawDocumentApi.createLawDocument(data);
      ElMessage.success('新增成功');
    } else {
      await LawDocumentApi.updateLawDocument(data);
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
    caseId: undefined,
    documentType: undefined,
    documentCode: undefined,
    documentTitle: undefined,
    documentContent: undefined,
    documentCreator: undefined,
    approver: undefined,
    approvalTime: undefined,
    approvalStatus: undefined,
    signatory: undefined,
    signTime: undefined,
    sealStatus: undefined,
    sealTime: undefined,
    printStatus: undefined,
    printTimes: undefined,
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
      <ElFormItem label="案件 ID" prop="caseId">
        <ElInput v-model="formData.caseId" placeholder="请输入案件 ID" />
      </ElFormItem>
      <ElFormItem label="文书类型" prop="documentType">
        <ElInput v-model="formData.documentType" placeholder="请输入文书类型" />
      </ElFormItem>
      <ElFormItem label="文书编号" prop="documentCode">
        <ElInput v-model="formData.documentCode" placeholder="请输入文书编号" />
      </ElFormItem>
      <ElFormItem label="文书标题" prop="documentTitle">
        <ElInput
          v-model="formData.documentTitle"
          placeholder="请输入文书标题"
        />
      </ElFormItem>
      <ElFormItem label="文书内容" prop="documentContent">
        <ElInput
          v-model="formData.documentContent"
          type="textarea"
          placeholder="请输入文书内容"
        />
      </ElFormItem>
      <ElFormItem label="创建人" prop="documentCreator">
        <ElInput
          v-model="formData.documentCreator"
          placeholder="请输入创建人"
        />
      </ElFormItem>
      <ElFormItem label="审批人" prop="approver">
        <ElInput v-model="formData.approver" placeholder="请输入审批人" />
      </ElFormItem>
      <ElFormItem label="审批时间" prop="approvalTime">
        <ElDatePicker
          v-model="formData.approvalTime"
          type="date"
          value-format="x"
          placeholder="选择审批时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="审批状态" prop="approvalStatus">
        <ElInput
          v-model="formData.approvalStatus"
          placeholder="请输入审批状态"
        />
      </ElFormItem>
      <ElFormItem label="签署人" prop="signatory">
        <ElInput v-model="formData.signatory" placeholder="请输入签署人" />
      </ElFormItem>
      <ElFormItem label="签署时间" prop="signTime">
        <ElDatePicker
          v-model="formData.signTime"
          type="date"
          value-format="x"
          placeholder="选择签署时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="盖章状态" prop="sealStatus">
        <ElInput v-model="formData.sealStatus" placeholder="请输入盖章状态" />
      </ElFormItem>
      <ElFormItem label="盖章时间" prop="sealTime">
        <ElDatePicker
          v-model="formData.sealTime"
          type="date"
          value-format="x"
          placeholder="选择盖章时间"
          style="width: 100%"
        />
      </ElFormItem>
      <!--<ElFormItem label="打印状态" prop="printStatus">
        <ElInput v-model="formData.printStatus" placeholder="请输入打印状态" />
      </ElFormItem>
      <ElFormItem label="打印次数" prop="printTimes">
        <ElInput v-model="formData.printTimes" placeholder="请输入打印次数" />
      </ElFormItem>-->
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>
