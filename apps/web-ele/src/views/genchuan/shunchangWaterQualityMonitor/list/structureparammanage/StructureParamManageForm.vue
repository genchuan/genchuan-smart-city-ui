<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
} from 'element-plus';
import { StructureParamManageApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/structureparammanage';

/** 构建筑物参数管理 表单 */
defineOptions({ name: 'StructureParamManageForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  structureName: undefined,
  structureType: undefined,
  length: undefined,
  width: undefined,
  depth: undefined,
  effectiveVolume: undefined,
  constructionTime: undefined,
});
const formRules = reactive({
  structureName: [
    { required: true, message: '构建筑物名称不能为空', trigger: 'blur' },
  ],
  structureType: [
    {
      required: true,
      message: '类型(沉淀池/滤池/清水池等)不能为空',
      trigger: 'blur',
    },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增构建筑物参数' : '编辑构建筑物参数';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await StructureParamManageApi.getStructureParamManage(id);
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
      await StructureParamManageApi.createStructureParamManage(data);
      ElMessage.success('新增成功');
    } else {
      await StructureParamManageApi.updateStructureParamManage(data);
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
    structureName: undefined,
    structureType: undefined,
    length: undefined,
    width: undefined,
    depth: undefined,
    effectiveVolume: undefined,
    constructionTime: undefined,
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
      label-width="180px"
      v-loading="formLoading"
    >
      <ElFormItem label="构建筑物名称" prop="structureName">
        <ElInput
          v-model="formData.structureName"
          placeholder="请输入构建筑物名称"
        />
      </ElFormItem>
      <ElFormItem label="类型(沉淀池/滤池/清水池等)" prop="structureType">
        <ElInput
          v-model="formData.structureType"
          placeholder="请输入类型(沉淀池/滤池/清水池等)"
        />
      </ElFormItem>
      <ElFormItem label="长度(米)" prop="length">
        <ElInput v-model="formData.length" placeholder="请输入长度(米)" />
      </ElFormItem>
      <ElFormItem label="宽度(米)" prop="width">
        <ElInput v-model="formData.width" placeholder="请输入宽度(米)" />
      </ElFormItem>
      <ElFormItem label="深度(米)" prop="depth">
        <ElInput v-model="formData.depth" placeholder="请输入深度(米)" />
      </ElFormItem>
      <ElFormItem label="有效容积(立方米)" prop="effectiveVolume">
        <ElInput
          v-model="formData.effectiveVolume"
          placeholder="请输入有效容积(立方米)"
        />
      </ElFormItem>
      <ElFormItem label="建设时间" prop="constructionTime">
        <ElDatePicker
          v-model="formData.constructionTime"
          type="date"
          value-format="x"
          placeholder="选择建设时间"
          style="width: 100%"
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
