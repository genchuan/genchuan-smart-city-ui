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

import { EquipmentMaintenanceApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/equipmentmaintenance';

/** 设备保养计划管理 表单 */
defineOptions({ name: 'EquipmentMaintenanceForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  equipmentId: undefined,
  equipmentType: undefined,
  maintenanceCycle: undefined,
  planMaintenanceDate: undefined,
  actualMaintenanceDate: undefined,
  maintenanceContent: undefined,
  replacedParts: undefined,
  postMaintenanceParams: undefined,
  maintenanceStaffId: undefined,
});
const formRules = reactive({
  equipmentId: [{ required: true, message: '设备ID不能为空', trigger: 'blur' }],
  equipmentType: [{ required: true, message: '设备类型不能为空', trigger: 'blur' }],
  maintenanceCycle: [{ required: true, message: '保养周期(天)不能为空', trigger: 'blur' }],
  planMaintenanceDate: [{ required: true, message: '计划保养日期不能为空', trigger: 'blur' }],
  maintenanceContent: [{ required: true, message: '保养内容不能为空', trigger: 'blur' }],
  maintenanceStaffId: [{ required: true, message: '维护人员ID不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增设备保养计划' : '编辑设备保养计划';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await EquipmentMaintenanceApi.getEquipmentMaintenance(id);
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
      await EquipmentMaintenanceApi.createEquipmentMaintenance(data);
      ElMessage.success('新增成功');
    } else {
      await EquipmentMaintenanceApi.updateEquipmentMaintenance(data);
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
    equipmentId: undefined,
    equipmentType: undefined,
    maintenanceCycle: undefined,
    planMaintenanceDate: undefined,
    actualMaintenanceDate: undefined,
    maintenanceContent: undefined,
    replacedParts: undefined,
    postMaintenanceParams: undefined,
    maintenanceStaffId: undefined,
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
      <ElFormItem label="设备ID" prop="equipmentId">
        <ElInput v-model="formData.equipmentId" placeholder="请输入设备ID" />
      </ElFormItem>
      <ElFormItem label="设备类型" prop="equipmentType">
        <ElInput v-model="formData.equipmentType" placeholder="请输入设备类型" />
      </ElFormItem>
      <ElFormItem label="保养周期(天)" prop="maintenanceCycle">
        <ElInput v-model="formData.maintenanceCycle" placeholder="请输入保养周期(天)" />
      </ElFormItem>
      <ElFormItem label="计划保养日期" prop="planMaintenanceDate">
        <ElDatePicker
          v-model="formData.planMaintenanceDate"
          type="date"
          value-format="x"
          placeholder="选择计划保养日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="实际保养日期" prop="actualMaintenanceDate">
        <ElDatePicker
          v-model="formData.actualMaintenanceDate"
          type="date"
          value-format="x"
          placeholder="选择实际保养日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="保养内容" prop="maintenanceContent">
        <ElInput v-model="formData.maintenanceContent" type="textarea" placeholder="请输入保养内容" />
      </ElFormItem>
      <ElFormItem label="更换部件名称" prop="replacedParts">
        <ElInput v-model="formData.replacedParts" placeholder="请输入更换部件名称" />
      </ElFormItem>
      <ElFormItem label="保养后运行参数" prop="postMaintenanceParams">
        <ElInput v-model="formData.postMaintenanceParams" placeholder="请输入保养后运行参数" />
      </ElFormItem>
      <ElFormItem label="维护人员ID" prop="maintenanceStaffId">
        <ElInput v-model="formData.maintenanceStaffId" placeholder="请输入维护人员ID" />
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
