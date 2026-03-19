<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton
} from 'element-plus';
import {
  DynamicInformationClassificationApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/dynamicinformationclassification';

/** 动态信息分类 表单 */
defineOptions({ name: 'DynamicInformationClassificationForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  messageSubject: undefined,
  industrySector: undefined,
  informationSources: undefined,
  urgency: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增动态信息分类' : '编辑动态信息分类';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await DynamicInformationClassificationApi.getDynamicInformationClassification(id);
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
      await DynamicInformationClassificationApi.createDynamicInformationClassification(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await DynamicInformationClassificationApi.updateDynamicInformationClassification(
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
    messageSubject: undefined,
    industrySector: undefined,
    informationSources: undefined,
    urgency: undefined,
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
      <ElFormItem label="信息主题" prop="messageSubject">
        <ElInput v-model="formData.messageSubject" placeholder="请输入信息主题" />
      </ElFormItem>
      <ElFormItem label="行业领域" prop="industrySector">
        <ElInput v-model="formData.industrySector" placeholder="请输入行业领域" />
      </ElFormItem>
      <ElFormItem label="信息来源" prop="informationSources">
        <ElInput v-model="formData.informationSources" placeholder="请输入信息来源" />
      </ElFormItem>
      <ElFormItem label="紧急程度" prop="urgency">
        <ElInput v-model="formData.urgency" placeholder="请输入紧急程度" />
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
