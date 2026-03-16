<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import {
  createRuleItem,
  updateRuleItem,
  deleteRuleItem,
  getIndexItemSimpleList,
  getRuleTypeList,
} from '#/api/genchuan/dataHub/evaluation/system/rules/index.js';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  categoryId: { type: String, required: true }, // 所属分类ID
});

const emit = defineEmits(['update:modelValue', 'refresh']);

// 内部数据
const items = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  items.value = val;
}, { deep: true });

// 暴露方法给父组件（例如设置初始值）
defineExpose({
  setItems: (newItems) => {
    items.value = newItems;
    emit('update:modelValue', newItems);
  }
});

// 新增/编辑规则项表单
const ruleItemFormData = ref(null);
const getRuleItemTitle = computed(() => ruleItemFormData.value?.ruleItemId ? '编辑规则项' : '新增规则项');

const [RuleItemForm, ruleItemFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: () => [
    {
      fieldName: 'name',
      label: '规则项名称',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入规则项名称' },
    },
    {
      fieldName: 'indexId',
      label: '关联指标项',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择关联指标项',
        options: [], // 动态加载
      },
    },
    {
      fieldName: 'scoreLogic',
      label: '评分逻辑',
      component: 'Input',
      rules: 'required',
      componentProps: { type: 'textarea', placeholder: '请输入评分逻辑' },
    },
    {
      fieldName: 'fullScore',
      label: '满分值',
      component: 'InputNumber',
      rules: 'required',
      componentProps: { placeholder: '请输入满分值', min: 0, step: 0.1 },
    },
    {
      fieldName: 'ruleTypeId',
      label: '规则类型',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择规则类型',
        options: [], // 动态加载
      },
    },
  ],
  showDefaultActions: false,
});

const [RuleItemDrawer, ruleItemDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { ruleItemDrawerApi.close(); },
  async onConfirm() {
    const valid = await ruleItemFormApi.validate();
    if (!valid.valid) return;

    const values = ruleItemFormApi.form.values;
    const isEdit = !!ruleItemFormData.value?.ruleItemId;

    // 组装数据
    const payload = {
      ...values,
      ruleCategoryId: props.categoryId,
    };
    if (isEdit) {
      payload.ruleItemId = ruleItemFormData.value.ruleItemId;
    }

    try {
      if (isEdit) {
        await updateRuleItem(payload);
      } else {
        await createRuleItem(payload);
      }
      ElMessage.success(isEdit ? '编辑成功' : '新增成功');
      emit('refresh'); // 通知父组件刷新
      ruleItemDrawerApi.close();
    } catch (error) {
      ElMessage.error(error.message || '操作失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 动态加载指标项和规则类型选项
      const [indexItems, ruleTypes] = await Promise.all([
        getIndexItemSimpleList(),
        getRuleTypeList(),
      ]);

      await ruleItemFormApi.updateSchema([
        {
          fieldName: 'indexId',
          componentProps: { options: indexItems.map(i => ({ label: i.name, value: i.id })) },
        },
        {
          fieldName: 'ruleTypeId',
          componentProps: { options: ruleTypes.map(r => ({ label: r.name, value: r.id })) },
        },
      ]);

      const data = ruleItemDrawerApi.getData();
      ruleItemFormData.value = data;
      if (data?.ruleItemId) {
        await ruleItemFormApi.setValues(data);
      } else {
        ruleItemFormApi.resetForm();
      }
    }
  },
});

// 新增规则项
function handleAdd() {
  ruleItemDrawerApi.setData({}).open();
}

// 编辑规则项
function handleEdit(row) {
  ruleItemDrawerApi.setData({ ...row }).open();
}

// 删除规则项
async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除规则项“${row.name}”吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  try {
    await deleteRuleItem(row.ruleItemId);
    ElMessage.success('删除成功');
    emit('refresh');
  } catch (error) {
    ElMessage.error(error.message || '删除失败');
  }
}
</script>

<template>
  <div class="rule-item-manager">
    <div class="manager-header">
      <h4>规则项列表</h4>
      <el-button type="primary" size="small" :icon="Plus" @click="handleAdd">新增规则项</el-button>
    </div>
    <el-table :data="items" border size="small" style="width: 100%" max-height="300">
      <el-table-column prop="name" label="规则项名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="indexName" label="关联指标项" min-width="150" show-overflow-tooltip />
      <el-table-column prop="scoreLogic" label="评分逻辑" min-width="200" show-overflow-tooltip />
      <el-table-column prop="fullScore" label="满分值" width="80" />
      <el-table-column prop="ruleTypeName" label="规则类型" width="100" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 规则项表单抽屉 -->
    <RuleItemDrawer :title="getRuleItemTitle">
      <RuleItemForm />
    </RuleItemDrawer>
  </div>
</template>

<style scoped lang="scss">
.rule-item-manager {
  margin-top: 20px;
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    h4 {
      margin: 0;
      font-size: 14px;
      color: #1f2f3d;
    }
  }
}
</style>
