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
import { InspectionResultsAApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/supervisionInspection/inspectionPatrolManagement/inspectionresults';

/** 巡查结果 表单 */
defineOptions({ name: 'InspectionResultsAForm' });

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
  patrolPersonnel: undefined,
  patrolTime: undefined,
  patrolLocation: undefined,
  resourceName: undefined,
  resourceNumber: undefined,
  inspectionItems: undefined,
  inspectionResults: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡查结果' : '编辑巡查结果';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await InspectionResultsAApi.getInspectionResultsA(id);
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
      await InspectionResultsAApi.createInspectionResultsA(data);
      ElMessage.success('新增成功');
    } else {
      await InspectionResultsAApi.updateInspectionResultsA(data);
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
    patrolPersonnel: undefined,
    patrolTime: undefined,
    patrolLocation: undefined,
    resourceName: undefined,
    resourceNumber: undefined,
    inspectionItems: undefined,
    inspectionResults: undefined,
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
      <ElFormItem label="巡查人员" prop="patrolPersonnel">
        <ElInput
          v-model="formData.patrolPersonnel"
          placeholder="请输入巡查人员"
        />
      </ElFormItem>
      <ElFormItem label="巡查时间" prop="patrolTime">
        <ElDatePicker
          v-model="formData.patrolTime"
          type="datetime"
          value-format="x"
          placeholder="选择巡查时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="巡查地点" prop="patrolLocation">
        <ElInput
          v-model="formData.patrolLocation"
          placeholder="请输入巡查地点"
        />
      </ElFormItem>
      <ElFormItem label="资源名称" prop="resourceName">
        <ElInput v-model="formData.resourceName" placeholder="请输入资源名称" />
      </ElFormItem>
      <ElFormItem label="资源编号" prop="resourceNumber">
        <ElInput
          v-model="formData.resourceNumber"
          placeholder="请输入资源编号"
        />
      </ElFormItem>
      <ElFormItem label="检查项目" prop="inspectionItems">
        <ElInput
          v-model="formData.inspectionItems"
          placeholder="请输入检查项目"
        />
      </ElFormItem>
      <ElFormItem label="检查结果" prop="inspectionResults">
        <ElInput
          v-model="formData.inspectionResults"
          placeholder="请输入检查结果"
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
