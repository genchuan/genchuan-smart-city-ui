<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
} from 'element-plus';

import { InspectionInspectionPlanApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/supervisionInspection/inspectionPatrolManagement/inspectioninspectionplan';
import { $t } from '#/locales';

/** 巡查计划 表单 */
defineOptions({ name: 'InspectionInspectionPlanForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  inspectionProject: undefined,
  patrolLocation: undefined,
  inspectionCycle: undefined,
  patrolTime: undefined,
  inspectionMethod: undefined,
  notes: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡查计划' : '编辑巡查计划';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await InspectionInspectionPlanApi.getInspectionInspectionPlan(id);
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
      await InspectionInspectionPlanApi.createInspectionInspectionPlan(data);
      ElMessage.success('新增成功');
    } else {
      await InspectionInspectionPlanApi.updateInspectionInspectionPlan(data);
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
    inspectionProject: undefined,
    patrolLocation: undefined,
    inspectionCycle: undefined,
    patrolTime: undefined,
    inspectionMethod: undefined,
    notes: undefined,
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
      <ElFormItem label="巡查项目" prop="inspectionProject">
        <ElInput
          v-model="formData.inspectionProject"
          placeholder="请输入巡查项目"
        />
      </ElFormItem>
      <ElFormItem label="巡查地点" prop="patrolLocation">
        <ElInput
          v-model="formData.patrolLocation"
          placeholder="请输入巡查地点"
        />
      </ElFormItem>
      <ElFormItem label="巡查周期" prop="inspectionCycle">
        <ElInput
          v-model="formData.inspectionCycle"
          placeholder="请输入巡查周期"
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
      <ElFormItem label="巡查方式" prop="inspectionMethod">
        <ElInput
          v-model="formData.inspectionMethod"
          placeholder="请输入巡查方式"
        />
      </ElFormItem>
      <ElFormItem label="备注" prop="notes">
        <ElInput v-model="formData.notes" placeholder="请输入备注" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading"
        >确 定</ElButton
      >
    </template>
  </ElDialog>
</template>
