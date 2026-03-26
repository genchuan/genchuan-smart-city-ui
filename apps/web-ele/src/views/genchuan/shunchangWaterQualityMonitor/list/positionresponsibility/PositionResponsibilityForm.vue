<script setup lang="ts">
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';
import { reactive, ref } from 'vue';

import { PositionResponsibilityApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/positionresponsibility';

/** 岗位职责划分管理 表单 */
defineOptions({ name: 'PositionResponsibilityForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  positionName: undefined,
  responsibilityDesc: undefined,
  qualificationReq: undefined,
  belongUnit: undefined,
  manager: undefined,
});
const formRules = reactive({
  positionName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  belongUnit: [{ required: true, message: '所属单位不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增岗位职责划分' : '编辑岗位职责划分';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await PositionResponsibilityApi.getPositionResponsibility(id);
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
      await PositionResponsibilityApi.createPositionResponsibility(data);
      ElMessage.success('新增成功');
    } else {
      await PositionResponsibilityApi.updatePositionResponsibility(data);
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
    positionName: undefined,
    responsibilityDesc: undefined,
    qualificationReq: undefined,
    belongUnit: undefined,
    manager: undefined,
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
      <ElFormItem label="岗位名称" prop="positionName">
        <ElInput v-model="formData.positionName" placeholder="请输入岗位名称" />
      </ElFormItem>
      <ElFormItem label="岗位职责描述" prop="responsibilityDesc">
        <ElInput v-model="formData.responsibilityDesc" placeholder="请输入岗位职责描述" />
      </ElFormItem>
      <ElFormItem label="任职要求" prop="qualificationReq">
        <ElInput v-model="formData.qualificationReq" placeholder="请输入任职要求" />
      </ElFormItem>
      <ElFormItem label="所属单位" prop="belongUnit">
        <ElInput v-model="formData.belongUnit" placeholder="请输入所属单位" />
      </ElFormItem>
      <ElFormItem label="负责人" prop="manager">
        <ElInput v-model="formData.manager" placeholder="请输入负责人" />
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
