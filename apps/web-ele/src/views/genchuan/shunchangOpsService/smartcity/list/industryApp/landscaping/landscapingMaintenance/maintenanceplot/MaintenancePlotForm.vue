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
  ElOption,
  ElSelect,
} from 'element-plus';

import { MaintenancePlotApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingMaintenance/maintenanceplot';

/** 养护地块 表单 */
defineOptions({ name: 'MaintenancePlotForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  plotName: undefined,
  plotDescription: undefined,
  ownership: undefined,
  acreage: undefined,
  latitude: undefined,
  longitude: undefined,
  greeningType: undefined,
  lastMaintenanceDate: undefined,
  nextMaintenanceDate: undefined,
});
const formRules = reactive({
  plotName: [{ required: true, message: '请输入地块名称', trigger: 'blur' }],
  greeningType: [
    { required: true, message: '请选择绿化类型', trigger: 'change' },
  ],
});
const formRef = ref(); // 表单 Ref

// 字典选项 - 使用计算属性实时获取
// const greeningTypeOptions = computed(() => getDictOptions(DICT_TYPE.SM_GREENING_TYPE, 'string'));

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增养护地块' : '编辑养护地块';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await MaintenancePlotApi.getMaintenancePlot(id);
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
      await MaintenancePlotApi.createMaintenancePlot(data);
      ElMessage.success('新增成功');
    } else {
      await MaintenancePlotApi.updateMaintenancePlot(data);
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
    plotName: undefined,
    plotDescription: undefined,
    ownership: undefined,
    acreage: undefined,
    latitude: undefined,
    longitude: undefined,
    greeningType: undefined,
    lastMaintenanceDate: undefined,
    nextMaintenanceDate: undefined,
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
      label-width="150px"
      v-loading="formLoading"
    >
      <ElFormItem label="地块名称" prop="plotName">
        <ElInput v-model="formData.plotName" placeholder="请输入地块名称" />
      </ElFormItem>
      <ElFormItem label="地块描述" prop="plotDescription">
        <ElInput
          v-model="formData.plotDescription"
          type="textarea"
          placeholder="请输入地块描述"
        />
      </ElFormItem>
      <ElFormItem label="归属信息" prop="ownership">
        <ElInput v-model="formData.ownership" placeholder="请输入归属信息" />
      </ElFormItem>
      <ElFormItem label="地块面积" prop="acreage">
        <ElInput v-model="formData.acreage" placeholder="请输入地块面积" />
      </ElFormItem>
      <ElFormItem label="绿化类型" prop="greeningType">
        <ElSelect
          v-model="formData.greeningType"
          placeholder="请选择绿化类型"
          style="width: 100%"
        >
          <!--          <ElOption-->
          <!--            v-for="dict in greeningTypeOptions"-->
          <!--            :key="dict.value"-->
          <!--            :label="dict.label"-->
          <!--            :value="dict.value"-->
          <!--          />-->
          <ElOption label="纯乔木绿化" value="pureArbor" />
          <ElOption label="纯灌木绿化" value="pureShrub" />
          <ElOption label="纯地被/草坪绿化" value="pureGroundcover" />
          <ElOption label="乔灌混合绿化" value="arborShrubMixed" />
          <ElOption label="乔灌草混合绿化" value="arborShrubGrassMixed" />
          <ElOption label="水生绿化" value="aquatic" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="上次养护日期" prop="lastMaintenanceDate">
        <ElDatePicker
          v-model="formData.lastMaintenanceDate"
          type="date"
          value-format="x"
          placeholder="选择上次养护日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="下次养护计划日期" prop="nextMaintenanceDate">
        <ElDatePicker
          v-model="formData.nextMaintenanceDate"
          type="date"
          value-format="x"
          placeholder="选择下次养护计划日期"
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
