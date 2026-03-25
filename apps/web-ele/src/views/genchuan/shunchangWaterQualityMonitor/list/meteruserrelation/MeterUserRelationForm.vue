<template>
  <ElDialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="户表编号" prop="meterCode">
        <ElInput v-model="formData.meterCode" placeholder="请输入户表编号" />
      </ElFormItem>
      <ElFormItem label="原用户编号" prop="oldUserCode">
        <ElInput v-model="formData.oldUserCode" placeholder="请输入原用户编号" />
      </ElFormItem>
      <ElFormItem label="新用户编号" prop="newUserCode">
        <ElInput v-model="formData.newUserCode" placeholder="请输入新用户编号" />
      </ElFormItem>
      <ElFormItem label="变更原因" prop="changeReason">
        <ElInput v-model="formData.changeReason" placeholder="请输入变更原因" />
      </ElFormItem>
      <ElFormItem label="变更时间" prop="changeTime">
        <ElDatePicker
          v-model="formData.changeTime"
          type="date"
          value-format="x"
          placeholder="选择变更时间"
        />
      </ElFormItem>
      <ElFormItem label="经办人" prop="operator">
        <ElInput v-model="formData.operator" placeholder="请输入经办人" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElSpace>
        <ElButton @click="submitForm" type="primary" :disabled="formLoading">
          确 定
        </ElButton>
        <ElButton @click="dialogVisible = false">取 消</ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElSpace,
} from 'element-plus';

import {
  MeterUserRelationApi,
  MeterUserRelationVO,
} from '#/api/genchuan/shunchangWaterQualityMonitor/list/meteruserrelation';

/** 户表关联及变更管理 表单 */
defineOptions({ name: 'MeterUserRelationForm' });

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  meterCode: undefined,
  oldUserCode: undefined,
  newUserCode: undefined,
  changeReason: undefined,
  changeTime: undefined,
  operator: undefined,
});
const formRules = reactive({
  meterCode: [{ required: true, message: '户表编号不能为空', trigger: 'blur' }],
  oldUserCode: [{ required: true, message: '原用户编号不能为空', trigger: 'blur' }],
  newUserCode: [{ required: true, message: '新用户编号不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增户表关联及变更' : '编辑户表关联及变更';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await MeterUserRelationApi.getMeterUserRelation(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as MeterUserRelationVO;
    if (formType.value === 'create') {
      await MeterUserRelationApi.createMeterUserRelation(data);
      ElMessage.success('新增成功');
    } else {
      await MeterUserRelationApi.updateMeterUserRelation(data);
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
    meterCode: undefined,
    oldUserCode: undefined,
    newUserCode: undefined,
    changeReason: undefined,
    changeTime: undefined,
    operator: undefined,
  };
  formRef.value?.resetFields();
};
</script>
