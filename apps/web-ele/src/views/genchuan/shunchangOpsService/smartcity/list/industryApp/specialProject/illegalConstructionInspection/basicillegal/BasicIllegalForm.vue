<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
} from 'element-plus';
import { BasicIllegalApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/specialProject/illegalConstructionInspection/basicillegal';

/** 违建基本信息 表单 */
defineOptions({ name: 'BasicIllegalForm' });

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  buildingNumber: undefined,
  buildingAddress: undefined,
  constructionArea: undefined,
  typesStructures: undefined,
  numberFloors: undefined,
  unauthorizedBuildings: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增违建基本信息' : '编辑违建基本信息';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await BasicIllegalApi.getBasicIllegal(id);
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
      await BasicIllegalApi.createBasicIllegal(data);
      ElMessage.success('新增成功');
    } else {
      await BasicIllegalApi.updateBasicIllegal(data);
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
    buildingNumber: undefined,
    buildingAddress: undefined,
    constructionArea: undefined,
    typesStructures: undefined,
    numberFloors: undefined,
    unauthorizedBuildings: undefined,
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
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="违建编号" prop="buildingNumber">
        <ElInput
          v-model="formData.buildingNumber"
          placeholder="请输入违建编号"
        />
      </ElFormItem>
      <ElFormItem label="违建地址" prop="buildingAddress">
        <ElInput
          v-model="formData.buildingAddress"
          placeholder="请输入违建地址"
        />
      </ElFormItem>
      <ElFormItem label="违建面积" prop="constructionArea">
        <ElInput
          v-model="formData.constructionArea"
          placeholder="请输入违建面积"
        />
      </ElFormItem>
      <ElFormItem label="违建结构类型" prop="typesStructures">
        <ElInput
          v-model="formData.typesStructures"
          placeholder="请输入违建结构类型"
        />
      </ElFormItem>
      <ElFormItem label="违建层数" prop="numberFloors">
        <ElInput v-model="formData.numberFloors" placeholder="请输入违建层数" />
      </ElFormItem>
      <ElFormItem label="违建用途" prop="unauthorizedBuildings">
        <ElInput
          v-model="formData.unauthorizedBuildings"
          placeholder="请输入违建用途"
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
