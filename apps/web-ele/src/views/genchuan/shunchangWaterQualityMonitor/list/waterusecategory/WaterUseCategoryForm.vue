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

import { WaterUseCategoryApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/waterusecategory';

/** 用水性质分类管理 表单 */
defineOptions({ name: 'WaterUseCategoryForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userCode: undefined,
  waterUseType: undefined,
  waterQuota: undefined,
  categoryDate: undefined,
});
const formRules = reactive({
  userCode: [{ required: true, message: '用户编号不能为空', trigger: 'blur' }],
  waterUseType: [
    { required: true, message: '用水性质不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增用水性质分类管理' : '编辑用水性质分类管理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WaterUseCategoryApi.getWaterUseCategory(id);
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
      await WaterUseCategoryApi.createWaterUseCategory(data);
      ElMessage.success('新增成功');
    } else {
      await WaterUseCategoryApi.updateWaterUseCategory(data);
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
    userCode: undefined,
    waterUseType: undefined,
    waterQuota: undefined,
    categoryDate: undefined,
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
      <ElFormItem label="用户编号" prop="userCode">
        <ElInput v-model="formData.userCode" placeholder="请输入用户编号" />
      </ElFormItem>
      <ElFormItem label="用水性质" prop="waterUseType">
        <ElInput v-model="formData.waterUseType" placeholder="请输入用水性质" />
      </ElFormItem>
      <ElFormItem label="用水定额" prop="waterQuota">
        <ElInput
          v-model="formData.waterQuota"
          placeholder="请输入用水定额(立方米)"
        />
      </ElFormItem>
      <ElFormItem label="分类日期" prop="categoryDate">
        <ElDatePicker
          v-model="formData.categoryDate"
          type="date"
          value-format="x"
          placeholder="选择分类日期"
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
