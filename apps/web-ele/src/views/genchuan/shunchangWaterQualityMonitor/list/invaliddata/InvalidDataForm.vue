<script setup lang="ts">
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';
import { reactive, ref } from 'vue';

import { InvalidDataApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/invaliddata';

/** 不合格数据处理 表单 */
defineOptions({ name: 'InvalidDataForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  dataId: undefined,
  instrumentId: undefined,
  monitorValue: undefined,
  collectionTime: undefined,
  dataStatus: undefined,
  invalidReason: undefined,
  isExcluded: undefined,
  processorId: undefined,
});
const formRules = reactive({
  dataId: [{ required: true, message: '数据ID不能为空', trigger: 'blur' }],
  instrumentId: [
    { required: true, message: '仪器ID不能为空', trigger: 'blur' },
  ],
  monitorValue: [
    { required: true, message: '监测值不能为空', trigger: 'blur' },
  ],
  collectionTime: [
    { required: true, message: '采集时间不能为空', trigger: 'blur' },
  ],
  dataStatus: [
    { required: true, message: '数据状态(有效/无效)不能为空', trigger: 'blur' },
  ],
  isExcluded: [
    {
      required: true,
      message: '剔除标记(0未剔除1已剔除)不能为空',
      trigger: 'blur',
    },
  ],
  processorId: [
    { required: true, message: '处理人员ID不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增不合格数据处理' : '编辑不合格数据处理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await InvalidDataApi.getInvalidData(id);
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
      await InvalidDataApi.createInvalidData(data);
      ElMessage.success('新增成功');
    } else {
      await InvalidDataApi.updateInvalidData(data);
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
    dataId: undefined,
    instrumentId: undefined,
    monitorValue: undefined,
    collectionTime: undefined,
    dataStatus: undefined,
    invalidReason: undefined,
    isExcluded: undefined,
    processorId: undefined,
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
      <ElFormItem label="数据ID" prop="dataId">
        <ElInput v-model="formData.dataId" placeholder="请输入数据ID" />
      </ElFormItem>
      <ElFormItem label="仪器ID" prop="instrumentId">
        <ElInput v-model="formData.instrumentId" placeholder="请输入仪器ID" />
      </ElFormItem>
      <ElFormItem label="监测值" prop="monitorValue">
        <ElInput v-model="formData.monitorValue" placeholder="请输入监测值" />
      </ElFormItem>
      <ElFormItem label="采集时间" prop="collectionTime">
        <ElDatePicker
          v-model="formData.collectionTime"
          type="date"
          value-format="x"
          placeholder="选择采集时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="数据状态" prop="dataStatus">
        <ElInput
          v-model="formData.dataStatus"
          placeholder="请输入数据状态(有效/无效)"
        />
      </ElFormItem>
      <ElFormItem label="无效原因" prop="invalidReason">
        <ElInput
          v-model="formData.invalidReason"
          placeholder="请输入无效原因"
        />
      </ElFormItem>
      <ElFormItem label="剔除标记" prop="isExcluded">
        <ElInput
          v-model="formData.isExcluded"
          placeholder="请输入剔除标记(0未剔除1已剔除)"
        />
      </ElFormItem>
      <ElFormItem label="处理人员ID" prop="processorId">
        <ElInput
          v-model="formData.processorId"
          placeholder="请输入处理人员ID"
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
