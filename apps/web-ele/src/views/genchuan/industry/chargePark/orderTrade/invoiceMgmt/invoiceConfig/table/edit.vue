<script setup>
import { reactive, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElMessage } from 'element-plus';
import { create, update } from '#/api/genchuan/industry/chargePark/orderTrade/invoiceMgmt/index.js';

// 表单数据
const formData = reactive({
  id: 0,
  category: '',
  taxRate: 0,
  taxBody: '',
  status: '',
  remark: '',
  reserve1: '',
  reserve2: '',
});

// 表单规则
const rules = {
  category: [
    { required: true, message: '开票类目不能为空', trigger: 'blur' },
  ],
  taxBody: [
    { required: true, message: '开票主体不能为空', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '状态不能为空', trigger: 'blur' },
  ],
};

const formRef = ref(null);

// 外部传入的数据
const editData = ref({});

// 监听外部数据变化
watch(editData, (newVal) => {
  formData.id = newVal.id || 0;
  formData.category = newVal.category || '';
  formData.taxRate = newVal.taxRate || 0;
  formData.taxBody = newVal.taxBody || '';
  formData.status = newVal.status || '';
  formData.remark = newVal.remark || '';
  formData.reserve1 = newVal.reserve1 || '';
  formData.reserve2 = newVal.reserve2 || '';
}, { immediate: true, deep: true });

// 标题
const drawerTitle = ref('新增发票配置');

// 设置数据（用于编辑）
const setData = (data) => {
  editData.value = data;
  drawerTitle.value = data.id > 0 ? `${data.category || '发票配置'} 编辑` : '新增发票配置';
};

// 清空表单
const resetForm = () => {
  formData.id = 0;
  formData.category = '';
  formData.taxRate = 0;
  formData.taxBody = '';
  formData.status = '';
  formData.remark = '';
  formData.reserve1 = '';
  formData.reserve2 = '';
};

// 抽屉
const [EditDrawer, editDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  cancelText: '取消',
  confirmText: '保存',
  width: 900,
  onCancel() {
    resetForm();
    editDrawerApi.close();
  },
  onConfirm() {
    handleSave();
  },
  async onOpenChange(open) {
    if (open) {
      // 打开时已通过 setData 设置数据
    }
  },
});

// 保存
async function handleSave() {
  if (!formRef.value) return;
  
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    
    const params = {
      id: formData.id,
      category: formData.category,
      taxRate: formData.taxRate,
      taxBody: formData.taxBody,
      status: formData.status,
      remark: formData.remark,
      reserve1: formData.reserve1,
      reserve2: formData.reserve2,
    };
    try {
      if (params.id > 0) {
        await update(params);
        ElMessage.success('更新成功');
      } else {
        await create(params);
        ElMessage.success('创建成功');
      }
      resetForm();
    editDrawerApi.close();
    // 触发刷新
    if (window.invoiceConfigRefresh) {
      window.invoiceConfigRefresh();
    }
  } catch (error) {
      console.error('保存失败:', error);
      ElMessage.error('保存失败');
    }
  });
}

// 打开抽屉（新增）
const openAdd = () => {
  resetForm();
  drawerTitle.value = '新增发票配置';
  editDrawerApi.open();
};

// 打开抽屉（编辑）
const openEdit = (data) => {
  setData(data);
  editDrawerApi.open();
};

defineExpose({
  open: () => editDrawerApi.open(),
  close: () => editDrawerApi.close(),
  openAdd,
  openEdit,
});
</script>

<template>
  <EditDrawer :title="drawerTitle">
    <div class="detail-card">
      <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px" class="detail-form">
        <ElFormItem label="开票类目" prop="category">
          <ElInput v-model="formData.category" placeholder="请输入开票类目" />
        </ElFormItem>
        <ElFormItem label="税率(%)" prop="taxRate">
          <ElInputNumber v-model="formData.taxRate" :min="0" :max="100" step="0.01" placeholder="请输入税率" />
        </ElFormItem>
        <ElFormItem label="开票主体" prop="taxBody">
          <ElInput v-model="formData.taxBody" placeholder="请输入开票主体" />
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
          <ElSelect v-model="formData.status" placeholder="请选择状态">
            <ElOption label="未生效" value="pending" />
            <ElOption label="已生效" value="enabled" />
            <ElOption label="已禁用" value="disabled" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="备注" prop="remark">
          <ElInput v-model="formData.remark" type="textarea" placeholder="请输入备注" :rows="3" />
        </ElFormItem> 
      </ElForm>
    </div>
  </EditDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.detail-form {
  max-width: 600px;
}
</style>
