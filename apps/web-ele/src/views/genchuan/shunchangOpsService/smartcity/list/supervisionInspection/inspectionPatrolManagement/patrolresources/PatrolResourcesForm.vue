<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption
} from 'element-plus';
import {
  PatrolResourcesApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/supervisionInspection/inspectionPatrolManagement/patrolresources';

/** 巡查资源 表单 */
defineOptions({ name: 'PatrolResourcesForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  resourceName: undefined,
  resourceNumber: undefined,
  resourceType: undefined,
  geographicLocation: undefined,
  regionalDivision: undefined,
  specificationAndModel: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡查资源' : '编辑巡查资源';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await PatrolResourcesApi.getPatrolResources(id);
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
      await PatrolResourcesApi.createPatrolResources(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await PatrolResourcesApi.updatePatrolResources(
        data,
      );
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
    resourceName: undefined,
    resourceNumber: undefined,
    resourceType: undefined,
    geographicLocation: undefined,
    regionalDivision: undefined,
    specificationAndModel: undefined,
  };
  formRef.value?.resetFields();
};
</script>
<template>
  <ElDialog :title="dialogTitle" v-model="dialogVisible" width="600px" append-to-body>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="资源名称" prop="resourceName">
        <ElInput v-model="formData.resourceName" placeholder="请输入资源名称" />
      </ElFormItem>
      <ElFormItem label="资源编号" prop="resourceNumber">
        <ElInput v-model="formData.resourceNumber" placeholder="请输入资源编号" />
      </ElFormItem>
      <ElFormItem label="资源类型" prop="resourceType">
        <ElSelect v-model="formData.resourceType" placeholder="请选择资源类型">
          <ElOption label="建筑设施" value="building_facility" />
          <ElOption label="市政设施" value="municipal_facility" />
          <ElOption label="安防设施" value="security_facility" />
          <ElOption label="消防设施" value="fire_facility" />
          <ElOption label="电气设备" value="electrical_equipment" />
          <ElOption label="特种设备" value="special_equipment" />
          <ElOption label="生产设备" value="production_equipment" />
          <ElOption label="环保设备" value="environmental_equipment" />
          <ElOption label="电力线路" value="power_line" />
          <ElOption label="给排水管线" value="water_pipeline" />
          <ElOption label="燃气管线" value="gas_pipeline" />
          <ElOption label="通信线路" value="communication_line" />
          <ElOption label="巡查区域" value="patrol_area" />
          <ElOption label="重点区域" value="key_area" />
          <ElOption label="应急物资" value="emergency_materials" />
          <ElOption label="工具器材" value="tools_equipment" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="地理位置" prop="geographicLocation">
        <ElInput v-model="formData.geographicLocation" placeholder="请输入地理位置" />
      </ElFormItem>
      <ElFormItem label="区域划分" prop="regionalDivision">
        <ElInput v-model="formData.regionalDivision" placeholder="请输入区域划分" />
      </ElFormItem>
      <ElFormItem label="规格型号" prop="specificationAndModel">
        <ElInput v-model="formData.specificationAndModel" placeholder="请输入规格型号" />
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
