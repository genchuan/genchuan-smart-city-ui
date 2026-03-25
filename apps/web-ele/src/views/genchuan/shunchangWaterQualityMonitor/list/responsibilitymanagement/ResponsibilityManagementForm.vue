<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="责任类型" prop="responsibilityType">
        <el-input
          v-model="formData.responsibilityType"
          placeholder="请输入责任类型(主体责任/监管责任/运行管理责任)"
        />
      </el-form-item>
      <el-form-item label="责任单位" prop="responsibleUnit">
        <el-input
          v-model="formData.responsibleUnit"
          placeholder="请输入责任单位"
        />
      </el-form-item>
      <el-form-item label="责任人姓名" prop="responsiblePerson">
        <el-input
          v-model="formData.responsiblePerson"
          placeholder="请输入责任人姓名"
        />
      </el-form-item>
      <el-form-item label="职务" prop="position">
        <el-input v-model="formData.position" placeholder="请输入职务" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contactInfo">
        <el-input v-model="formData.contactInfo" placeholder="请输入联系方式" />
      </el-form-item>
      <el-form-item label="责任范围" prop="responsibilityScope">
        <el-input
          v-model="formData.responsibilityScope"
          placeholder="请输入责任范围"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {
  ResponsibilityManagementApi,
  ResponsibilityManagementVO,
} from '@/api/waterdetection/responsibilitymanagement';

/** 责任单位及责任人管理 表单 */
defineOptions({ name: 'ResponsibilityManagementForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  responsibilityType: undefined,
  responsibleUnit: undefined,
  responsiblePerson: undefined,
  position: undefined,
  contactInfo: undefined,
  responsibilityScope: undefined,
});
const formRules = reactive({
  responsibilityType: [
    {
      required: true,
      message: '责任类型(主体责任/监管责任/运行管理责任)不能为空',
      trigger: 'blur',
    },
  ],
  responsibleUnit: [
    { required: true, message: '责任单位不能为空', trigger: 'blur' },
  ],
  responsiblePerson: [
    { required: true, message: '责任人姓名不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await ResponsibilityManagementApi.getResponsibilityManagement(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as ResponsibilityManagementVO;
    if (formType.value === 'create') {
      await ResponsibilityManagementApi.createResponsibilityManagement(data);
      message.success(t('common.createSuccess'));
    } else {
      await ResponsibilityManagementApi.updateResponsibilityManagement(data);
      message.success(t('common.updateSuccess'));
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
    responsibilityType: undefined,
    responsibleUnit: undefined,
    responsiblePerson: undefined,
    position: undefined,
    contactInfo: undefined,
    responsibilityScope: undefined,
  };
  formRef.value?.resetFields();
};
</script>
