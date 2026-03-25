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

import { IssueTrackingApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/issuetracking';

/** 问题上报与闭环跟踪 表单 */
defineOptions({ name: 'IssueTrackingForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  issueId: undefined,
  issueType: undefined,
  reportTime: undefined,
  dispatchTime: undefined,
  repairStaffId: undefined,
  repairTime: undefined,
  inspectionResult: undefined,
  closureStatus: undefined,
});
const formRules = reactive({
  issueId: [{ required: true, message: '问题ID不能为空', trigger: 'blur' }],
  issueType: [{ required: true, message: '问题类型(漏点/设备故障/标识牌损坏)不能为空', trigger: 'blur' }],
  reportTime: [{ required: true, message: '上报时间不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增问题上报与闭环跟踪' : '编辑问题上报与闭环跟踪';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await IssueTrackingApi.getIssueTracking(id);
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
      await IssueTrackingApi.createIssueTracking(data);
      ElMessage.success('新增成功');
    } else {
      await IssueTrackingApi.updateIssueTracking(data);
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
    issueId: undefined,
    issueType: undefined,
    reportTime: undefined,
    dispatchTime: undefined,
    repairStaffId: undefined,
    repairTime: undefined,
    inspectionResult: undefined,
    closureStatus: undefined,
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
      <ElFormItem label="问题ID" prop="issueId">
        <ElInput v-model="formData.issueId" placeholder="请输入问题ID" />
      </ElFormItem>
      <ElFormItem label="问题类型" prop="issueType">
        <ElInput v-model="formData.issueType" placeholder="请输入问题类型(漏点/设备故障/标识牌损坏)" />
      </ElFormItem>
      <ElFormItem label="上报时间" prop="reportTime">
        <ElDatePicker
          v-model="formData.reportTime"
          type="date"
          value-format="x"
          placeholder="选择上报时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="派单时间" prop="dispatchTime">
        <ElDatePicker
          v-model="formData.dispatchTime"
          type="date"
          value-format="x"
          placeholder="选择派单时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="维修人员ID" prop="repairStaffId">
        <ElInput v-model="formData.repairStaffId" placeholder="请输入维修人员ID" />
      </ElFormItem>
      <ElFormItem label="修复时间" prop="repairTime">
        <ElDatePicker
          v-model="formData.repairTime"
          type="date"
          value-format="x"
          placeholder="选择修复时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="验收结果" prop="inspectionResult">
        <ElInput v-model="formData.inspectionResult" placeholder="请输入验收结果" />
      </ElFormItem>
      <ElFormItem label="闭环状态" prop="closureStatus">
        <ElInput v-model="formData.closureStatus" placeholder="请输入闭环状态" />
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
