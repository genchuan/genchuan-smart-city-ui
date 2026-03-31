<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElDatePicker,
} from 'element-plus';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { DrainageLicenseApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/waterConservancyAndWaterAffairs/drainageUserManagement/drainageLicense';

/** 排水电子许可证信息 表单 */
defineOptions({ name: 'DrainageLicenseForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  licenseNo: undefined,
  startDate: undefined,
  endDate: undefined,
  drainageType: undefined,
  approvalUnit: undefined,
  licenseStatus: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

// 字典选项 - 使用计算属性实时获取
const drainageTypeOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_DRAINAGE_TYPE, 'string'),
);
const licenseStatusOptions = computed(() =>
  getDictOptions(DICT_TYPE.CRM_AUDIT_STATUS, 'string'),
);

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增排水电子许可证信息' : '编辑排水电子许可证信息';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await DrainageLicenseApi.getDrainageLicense(id);
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
      await DrainageLicenseApi.createDrainageLicense(data);
      ElMessage.success('新增成功');
    } else {
      await DrainageLicenseApi.updateDrainageLicense(data);
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
    licenseNo: undefined,
    startDate: undefined,
    endDate: undefined,
    drainageType: undefined,
    approvalUnit: undefined,
    licenseStatus: undefined,
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
      <ElFormItem label="许可证编号" prop="licenseNo">
        <ElInput v-model="formData.licenseNo" placeholder="请输入许可证编号" />
      </ElFormItem>
      <ElFormItem label="有效期开始日期" prop="startDate">
        <ElDatePicker
          v-model="formData.startDate"
          type="date"
          value-format="x"
          placeholder="选择有效期开始日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="有效期结束日期" prop="endDate">
        <ElDatePicker
          v-model="formData.endDate"
          type="date"
          value-format="x"
          placeholder="选择有效期结束日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="许可排水类型" prop="drainageType">
        <ElSelect
          v-model="formData.drainageType"
          placeholder="请选择许可排水类型"
          style="width: 100%"
        >
          <ElOption
            v-for="dict in drainageTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="审批单位" prop="approvalUnit">
        <ElInput v-model="formData.approvalUnit" placeholder="请输入审批单位" />
      </ElFormItem>
      <ElFormItem label="状态" prop="licenseStatus">
        <ElSelect
          v-model="formData.licenseStatus"
          placeholder="请选择状态"
          style="width: 100%"
        >
          <ElOption
            v-for="dict in licenseStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
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
