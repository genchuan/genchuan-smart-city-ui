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

import { TestingAgencyApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/testingagency';

/** 检测机构资质管理 表单 */
defineOptions({ name: 'TestingAgencyForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  agencyCode: undefined,
  agencyName: undefined,
  certificateNo: undefined,
  testingScope: undefined,
  validDate: undefined,
  issuingAuthority: undefined,
});
const formRules = reactive({
  agencyCode: [
    { required: true, message: '机构编号不能为空', trigger: 'blur' },
  ],
  agencyName: [
    { required: true, message: '机构名称不能为空', trigger: 'blur' },
  ],
  certificateNo: [
    { required: true, message: '资质证书编号不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增检测机构资质' : '编辑检测机构资质';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await TestingAgencyApi.getTestingAgency(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value;
    if (formType.value === 'create') {
      await TestingAgencyApi.createTestingAgency(data);
      ElMessage.success('新增成功');
    } else {
      await TestingAgencyApi.updateTestingAgency(data);
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
    agencyCode: undefined,
    agencyName: undefined,
    certificateNo: undefined,
    testingScope: undefined,
    validDate: undefined,
    issuingAuthority: undefined,
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
      <ElFormItem label="机构编号" prop="agencyCode">
        <ElInput v-model="formData.agencyCode" placeholder="请输入机构编号" />
      </ElFormItem>
      <ElFormItem label="机构名称" prop="agencyName">
        <ElInput v-model="formData.agencyName" placeholder="请输入机构名称" />
      </ElFormItem>
      <ElFormItem label="资质证书编号" prop="certificateNo">
        <ElInput
          v-model="formData.certificateNo"
          placeholder="请输入资质证书编号"
        />
      </ElFormItem>
      <ElFormItem label="检测范围" prop="testingScope">
        <ElInput v-model="formData.testingScope" placeholder="请输入检测范围" />
      </ElFormItem>
      <ElFormItem label="有效期至" prop="validDate">
        <ElDatePicker
          v-model="formData.validDate"
          type="date"
          value-format="x"
          placeholder="选择有效期至"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="发证单位" prop="issuingAuthority">
        <ElInput
          v-model="formData.issuingAuthority"
          placeholder="请输入发证单位"
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
