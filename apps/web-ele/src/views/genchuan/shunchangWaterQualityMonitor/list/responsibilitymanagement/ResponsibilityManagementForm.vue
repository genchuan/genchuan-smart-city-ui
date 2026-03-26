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

import { ResponsibilityManagementApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/responsibilitymanagement';

/** 责任单位及责任人管理 表单 */
defineOptions({ name: 'ResponsibilityManagementForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  responsibilityType: undefined,
  responsibleUnit: undefined,
  responsiblePerson: undefined,
  position: undefined,
  contactInfo: undefined,
  responsibilityScope: undefined,
});
const formRules = reactive({
  responsibilityType: [{ required: true, message: '责任类型不能为空', trigger: 'blur' }],
  responsibleUnit: [{ required: true, message: '责任单位不能为空', trigger: 'blur' }],
  responsiblePerson: [{ required: true, message: '责任人姓名不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增责任单位及责任人' : '编辑责任单位及责任人';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await ResponsibilityManagementApi.getResponsibilityManagement(id);
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
      await ResponsibilityManagementApi.createResponsibilityManagement(data);
      ElMessage.success('新增成功');
    } else {
      await ResponsibilityManagementApi.updateResponsibilityManagement(data);
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
    responsibilityType: undefined,
    responsibleUnit: undefined,
    responsiblePerson: undefined,
    position: undefined,
    contactInfo: undefined,
    responsibilityScope: undefined,
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
      <ElFormItem label="责任类型" prop="responsibilityType">
        <ElInput v-model="formData.responsibilityType" placeholder="请输入责任类型(主体责任/监管责任/运行管理责任)" />
      </ElFormItem>
      <ElFormItem label="责任单位" prop="responsibleUnit">
        <ElInput v-model="formData.responsibleUnit" placeholder="请输入责任单位" />
      </ElFormItem>
      <ElFormItem label="责任人姓名" prop="responsiblePerson">
        <ElInput v-model="formData.responsiblePerson" placeholder="请输入责任人姓名" />
      </ElFormItem>
      <ElFormItem label="职务" prop="position">
        <ElInput v-model="formData.position" placeholder="请输入职务" />
      </ElFormItem>
      <ElFormItem label="联系方式" prop="contactInfo">
        <ElInput v-model="formData.contactInfo" placeholder="请输入联系方式" />
      </ElFormItem>
      <ElFormItem label="责任范围" prop="responsibilityScope">
        <ElInput v-model="formData.responsibilityScope" placeholder="请输入责任范围" />
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
