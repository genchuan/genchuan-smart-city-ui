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
import { PatrolPersonnelApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/supervisionInspection/inspectionPatrolManagement/patrolpersonnel';

/** 巡查人员 表单 */
defineOptions({ name: 'PatrolPersonnelForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  number: undefined,
  fullName: undefined,
  gender: undefined,
  age: undefined,
  contactInformation: undefined,
  certificateTime: undefined,
  inspectionRemarks: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡查人员' : '编辑巡查人员';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await PatrolPersonnelApi.getPatrolPersonnel(id);
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
      await PatrolPersonnelApi.createPatrolPersonnel(data);
      ElMessage.success('新增成功');
    } else {
      await PatrolPersonnelApi.updatePatrolPersonnel(data);
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
    number: undefined,
    fullName: undefined,
    gender: undefined,
    age: undefined,
    contactInformation: undefined,
    certificateTime: undefined,
    inspectionRemarks: undefined,
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
      <ElFormItem label="编号" prop="number">
        <ElInput v-model="formData.number" placeholder="请输入编号" />
      </ElFormItem>
      <ElFormItem label="姓名" prop="fullName">
        <ElInput v-model="formData.fullName" placeholder="请输入姓名" />
      </ElFormItem>
      <ElFormItem label="性别" prop="gender">
        <ElInput v-model="formData.gender" placeholder="请输入性别" />
      </ElFormItem>
      <ElFormItem label="年龄" prop="age">
        <ElInput v-model="formData.age" placeholder="请输入年龄" />
      </ElFormItem>
      <ElFormItem label="联系方式" prop="contactInformation">
        <ElInput
          v-model="formData.contactInformation"
          placeholder="请输入联系方式"
        />
      </ElFormItem>
      <ElFormItem label="上岗时间" prop="certificateTime">
        <ElDatePicker
          v-model="formData.certificateTime"
          type="date"
          value-format="x"
          placeholder="选择上岗时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="巡查区域" prop="inspectionRemarks">
        <ElInput
          v-model="formData.inspectionRemarks"
          placeholder="请输入巡查区域"
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
