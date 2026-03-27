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

import { UserBasicInfoApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/userbasicinfo';

/** 用户基础信息登记 表单 */
defineOptions({ name: 'UserBasicInfoForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userCode: undefined,
  userName: undefined,
  idCardNo: undefined,
  address: undefined,
  phone: undefined,
  openDate: undefined,
});
const formRules = reactive({
  userCode: [{ required: true, message: '用户编号不能为空', trigger: 'blur' }],
  userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增用户基础信息' : '编辑用户基础信息';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await UserBasicInfoApi.getUserBasicInfo(id);
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
      await UserBasicInfoApi.createUserBasicInfo(data);
      ElMessage.success('新增成功');
    } else {
      await UserBasicInfoApi.updateUserBasicInfo(data);
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
    userName: undefined,
    idCardNo: undefined,
    address: undefined,
    phone: undefined,
    openDate: undefined,
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
      <ElFormItem label="姓名" prop="userName">
        <ElInput v-model="formData.userName" placeholder="请输入姓名" />
      </ElFormItem>
      <ElFormItem label="身份证号" prop="idCardNo">
        <ElInput v-model="formData.idCardNo" placeholder="请输入身份证号" />
      </ElFormItem>
      <ElFormItem label="家庭住址" prop="address">
        <ElInput v-model="formData.address" placeholder="请输入家庭住址" />
      </ElFormItem>
      <ElFormItem label="联系电话" prop="phone">
        <ElInput v-model="formData.phone" placeholder="请输入联系电话" />
      </ElFormItem>
      <ElFormItem label="开户日期" prop="openDate">
        <ElDatePicker
          v-model="formData.openDate"
          type="date"
          value-format="x"
          placeholder="选择开户日期"
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
