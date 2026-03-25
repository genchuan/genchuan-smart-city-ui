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
import { PollutionSourceArchiveApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/pollutionsourcearchive';

/** 周边污染源档案管理 表单 */
defineOptions({ name: 'PollutionSourceArchiveForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  pollutionNo: undefined,
  pollutionType: undefined,
  longitude: undefined,
  latitude: undefined,
  pollutionLevel: undefined,
  treatmentMeasures: undefined,
  treatmentStatus: undefined,
  inspectionTime: undefined,
});
const formRules = reactive({
  pollutionNo: [{ required: true, message: '污染源编号不能为空', trigger: 'blur' }],
  pollutionType: [{ required: true, message: '污染源类型不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增周边污染源档案' : '编辑周边污染源档案';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await PollutionSourceArchiveApi.getPollutionSourceArchive(id);
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
      await PollutionSourceArchiveApi.createPollutionSourceArchive(data);
      ElMessage.success('新增成功');
    } else {
      await PollutionSourceArchiveApi.updatePollutionSourceArchive(data);
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
    pollutionNo: undefined,
    pollutionType: undefined,
    longitude: undefined,
    latitude: undefined,
    pollutionLevel: undefined,
    treatmentMeasures: undefined,
    treatmentStatus: undefined,
    inspectionTime: undefined,
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
      <ElFormItem label="污染源编号" prop="pollutionNo">
        <ElInput v-model="formData.pollutionNo" placeholder="请输入污染源编号" />
      </ElFormItem>
      <ElFormItem label="污染源类型" prop="pollutionType">
        <ElInput v-model="formData.pollutionType" placeholder="请输入污染源类型" />
      </ElFormItem>
      <ElFormItem label="经度" prop="longitude">
        <ElInput v-model="formData.longitude" placeholder="请输入经度" />
      </ElFormItem>
      <ElFormItem label="纬度" prop="latitude">
        <ElInput v-model="formData.latitude" placeholder="请输入纬度" />
      </ElFormItem>
      <ElFormItem label="污染程度" prop="pollutionLevel">
        <ElInput v-model="formData.pollutionLevel" placeholder="请输入污染程度" />
      </ElFormItem>
      <ElFormItem label="治理措施" prop="treatmentMeasures">
        <ElInput v-model="formData.treatmentMeasures" placeholder="请输入治理措施" />
      </ElFormItem>
      <ElFormItem label="治理状态" prop="treatmentStatus">
        <ElInput v-model="formData.treatmentStatus" placeholder="请输入治理状态" />
      </ElFormItem>
      <ElFormItem label="排查时间" prop="inspectionTime">
        <ElDatePicker
          v-model="formData.inspectionTime"
          type="date"
          value-format="x"
          placeholder="选择排查时间"
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
