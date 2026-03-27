<script setup lang="ts">
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';
import { reactive, ref } from 'vue';

import { SamplingPointApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/samplingpoint';

/** 采样点规划 表单 */
defineOptions({ name: 'SamplingPointForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  pointCode: undefined,
  longitude: undefined,
  latitude: undefined,
  pointType: undefined,
  coveredPopulation: undefined,
  surroundingDesc: undefined,
  planningBasis: undefined,
});
const formRules = reactive({
  pointCode: [{ required: true, message: '采样点编号不能为空', trigger: 'blur' }],
  longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
  latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
  pointType: [{ required: true, message: '类型(水源/水厂/管网/末梢)不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增采样点规划' : '编辑采样点规划';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await SamplingPointApi.getSamplingPoint(id);
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
      await SamplingPointApi.createSamplingPoint(data);
      ElMessage.success('新增成功');
    } else {
      await SamplingPointApi.updateSamplingPoint(data);
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
    pointCode: undefined,
    longitude: undefined,
    latitude: undefined,
    pointType: undefined,
    coveredPopulation: undefined,
    surroundingDesc: undefined,
    planningBasis: undefined,
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
      <ElFormItem label="采样点编号" prop="pointCode">
        <ElInput v-model="formData.pointCode" placeholder="请输入采样点编号" />
      </ElFormItem>
      <ElFormItem label="经度" prop="longitude">
        <ElInput v-model="formData.longitude" placeholder="请输入经度" />
      </ElFormItem>
      <ElFormItem label="纬度" prop="latitude">
        <ElInput v-model="formData.latitude" placeholder="请输入纬度" />
      </ElFormItem>
      <ElFormItem label="类型" prop="pointType">
        <ElInput v-model="formData.pointType" placeholder="请输入类型(水源/水厂/管网/末梢)" />
      </ElFormItem>
      <ElFormItem label="覆盖人口" prop="coveredPopulation">
        <ElInput v-model="formData.coveredPopulation" placeholder="请输入覆盖人口" />
      </ElFormItem>
      <ElFormItem label="周边环境描述" prop="surroundingDesc">
        <ElInput v-model="formData.surroundingDesc" placeholder="请输入周边环境描述" />
      </ElFormItem>
      <ElFormItem label="规划依据" prop="planningBasis">
        <ElInput v-model="formData.planningBasis" placeholder="请输入规划依据" />
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
