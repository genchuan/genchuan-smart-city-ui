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

import { WaterBalanceApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/waterbalance';

/** 水量平衡与漏损分析 表单 */
defineOptions({ name: 'WaterBalanceForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  partitionId: undefined,
  statisticsPeriod: undefined,
  statisticsDate: undefined,
  supplyVolume: undefined,
  salesVolume: undefined,
  reasonableLoss: undefined,
  leakageVolume: undefined,
  leakageRate: undefined,
  isExceeded: undefined,
});
const formRules = reactive({
  partitionId: [{ required: true, message: '分区ID不能为空', trigger: 'blur' }],
  statisticsPeriod: [{ required: true, message: '统计周期不能为空', trigger: 'blur' }],
  statisticsDate: [{ required: true, message: '统计日期不能为空', trigger: 'blur' }],
  supplyVolume: [{ required: true, message: '供水量不能为空', trigger: 'blur' }],
  salesVolume: [{ required: true, message: '售水量不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增水量平衡与漏损分析' : '编辑水量平衡与漏损分析';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WaterBalanceApi.getWaterBalance(id);
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
      await WaterBalanceApi.createWaterBalance(data);
      ElMessage.success('新增成功');
    } else {
      await WaterBalanceApi.updateWaterBalance(data);
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
    statisticsPeriod: undefined,
    statisticsDate: undefined,
    supplyVolume: undefined,
    salesVolume: undefined,
    reasonableLoss: undefined,
    leakageVolume: undefined,
    leakageRate: undefined,
    isExceeded: undefined,
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
      <ElFormItem label="统计周期" prop="statisticsPeriod">
        <ElInput v-model="formData.statisticsPeriod" placeholder="请输入统计周期(日/月/年)" />
      </ElFormItem>
      <ElFormItem label="统计日期" prop="statisticsDate">
        <ElDatePicker
          v-model="formData.statisticsDate"
          type="date"
          value-format="x"
          placeholder="选择统计日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="供水量" prop="supplyVolume">
        <ElInput v-model="formData.supplyVolume" placeholder="请输入供水量(立方米)" />
      </ElFormItem>
      <ElFormItem label="售水量" prop="salesVolume">
        <ElInput v-model="formData.salesVolume" placeholder="请输入售水量(立方米)" />
      </ElFormItem>
      <ElFormItem label="合理损耗量" prop="reasonableLoss">
        <ElInput v-model="formData.reasonableLoss" placeholder="请输入合理损耗量(立方米)" />
      </ElFormItem>
      <ElFormItem label="漏损量" prop="leakageVolume">
        <ElInput v-model="formData.leakageVolume" placeholder="请输入漏损量(立方米)" />
      </ElFormItem>
      <ElFormItem label="漏损率(%)" prop="leakageRate">
        <ElInput v-model="formData.leakageRate" placeholder="请输入漏损率(%)" />
      </ElFormItem>
      <ElFormItem label="是否超标" prop="isExceeded">
        <ElInput v-model="formData.isExceeded" placeholder="请输入是否超标(0否1是)" />
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
