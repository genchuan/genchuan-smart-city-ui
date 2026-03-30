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

import { WaterSupplyAgreementApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersupplyagreement';

/** 供水协议管理 表单 */
defineOptions({ name: 'WaterSupplyAgreementForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  agreementNo: undefined,
  supplierName: undefined,
  consumerName: undefined,
  supplyScope: undefined,
  waterPriceStandard: undefined,
  responsibilityTerms: undefined,
  signDate: undefined,
  validDate: undefined,
});
const formRules = reactive({
  agreementNo: [
    { required: true, message: '协议编号不能为空', trigger: 'blur' },
  ],
  supplierName: [
    { required: true, message: '供水单位不能为空', trigger: 'blur' },
  ],
  consumerName: [
    { required: true, message: '用水方不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增供水协议管理' : '编辑供水协议管理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await WaterSupplyAgreementApi.getWaterSupplyAgreement(id);
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
      await WaterSupplyAgreementApi.createWaterSupplyAgreement(data);
      ElMessage.success('新增成功');
    } else {
      await WaterSupplyAgreementApi.updateWaterSupplyAgreement(data);
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
    agreementNo: undefined,
    supplierName: undefined,
    consumerName: undefined,
    supplyScope: undefined,
    waterPriceStandard: undefined,
    responsibilityTerms: undefined,
    signDate: undefined,
    validDate: undefined,
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
      <ElFormItem label="协议编号" prop="agreementNo">
        <ElInput v-model="formData.agreementNo" placeholder="请输入协议编号" />
      </ElFormItem>
      <ElFormItem label="供水单位" prop="supplierName">
        <ElInput v-model="formData.supplierName" placeholder="请输入供水单位" />
      </ElFormItem>
      <ElFormItem label="用水方" prop="consumerName">
        <ElInput v-model="formData.consumerName" placeholder="请输入用水方" />
      </ElFormItem>
      <ElFormItem label="供水范围" prop="supplyScope">
        <ElInput v-model="formData.supplyScope" placeholder="请输入供水范围" />
      </ElFormItem>
      <ElFormItem label="水价标准" prop="waterPriceStandard">
        <ElInput
          v-model="formData.waterPriceStandard"
          placeholder="请输入水价标准"
        />
      </ElFormItem>
      <ElFormItem label="责任条款" prop="responsibilityTerms">
        <ElInput
          v-model="formData.responsibilityTerms"
          placeholder="请输入责任条款"
        />
      </ElFormItem>
      <ElFormItem label="签订日期" prop="signDate">
        <ElDatePicker
          v-model="formData.signDate"
          type="date"
          value-format="x"
          placeholder="选择签订日期"
          style="width: 100%"
        />
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
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>
