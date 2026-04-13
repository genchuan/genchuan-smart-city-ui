<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
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
import { ExperienceInformationInputApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/experienceinformationinput';
import { ClassificationOfExperienceInformationApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/classificationofexperienceinformation';

/** 经验信息录入 表单 */
defineOptions({ name: 'ExperienceInformationInputForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const sectorOptions = ref([]); // 所属行业
const formData = ref({
  id: undefined,
  experienceTheme: undefined,
  isArea: undefined,
  experienceProvider: undefined,
  implementationTime: undefined,
  implementationLocation: undefined,
  detailSteps: undefined,
  achieveResults: undefined,
  keyPointsForReference: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 初始化所属行业数据 */
const initData = async () => {
  const queryParams = {
    pageNo: 1,
    pageSize: 100,
  };
  const data =
    await ClassificationOfExperienceInformationApi.getClassificationOfExperienceInformationPage(
      queryParams,
    );
  sectorOptions.value = data.list.map((item) => ({
    label: item.sector,
    value: item.id,
  }));
};

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增经验信息录入' : '编辑经验信息录入';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await ExperienceInformationInputApi.getExperienceInformationInput(id);
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
      await ExperienceInformationInputApi.createExperienceInformationInput(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await ExperienceInformationInputApi.updateExperienceInformationInput(
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
    experienceTheme: undefined,
    isArea: undefined,
    experienceProvider: undefined,
    implementationTime: undefined,
    implementationLocation: undefined,
    detailSteps: undefined,
    achieveResults: undefined,
    keyPointsForReference: undefined,
  };
  formRef.value?.resetFields();
};

/** 初始化 */
onMounted(() => {
  initData();
});
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
      <ElFormItem label="经验主题" prop="experienceTheme">
        <ElInput
          v-model="formData.experienceTheme"
          placeholder="请输入经验主题"
        />
      </ElFormItem>
      <ElFormItem label="所属行业" prop="isArea">
        <ElSelect v-model="formData.isArea" placeholder="请选择所属行业">
          <ElOption
            v-for="item in sectorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="经验提供方" prop="experienceProvider">
        <ElInput
          v-model="formData.experienceProvider"
          placeholder="请输入经验提供方"
        />
      </ElFormItem>
      <ElFormItem label="实施时间" prop="implementationTime">
        <ElDatePicker
          v-model="formData.implementationTime"
          type="date"
          value-format="x"
          placeholder="选择实施时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="实施地点" prop="implementationLocation">
        <ElInput
          v-model="formData.implementationLocation"
          placeholder="请输入实施地点"
        />
      </ElFormItem>
      <ElFormItem label="详细步骤" prop="detailSteps">
        <ElInput
          v-model="formData.detailSteps"
          type="textarea"
          placeholder="请输入详细步骤"
        />
      </ElFormItem>
      <ElFormItem label="取得成效" prop="achieveResults">
        <ElInput
          v-model="formData.achieveResults"
          placeholder="请输入取得成效"
        />
      </ElFormItem>
      <ElFormItem label="可借鉴要点" prop="keyPointsForReference">
        <ElInput
          v-model="formData.keyPointsForReference"
          placeholder="请输入可借鉴要点"
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
