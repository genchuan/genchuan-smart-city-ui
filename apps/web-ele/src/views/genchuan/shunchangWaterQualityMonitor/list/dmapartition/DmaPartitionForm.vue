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
} from 'element-plus';

import { DmaPartitionApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/dmapartition';

/** DMA分区划分与调整 表单 */
defineOptions({ name: 'DmaPartitionForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  partitionId: undefined,
  partitionName: undefined,
  coveredVillages: undefined,
  boundaryCoordinates: undefined,
  monitorPointIds: undefined,
  divisionDate: undefined,
  adjustmentRecords: undefined,
});
const formRules = reactive({
  partitionId: [{ required: true, message: '分区ID不能为空', trigger: 'blur' }],
  partitionName: [
    { required: true, message: '分区名称不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增DMA分区划分与调整' : '编辑DMA分区划分与调整';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await DmaPartitionApi.getDmaPartition(id);
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
      await DmaPartitionApi.createDmaPartition(data);
      ElMessage.success('新增成功');
    } else {
      await DmaPartitionApi.updateDmaPartition(data);
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
    partitionId: undefined,
    partitionName: undefined,
    coveredVillages: undefined,
    boundaryCoordinates: undefined,
    monitorPointIds: undefined,
    divisionDate: undefined,
    adjustmentRecords: undefined,
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
      <ElFormItem label="分区ID" prop="partitionId">
        <ElInput v-model="formData.partitionId" placeholder="请输入分区ID" />
      </ElFormItem>
      <ElFormItem label="分区名称" prop="partitionName">
        <ElInput
          v-model="formData.partitionName"
          placeholder="请输入分区名称"
        />
      </ElFormItem>
      <ElFormItem label="覆盖行政村" prop="coveredVillages">
        <ElInput
          v-model="formData.coveredVillages"
          placeholder="请输入覆盖行政村"
        />
      </ElFormItem>
      <ElFormItem label="边界坐标" prop="boundaryCoordinates">
        <ElInput
          v-model="formData.boundaryCoordinates"
          placeholder="请输入边界坐标"
        />
      </ElFormItem>
      <ElFormItem label="包含监测点ID" prop="monitorPointIds">
        <ElInput
          v-model="formData.monitorPointIds"
          placeholder="请输入包含监测点ID"
        />
      </ElFormItem>
      <ElFormItem label="划分日期" prop="divisionDate">
        <ElDatePicker
          v-model="formData.divisionDate"
          type="date"
          value-format="x"
          placeholder="选择划分日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="调整记录" prop="adjustmentRecords">
        <ElInput
          v-model="formData.adjustmentRecords"
          placeholder="请输入调整记录"
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
