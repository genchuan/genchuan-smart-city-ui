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
import { WaterProtectionAreaApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/waterprotectionarea';

/** 水源保护区管理 表单 */
defineOptions({ name: 'WaterProtectionAreaForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  protectionLevel: undefined,
  boundaryRange: undefined,
  signboardNo: undefined,
  signboardLocation: undefined,
  installTime: undefined,
  maintenanceRecord: undefined,
  pollutionStatus: undefined,
});
const formRules = reactive({
  protectionLevel: [
    { required: true, message: '保护区级别不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增水源保护区' : '编辑水源保护区';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WaterProtectionAreaApi.getWaterProtectionArea(id);
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
      await WaterProtectionAreaApi.createWaterProtectionArea(data);
      ElMessage.success('新增成功');
    } else {
      await WaterProtectionAreaApi.updateWaterProtectionArea(data);
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
    protectionLevel: undefined,
    boundaryRange: undefined,
    signboardNo: undefined,
    signboardLocation: undefined,
    installTime: undefined,
    maintenanceRecord: undefined,
    pollutionStatus: undefined,
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
      <ElFormItem label="保护区级别" prop="protectionLevel">
        <ElInput
          v-model="formData.protectionLevel"
          placeholder="请输入保护区级别"
        />
      </ElFormItem>
      <ElFormItem label="边界经纬度范围" prop="boundaryRange">
        <ElInput
          v-model="formData.boundaryRange"
          placeholder="请输入边界经纬度范围"
        />
      </ElFormItem>
      <ElFormItem label="标识牌编号" prop="signboardNo">
        <ElInput
          v-model="formData.signboardNo"
          placeholder="请输入标识牌编号"
        />
      </ElFormItem>
      <ElFormItem label="标识牌位置" prop="signboardLocation">
        <ElInput
          v-model="formData.signboardLocation"
          placeholder="请输入标识牌位置"
        />
      </ElFormItem>
      <ElFormItem label="安装时间" prop="installTime">
        <ElDatePicker
          v-model="formData.installTime"
          type="date"
          value-format="x"
          placeholder="选择安装时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="维护记录" prop="maintenanceRecord">
        <ElInput
          v-model="formData.maintenanceRecord"
          placeholder="请输入维护记录"
        />
      </ElFormItem>
      <ElFormItem label="污染源治理状态" prop="pollutionStatus">
        <ElInput
          v-model="formData.pollutionStatus"
          placeholder="请输入污染源治理状态"
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
