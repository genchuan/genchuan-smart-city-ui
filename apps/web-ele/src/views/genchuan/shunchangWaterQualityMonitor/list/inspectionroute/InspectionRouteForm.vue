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

import { InspectionRouteApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/inspectionroute';

/** 巡检路线规划与优化 表单 */
defineOptions({ name: 'InspectionRouteForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  routeId: undefined,
  inspectionPointId: undefined,
  pointType: undefined,
  longitude: undefined,
  latitude: undefined,
  estimatedArrivalTime: undefined,
  actualArrivalTime: undefined,
  routeAdjustReason: undefined,
});
const formRules = reactive({
  routeId: [{ required: true, message: '路线ID不能为空', trigger: 'blur' }],
  inspectionPointId: [
    { required: true, message: '巡检点ID不能为空', trigger: 'blur' },
  ],
  pointType: [
    {
      required: true,
      message: '巡检点类型(水源地/水厂/管网节点)不能为空',
      trigger: 'blur',
    },
  ],
  longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
  latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增巡检路线规划与优化' : '编辑巡检路线规划与优化';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await InspectionRouteApi.getInspectionRoute(id);
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
      await InspectionRouteApi.createInspectionRoute(data);
      ElMessage.success('新增成功');
    } else {
      await InspectionRouteApi.updateInspectionRoute(data);
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
    routeId: undefined,
    inspectionPointId: undefined,
    pointType: undefined,
    longitude: undefined,
    latitude: undefined,
    estimatedArrivalTime: undefined,
    actualArrivalTime: undefined,
    routeAdjustReason: undefined,
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
      <ElFormItem label="路线ID" prop="routeId">
        <ElInput v-model="formData.routeId" placeholder="请输入路线ID" />
      </ElFormItem>
      <ElFormItem label="巡检点ID" prop="inspectionPointId">
        <ElInput
          v-model="formData.inspectionPointId"
          placeholder="请输入巡检点ID"
        />
      </ElFormItem>
      <ElFormItem label="巡检点类型" prop="pointType">
        <ElInput
          v-model="formData.pointType"
          placeholder="请输入巡检点类型(水源地/水厂/管网节点)"
        />
      </ElFormItem>
      <ElFormItem label="经度" prop="longitude">
        <ElInput v-model="formData.longitude" placeholder="请输入经度" />
      </ElFormItem>
      <ElFormItem label="纬度" prop="latitude">
        <ElInput v-model="formData.latitude" placeholder="请输入纬度" />
      </ElFormItem>
      <ElFormItem label="预计到达时间" prop="estimatedArrivalTime">
        <ElDatePicker
          v-model="formData.estimatedArrivalTime"
          type="date"
          value-format="x"
          placeholder="选择预计到达时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="实际到达时间" prop="actualArrivalTime">
        <ElDatePicker
          v-model="formData.actualArrivalTime"
          type="date"
          value-format="x"
          placeholder="选择实际到达时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="路线调整原因" prop="routeAdjustReason">
        <ElInput
          v-model="formData.routeAdjustReason"
          placeholder="请输入路线调整原因"
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
