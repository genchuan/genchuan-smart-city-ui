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

import { InspectionTaskApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/inspectiontask';

/** 巡检任务派发与执行 表单 */
defineOptions({ name: 'InspectionTaskForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskId: undefined,
  inspectorId: undefined,
  taskContent: undefined,
  dispatchTime: undefined,
  receiveTime: undefined,
  checkinTime: undefined,
  inspectionResult: undefined,
  photoUrl: undefined,
  locationInfo: undefined,
});
const formRules = reactive({
  taskId: [{ required: true, message: '任务ID不能为空', trigger: 'blur' }],
  inspectorId: [{ required: true, message: '巡检人员ID不能为空', trigger: 'blur' }],
  taskContent: [{ required: true, message: '任务内容不能为空', trigger: 'blur' }],
  dispatchTime: [{ required: true, message: '派发时间不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡检任务派发与执行' : '编辑巡检任务派发与执行';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await InspectionTaskApi.getInspectionTask(id);
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
      await InspectionTaskApi.createInspectionTask(data);
      ElMessage.success('新增成功');
    } else {
      await InspectionTaskApi.updateInspectionTask(data);
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
    taskId: undefined,
    inspectorId: undefined,
    taskContent: undefined,
    dispatchTime: undefined,
    receiveTime: undefined,
    checkinTime: undefined,
    inspectionResult: undefined,
    photoUrl: undefined,
    locationInfo: undefined,
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
      <ElFormItem label="任务ID" prop="taskId">
        <ElInput v-model="formData.taskId" placeholder="请输入任务ID" />
      </ElFormItem>
      <ElFormItem label="巡检人员ID" prop="inspectorId">
        <ElInput v-model="formData.inspectorId" placeholder="请输入巡检人员ID" />
      </ElFormItem>
      <ElFormItem label="任务内容" prop="taskContent">
        <ElInput v-model="formData.taskContent" type="textarea" placeholder="请输入任务内容" />
      </ElFormItem>
      <ElFormItem label="派发时间" prop="dispatchTime">
        <ElDatePicker
          v-model="formData.dispatchTime"
          type="date"
          value-format="x"
          placeholder="选择派发时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="接收时间" prop="receiveTime">
        <ElDatePicker
          v-model="formData.receiveTime"
          type="date"
          value-format="x"
          placeholder="选择接收时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="签到时间" prop="checkinTime">
        <ElDatePicker
          v-model="formData.checkinTime"
          type="date"
          value-format="x"
          placeholder="选择签到时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="检查项结果" prop="inspectionResult">
        <ElInput v-model="formData.inspectionResult" placeholder="请输入检查项结果(正常/异常)" />
      </ElFormItem>
      <ElFormItem label="现场照片URL" prop="photoUrl">
        <ElInput v-model="formData.photoUrl" placeholder="请输入现场照片URL" />
      </ElFormItem>
      <ElFormItem label="定位信息" prop="locationInfo">
        <ElInput v-model="formData.locationInfo" placeholder="请输入定位信息" />
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
