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

import { WarningThresholdApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/warningthreshold';

/** 预警阈值管理 表单 */
defineOptions({ name: 'WarningThresholdForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  indicatorName: undefined,
  thresholdType: undefined,
  thresholdValue: undefined,
  unit: undefined,
  applicableScene: undefined,
  effectiveTime: undefined,
});
const formRules = reactive({
  indicatorName: [{ required: true, message: '指标名称不能为空', trigger: 'blur' }],
  thresholdType: [{ required: true, message: '阈值类型不能为空', trigger: 'blur' }],
  thresholdValue: [{ required: true, message: '阈值数值不能为空', trigger: 'blur' }],
  unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增预警阈值管理' : '编辑预警阈值管理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WarningThresholdApi.getWarningThreshold(id);
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
      await WarningThresholdApi.createWarningThreshold(data);
      ElMessage.success('新增成功');
    } else {
      await WarningThresholdApi.updateWarningThreshold(data);
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
    indicatorName: undefined,
    thresholdType: undefined,
    thresholdValue: undefined,
    unit: undefined,
    applicableScene: undefined,
    effectiveTime: undefined,
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
      <ElFormItem label="指标名称" prop="indicatorName">
        <ElInput v-model="formData.indicatorName" placeholder="请输入指标名称" />
      </ElFormItem>
      <ElFormItem label="阈值类型" prop="thresholdType">
        <ElInput v-model="formData.thresholdType" placeholder="请输入阈值类型(上限/下限)" />
      </ElFormItem>
      <ElFormItem label="阈值数值" prop="thresholdValue">
        <ElInput v-model="formData.thresholdValue" placeholder="请输入阈值数值" />
      </ElFormItem>
      <ElFormItem label="单位" prop="unit">
        <ElInput v-model="formData.unit" placeholder="请输入单位" />
      </ElFormItem>
      <ElFormItem label="适用场景" prop="applicableScene">
        <ElInput v-model="formData.applicableScene" placeholder="请输入适用场景(如管网末梢)" />
      </ElFormItem>
      <ElFormItem label="生效时间" prop="effectiveTime">
        <ElDatePicker
          v-model="formData.effectiveTime"
          type="date"
          value-format="x"
          placeholder="选择生效时间"
          style="width: 100%"
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
