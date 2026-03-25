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

import { LeakageControlPlanApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/leakagecontrolplan';

/** 漏损控制方案建议 表单 */
defineOptions({ name: 'LeakageControlPlanForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  partitionId: undefined,
  exceededLeakageRate: undefined,
  pressureData: undefined,
  pipeAvgAge: undefined,
  suggestedPlan: undefined,
  planImplementTime: undefined,
  postImplementRate: undefined,
});
const formRules = reactive({
  partitionId: [{ required: true, message: '分区ID不能为空', trigger: 'blur' }],
  exceededLeakageRate: [{ required: true, message: '超标漏损率(%)不能为空', trigger: 'blur' }],
  suggestedPlan: [{ required: true, message: '建议方案不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增漏损控制方案建议' : '编辑漏损控制方案建议';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await LeakageControlPlanApi.getLeakageControlPlan(id);
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
      await LeakageControlPlanApi.createLeakageControlPlan(data);
      ElMessage.success('新增成功');
    } else {
      await LeakageControlPlanApi.updateLeakageControlPlan(data);
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
    partitionId: undefined,
    exceededLeakageRate: undefined,
    pressureData: undefined,
    pipeAvgAge: undefined,
    suggestedPlan: undefined,
    planImplementTime: undefined,
    postImplementRate: undefined,
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
      label-width="140px"
      v-loading="formLoading"
    >
      <ElFormItem label="分区ID" prop="partitionId">
        <ElInput v-model="formData.partitionId" placeholder="请输入分区ID" />
      </ElFormItem>
      <ElFormItem label="超标漏损率(%)" prop="exceededLeakageRate">
        <ElInput v-model="formData.exceededLeakageRate" placeholder="请输入超标漏损率(%)" />
      </ElFormItem>
      <ElFormItem label="压力数据" prop="pressureData">
        <ElInput v-model="formData.pressureData" placeholder="请输入压力数据" />
      </ElFormItem>
      <ElFormItem label="管道平均使用年限(年)" prop="pipeAvgAge">
        <ElInput v-model="formData.pipeAvgAge" placeholder="请输入管道平均使用年限(年)" />
      </ElFormItem>
      <ElFormItem label="建议方案" prop="suggestedPlan">
        <ElInput v-model="formData.suggestedPlan" type="textarea" placeholder="请输入建议方案" />
      </ElFormItem>
      <ElFormItem label="方案实施时间" prop="planImplementTime">
        <ElDatePicker
          v-model="formData.planImplementTime"
          type="date"
          value-format="x"
          placeholder="选择方案实施时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="实施后漏损率(%)" prop="postImplementRate">
        <ElInput v-model="formData.postImplementRate" placeholder="请输入实施后漏损率(%)" />
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
