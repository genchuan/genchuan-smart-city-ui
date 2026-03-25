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
import { WaterHydrologyParamApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/waterhydrologyparam';

/** 水源水文参数管理 表单 */
defineOptions({ name: 'WaterHydrologyParamForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  monitorTime: undefined,
  waterLevel: undefined,
  aquiferThickness: undefined,
  permeabilityCoefficient: undefined,
  dataCollector: undefined,
});
const formRules = reactive({
  monitorTime: [{ required: true, message: '监测时间不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增水源水文参数' : '编辑水源水文参数';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WaterHydrologyParamApi.getWaterHydrologyParam(id);
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
      await WaterHydrologyParamApi.createWaterHydrologyParam(data);
      ElMessage.success('新增成功');
    } else {
      await WaterHydrologyParamApi.updateWaterHydrologyParam(data);
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
    monitorTime: undefined,
    waterLevel: undefined,
    aquiferThickness: undefined,
    permeabilityCoefficient: undefined,
    dataCollector: undefined,
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
      <ElFormItem label="监测时间" prop="monitorTime">
        <ElDatePicker
          v-model="formData.monitorTime"
          type="date"
          value-format="x"
          placeholder="选择监测时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="水位值(米)" prop="waterLevel">
        <ElInput v-model="formData.waterLevel" placeholder="请输入水位值(米)" />
      </ElFormItem>
      <ElFormItem label="含水层厚度(米)" prop="aquiferThickness">
        <ElInput v-model="formData.aquiferThickness" placeholder="请输入含水层厚度(米)" />
      </ElFormItem>
      <ElFormItem label="渗透系数(m/d)" prop="permeabilityCoefficient">
        <ElInput v-model="formData.permeabilityCoefficient" placeholder="请输入渗透系数(m/d)" />
      </ElFormItem>
      <ElFormItem label="数据采集人" prop="dataCollector">
        <ElInput v-model="formData.dataCollector" placeholder="请输入数据采集人" />
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
