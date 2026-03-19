<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton
} from 'element-plus';
import {
  MaintenancePersonnelApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingMaintenance/maintenancepersonnel';

/** 养护人员 表单 */
defineOptions({ name: 'MaintenancePersonnelForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  personnelId: undefined,
  personnelName: undefined,
  gender: undefined,
  contactInformation: undefined,
  idNumber: undefined,
  maintainTheLandParcel: undefined,
});
const formRules = reactive({
  personnelId: [{ required: true, message: '请输入人员编号', trigger: 'blur' }],
  personnelName: [{ required: true, message: '请输入人员姓名', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增养护人员' : '编辑养护人员';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await MaintenancePersonnelApi.getMaintenancePersonnel(id);
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
      await MaintenancePersonnelApi.createMaintenancePersonnel(data);
      ElMessage.success('新增成功');
    } else {
      await MaintenancePersonnelApi.updateMaintenancePersonnel(data);
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
    personnelId: undefined,
    personnelName: undefined,
    gender: undefined,
    contactInformation: undefined,
    idNumber: undefined,
    maintainTheLandParcel: undefined,
  };
  formRef.value?.resetFields();
};
</script>
<template>
  <ElDialog :title="dialogTitle" v-model="dialogVisible" width="600px" append-to-body>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="人员编号" prop="personnelId">
        <ElInput v-model="formData.personnelId" placeholder="请输入人员编号" />
      </ElFormItem>
      <ElFormItem label="人员姓名" prop="personnelName">
        <ElInput v-model="formData.personnelName" placeholder="请输入人员姓名" />
      </ElFormItem>
      <ElFormItem label="性别" prop="gender">
        <ElInput v-model="formData.gender" placeholder="请输入性别" />
      </ElFormItem>
      <ElFormItem label="联系方式" prop="contactInformation">
        <ElInput v-model="formData.contactInformation" placeholder="请输入联系方式" />
      </ElFormItem>
      <ElFormItem label="身份证号" prop="idNumber">
        <ElInput v-model="formData.idNumber" placeholder="请输入身份证号" />
      </ElFormItem>
      <ElFormItem label="养护地块" prop="maintainTheLandParcel">
        <ElInput v-model="formData.maintainTheLandParcel" placeholder="请输入养护地块" />
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
