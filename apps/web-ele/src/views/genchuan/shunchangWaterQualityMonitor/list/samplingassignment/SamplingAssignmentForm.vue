<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';

import { SamplingAssignmentApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/samplingassignment';

/** 采样人员分配 表单 */
defineOptions({ name: 'SamplingAssignmentForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  planCode: undefined,
  pointList: undefined,
  responsiblePerson: undefined,
  assignTime: undefined,
  deadline: undefined,
  contactInfo: undefined,
});
const formRules = reactive({
  planCode: [{ required: true, message: '采样计划编号不能为空', trigger: 'blur' }],
  pointList: [{ required: true, message: '采样点清单不能为空', trigger: 'blur' }],
  responsiblePerson: [{ required: true, message: '负责人员不能为空', trigger: 'blur' }],
  deadline: [{ required: true, message: '完成时限不能为空', trigger: 'blur' }],
  contactInfo: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增采样人员分配' : '编辑采样人员分配';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await SamplingAssignmentApi.getSamplingAssignment(id);
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
      await SamplingAssignmentApi.createSamplingAssignment(data);
      ElMessage.success('新增成功');
    } else {
      await SamplingAssignmentApi.updateSamplingAssignment(data);
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
    planCode: undefined,
    pointList: undefined,
    responsiblePerson: undefined,
    assignTime: undefined,
    deadline: undefined,
    contactInfo: undefined,
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
      label-width="110px"
      v-loading="formLoading"
    >
      <ElFormItem label="采样计划编号" prop="planCode">
        <ElInput v-model="formData.planCode" placeholder="请输入采样计划编号" />
      </ElFormItem>
      <ElFormItem label="采样点清单" prop="pointList">
        <ElInput v-model="formData.pointList" placeholder="请输入采样点清单" />
      </ElFormItem>
      <ElFormItem label="负责人员" prop="responsiblePerson">
        <ElInput v-model="formData.responsiblePerson" placeholder="请输入负责人员" />
      </ElFormItem>
      <ElFormItem label="分配时间" prop="assignTime">
        <ElDatePicker
          v-model="formData.assignTime"
          type="date"
          value-format="x"
          placeholder="选择分配时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="完成时限" prop="deadline">
        <ElDatePicker
          v-model="formData.deadline"
          type="date"
          value-format="x"
          placeholder="选择完成时限"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="联系方式" prop="contactInfo">
        <ElInput v-model="formData.contactInfo" placeholder="请输入联系方式" />
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
