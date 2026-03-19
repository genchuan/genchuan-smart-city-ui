<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker, ElSelect, ElOption
} from 'element-plus';
import {
  DynamicInformationInputApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/dynamicinformationinput';
import {
  DynamicInformationClassificationApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/dynamicinformationclassification';

/** 动态信息录入 表单 */
defineOptions({ name: 'DynamicInformationInputForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const publishingSubjectOptions = ref([]); // 信息类别
const formData = ref({
  id: undefined,
  title: undefined,
  releaseTime: undefined,
  publishingSubject: undefined,
  contentOverview: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 初始化信息类别数据 */
const initData = async () => {
  const queryParams = {
    pageNo: 1,
    pageSize: 100,
  };
  const data = await DynamicInformationClassificationApi.getDynamicInformationClassificationPage(queryParams);
  publishingSubjectOptions.value = data.list.map((item) => ({
    label: item.messageSubject,
    value: item.id,
  }));
};

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增动态信息录入' : '编辑动态信息录入';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await DynamicInformationInputApi.getDynamicInformationInput(id);
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
      await DynamicInformationInputApi.createDynamicInformationInput(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await DynamicInformationInputApi.updateDynamicInformationInput(
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
    title: undefined,
    releaseTime: undefined,
    publishingSubject: undefined,
    contentOverview: undefined,
  };
  formRef.value?.resetFields();
};

/** 初始化 */
onMounted(() => {
  initData();
});
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
      <ElFormItem label="标题" prop="title">
        <ElInput v-model="formData.title" placeholder="请输入标题" />
      </ElFormItem>
      <ElFormItem label="发布时间" prop="releaseTime">
        <ElDatePicker
          v-model="formData.releaseTime"
          type="date"
          value-format="x"
          placeholder="选择发布时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="信息类别" prop="publishingSubject">
        <ElSelect v-model="formData.publishingSubject" placeholder="请选择信息类别">
          <ElOption
            v-for="item in publishingSubjectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="内容概述" prop="contentOverview">
        <ElInput v-model="formData.contentOverview" placeholder="请输入内容概述" />
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
