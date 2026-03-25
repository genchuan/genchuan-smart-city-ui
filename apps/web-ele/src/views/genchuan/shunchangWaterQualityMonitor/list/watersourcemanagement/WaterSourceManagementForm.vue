<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
} from 'element-plus';
import { WaterSourceManagementApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersourcemanagement';

/** 水源类型及属性管理 表单 */
defineOptions({ name: 'WaterSourceManagementForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  sourceCode: undefined,
  sourceName: undefined,
  sourceType: undefined,
  longitude: undefined,
  latitude: undefined,
  administrativeRegion: undefined,
  sourceDescription: undefined,
});
const formRules = reactive({
  sourceCode: [
    { required: true, message: '水源编码不能为空', trigger: 'blur' },
  ],
  sourceName: [
    { required: true, message: '水源名称不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增水源类型及属性' : '编辑水源类型及属性';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await WaterSourceManagementApi.getWaterSourceManagement(id);
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
      await WaterSourceManagementApi.createWaterSourceManagement(data);
      ElMessage.success('新增成功');
    } else {
      await WaterSourceManagementApi.updateWaterSourceManagement(data);
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
    sourceCode: undefined,
    sourceName: undefined,
    sourceType: undefined,
    longitude: undefined,
    latitude: undefined,
    administrativeRegion: undefined,
    sourceDescription: undefined,
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
      <ElFormItem label="水源编码" prop="sourceCode">
        <ElInput v-model="formData.sourceCode" placeholder="请输入水源编码" />
      </ElFormItem>
      <ElFormItem label="水源名称" prop="sourceName">
        <ElInput v-model="formData.sourceName" placeholder="请输入水源名称" />
      </ElFormItem>
      <ElFormItem label="水源类型" prop="sourceType">
        <ElInput v-model="formData.sourceType" placeholder="请输入水源类型" />
      </ElFormItem>
      <ElFormItem label="经度" prop="longitude">
        <ElInput v-model="formData.longitude" placeholder="请输入经度" />
      </ElFormItem>
      <ElFormItem label="纬度" prop="latitude">
        <ElInput v-model="formData.latitude" placeholder="请输入纬度" />
      </ElFormItem>
      <ElFormItem label="所属行政区" prop="administrativeRegion">
        <ElInput
          v-model="formData.administrativeRegion"
          placeholder="请输入所属行政区"
        />
      </ElFormItem>
      <ElFormItem label="水源描述" prop="sourceDescription">
        <ElInput
          v-model="formData.sourceDescription"
          type="textarea"
          placeholder="请输入水源描述"
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
