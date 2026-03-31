<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { getDictOptions } from '@vben/hooks';
import { DICT_TYPE } from '@vben/constants';

import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
  ElSelect,
  ElOption,
} from 'element-plus';

import { ComponentInformationApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/decisionSuggestion/componentEventSupervision/componentinformation';

/** 部件信息 表单 */
defineOptions({ name: 'ComponentInformationForm' });

// 字典选项
const partTypeOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_PART_TYPE, 'string'),
);
const componentStatusOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_STATE, 'string'),
);

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  partNumber: undefined,
  componentName: undefined,
  partType: undefined,
  belongingRegion: undefined,
  installationPosition: undefined,
  latitudeLongitude: undefined,
  constructionDate: undefined,
  administrativeDepartment: undefined,
  maintenanceUnit: undefined,
  contactNumber: undefined,
  componentStatus: undefined,
  specificationAndModel: undefined,
  serviceLife: undefined,
  relatedEventRecords: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增部件信息' : '编辑部件信息';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      const res = await ComponentInformationApi.getComponentInformation(id);
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        constructionDate: res.constructionDate
          ? Number(res.constructionDate)
          : undefined,
      };
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
      await ComponentInformationApi.createComponentInformation(data);
      ElMessage.success('新增成功');
    } else {
      await ComponentInformationApi.updateComponentInformation(data);
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
    partNumber: undefined,
    componentName: undefined,
    partType: undefined,
    belongingRegion: undefined,
    installationPosition: undefined,
    latitudeLongitude: undefined,
    constructionDate: undefined,
    administrativeDepartment: undefined,
    maintenanceUnit: undefined,
    contactNumber: undefined,
    componentStatus: undefined,
    specificationAndModel: undefined,
    serviceLife: undefined,
    relatedEventRecords: undefined,
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
      <ElFormItem label="部件编号" prop="partNumber">
        <ElInput v-model="formData.partNumber" placeholder="请输入部件编号" />
      </ElFormItem>
      <ElFormItem label="部件名称" prop="componentName">
        <ElInput
          v-model="formData.componentName"
          placeholder="请输入部件名称"
        />
      </ElFormItem>
      <ElFormItem label="部件类型" prop="partType">
        <ElSelect v-model="formData.partType" placeholder="请选择部件类型">
          <ElOption
            v-for="dict in partTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="所属区域" prop="belongingRegion">
        <ElInput
          v-model="formData.belongingRegion"
          placeholder="请输入所属区域"
        />
      </ElFormItem>
      <ElFormItem label="安装位置" prop="installationPosition">
        <ElInput
          v-model="formData.installationPosition"
          placeholder="请输入安装位置"
        />
      </ElFormItem>
      <ElFormItem label="经纬度坐标" prop="latitudeLongitude">
        <ElInput
          v-model="formData.latitudeLongitude"
          placeholder="请输入经纬度坐标"
        />
      </ElFormItem>
      <ElFormItem label="建设日期" prop="constructionDate">
        <ElDatePicker
          v-model="formData.constructionDate"
          type="date"
          value-format="x"
          placeholder="选择建设日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="管理部门" prop="administrativeDepartment">
        <ElInput
          v-model="formData.administrativeDepartment"
          placeholder="请输入管理部门"
        />
      </ElFormItem>
      <ElFormItem label="维护单位" prop="maintenanceUnit">
        <ElInput
          v-model="formData.maintenanceUnit"
          placeholder="请输入维护单位"
        />
      </ElFormItem>
      <ElFormItem label="联系电话" prop="contactNumber">
        <ElInput
          v-model="formData.contactNumber"
          placeholder="请输入联系电话"
        />
      </ElFormItem>
      <ElFormItem label="部件状态" prop="componentStatus">
        <ElSelect
          v-model="formData.componentStatus"
          placeholder="请选择部件状态"
        >
          <ElOption
            v-for="dict in componentStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="使用寿命" prop="serviceLife">
        <ElInput v-model="formData.serviceLife" placeholder="请输入使用寿命" />
      </ElFormItem>
      <ElFormItem label="关联事件记录" prop="relatedEventRecords">
        <ElInput
          v-model="formData.relatedEventRecords"
          placeholder="请输入关联事件记录"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading"
        >确 定</ElButton
      >
    </template>
  </ElDialog>
</template>
