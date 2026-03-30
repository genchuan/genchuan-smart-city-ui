<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';

import { TestingCapabilityApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/testingcapability';

/** 检测能力及设备管理 表单 */
defineOptions({ name: 'TestingCapabilityForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  agencyCode: undefined,
  testableIndicators: undefined,
  equipmentModel: undefined,
  equipmentNo: undefined,
  calibrationRecord: undefined,
  equipmentStatus: undefined,
});
const formRules = reactive({
  agencyCode: [
    { required: true, message: '机构编号不能为空', trigger: 'blur' },
  ],
  equipmentNo: [
    { required: true, message: '设备编号不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增检测能力及设备' : '编辑检测能力及设备';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await TestingCapabilityApi.getTestingCapability(id);
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
      await TestingCapabilityApi.createTestingCapability(data);
      ElMessage.success('新增成功');
    } else {
      await TestingCapabilityApi.updateTestingCapability(data);
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
    agencyCode: undefined,
    testableIndicators: undefined,
    equipmentModel: undefined,
    equipmentNo: undefined,
    calibrationRecord: undefined,
    equipmentStatus: undefined,
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
      <ElFormItem label="机构编号" prop="agencyCode">
        <ElInput v-model="formData.agencyCode" placeholder="请输入机构编号" />
      </ElFormItem>
      <ElFormItem label="可检测指标" prop="testableIndicators">
        <ElInput
          v-model="formData.testableIndicators"
          placeholder="请输入可检测指标"
        />
      </ElFormItem>
      <ElFormItem label="设备型号" prop="equipmentModel">
        <ElInput
          v-model="formData.equipmentModel"
          placeholder="请输入设备型号"
        />
      </ElFormItem>
      <ElFormItem label="设备编号" prop="equipmentNo">
        <ElInput v-model="formData.equipmentNo" placeholder="请输入设备编号" />
      </ElFormItem>
      <ElFormItem label="校准记录" prop="calibrationRecord">
        <ElInput
          v-model="formData.calibrationRecord"
          placeholder="请输入校准记录"
        />
      </ElFormItem>
      <ElFormItem label="设备状态" prop="equipmentStatus">
        <ElInput
          v-model="formData.equipmentStatus"
          placeholder="请输入设备状态(正常/维修中/停用)"
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
