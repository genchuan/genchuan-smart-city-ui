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
} from 'element-plus';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { DrainageUserApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/waterConservancyAndWaterAffairs/drainageUserManagement/drainageUser';

/** 排水户信息 表单 */
defineOptions({ name: 'DrainageUserForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  creditCode: undefined,
  userName: undefined,
  industryType: undefined,
  userType: undefined,
  waterUsage: undefined,
  drainagePoint: undefined,
  preTreatment: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

// 字典选项 - 使用计算属性实时获取
const industryTypeOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_INDUSTRY_CATEGORY, 'string'),
);
const userTypeOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_DRAINAGE_USER, 'string'),
);

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增排水户信息' : '编辑排水户信息';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await DrainageUserApi.getDrainageUser(id);
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
      await DrainageUserApi.createDrainageUser(data);
      ElMessage.success('新增成功');
    } else {
      await DrainageUserApi.updateDrainageUser(data);
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
    creditCode: undefined,
    userName: undefined,
    industryType: undefined,
    userType: undefined,
    waterUsage: undefined,
    drainagePoint: undefined,
    preTreatment: undefined,
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
      <ElFormItem label="统一社会信用代码" prop="creditCode">
        <ElInput
          v-model="formData.creditCode"
          placeholder="请输入统一社会信用代码"
        />
      </ElFormItem>
      <ElFormItem label="排水户名称" prop="userName">
        <ElInput v-model="formData.userName" placeholder="请输入排水户名称" />
      </ElFormItem>
      <ElFormItem label="行业类别" prop="industryType">
        <ElSelect
          v-model="formData.industryType"
          placeholder="请选择行业类别"
          style="width: 100%"
        >
          <ElOption
            v-for="dict in industryTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="排水户分类" prop="userType">
        <ElSelect
          v-model="formData.userType"
          placeholder="请选择排水户分类"
          style="width: 100%"
        >
          <ElOption
            v-for="dict in userTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="月均用水量（吨）" prop="waterUsage">
        <ElInput
          v-model="formData.waterUsage"
          placeholder="请输入月均用水量（吨）"
        />
      </ElFormItem>
      <ElFormItem label="排水管网接入点坐标" prop="drainagePoint">
        <ElInput
          v-model="formData.drainagePoint"
          placeholder="请输入排水管网接入点坐标"
        />
      </ElFormItem>
      <ElFormItem label="预处理设施清单" prop="preTreatment">
        <ElInput
          v-model="formData.preTreatment"
          type="textarea"
          placeholder="请输入预处理设施清单"
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
