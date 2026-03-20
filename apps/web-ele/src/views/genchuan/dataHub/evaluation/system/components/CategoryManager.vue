<template>
  <div class="category-manager">
    <div class="manager-header">
      <h3>分类与指标项配置</h3>
      <el-button type="primary" @click="addCategory">+ 添加分类</el-button>
    </div>

    <div v-if="!categories.length" class="empty-tip">
      暂无分类，请点击“添加分类”开始配置。
    </div>

    <div v-for="(cat, catIdx) in categories" :key="cat.categoryId" class="category-item">
      <el-card shadow="hover" class="category-card">
        <template #header>
          <div>
            <!-- 分类标题行 -->
            <el-row :gutter="10" class="category-header-title">
              <el-col :span="8">分类名称</el-col>
              <el-col :span="5">权重(%)</el-col>
              <el-col :span="5">排序</el-col>
              <el-col :span="6" style="text-align: right">操作</el-col>
            </el-row>
            <!-- 分类输入行 -->
            <el-row :gutter="10" align="middle">
              <el-col :span="8">
                <el-input v-model="cat.name" placeholder="分类名称" size="small" clearable />
              </el-col>
              <el-col :span="5">
                <el-input-number
                  v-model="cat.weight"
                  :min="0"
                  :max="100"
                  :precision="2"
                  placeholder="权重(%)"
                  size="small"
                  controls-position="right"
                />
              </el-col>
              <el-col :span="5">
                <el-input-number
                  v-model="cat.sortNo"
                  :min="0"
                  placeholder="排序"
                  size="small"
                  controls-position="right"
                />
              </el-col>
              <el-col :span="6" style="text-align: right">
                <el-button type="success" size="small" @click="addItem(catIdx)">+ 指标项</el-button>
                <el-button type="danger" size="small" @click="removeCategory(catIdx)">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </template>

        <!-- 指标项标题行（修正为单列“评价规则”） -->
        <div v-if="cat.items.length" class="item-header">
          <el-row :gutter="10" align="middle">
            <el-col :span="6">指标项名称</el-col>
            <el-col :span="8">评价规则</el-col>
            <el-col :span="4">权重(%)</el-col>
            <el-col :span="4">排序</el-col>
            <el-col :span="2" style="text-align: right">操作</el-col>
          </el-row>
        </div>

        <!-- 指标项列表 -->
        <div v-if="!cat.items.length" class="item-empty">暂无指标项，请添加</div>
        <div v-for="(item, itemIdx) in cat.items" :key="item.itemId" class="item-row">
          <el-row :gutter="10" align="middle">
            <el-col :span="6">
              <el-input v-model="item.name" placeholder="指标项名称" size="small" clearable />
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="item.commentRuleId"
                placeholder="请选择评价规则"
                size="small"
                clearable
                filterable
              >
                <el-option
                  v-for="rule in ruleOptions"
                  :key="rule.value"
                  :label="rule.label"
                  :value="rule.value"
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input-number
                v-model="item.weight"
                :min="0"
                :max="100"
                :precision="2"
                placeholder="权重(%)"
                size="small"
                controls-position="right"
              />
            </el-col>
            <el-col :span="4">
              <el-input-number
                v-model="item.sortNo"
                :min="0"
                placeholder="排序"
                size="small"
                controls-position="right"
              />
            </el-col>
            <el-col :span="2" style="text-align: right">
              <el-button type="danger" size="small" @click="removeItem(catIdx, itemIdx)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- 分类总权重提示 -->
    <div class="total-weight-summary" :class="{ error: !isTotalWeightValid }">
      所有分类权重合计：{{ totalCategoryWeight }}%
      <span v-if="!isTotalWeightValid">（必须等于100%）</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getRuleList } from '#/api/genchuan/dataHub/evaluation/system/indicators/index.js';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  systemId: { type: [Number, String], default: null },
});

const emit = defineEmits(['update:modelValue']);

const categories = ref([]);
const ruleOptions = ref([]);

// 同步 modelValue
watch(
  () => props.modelValue,
  (val) => {
    categories.value = val.map(cat => ({
      ...cat,
      items: (cat.items || []).map(item => ({
        ...item,
        itemId: item.itemId || `temp_${Date.now()}_${Math.random()}`
      })),
      categoryId: cat.categoryId || `temp_${Date.now()}_${Math.random()}`
    }));
  },
  { immediate: true, deep: true }
);

// 监听内部变化，向外 emit
watch(categories, (val) => {
  emit('update:modelValue', val);
}, { deep: true });

// 加载规则列表（只获取启用状态的规则）
const loadRuleOptions = async (id) => {
  try {
    const params = { systemId: id, status: 1 };
    const rules = await getRuleList(params);
    ruleOptions.value = rules || [];
  } catch (error) {
    console.error('获取规则列表失败', error);
    ruleOptions.value = [];
  }
};

// 监听 systemId 变化
watch(() => props.systemId, (newId) => {
  loadRuleOptions(newId);
}, { immediate: true });

// 添加分类
function addCategory() {
  const newCat = {
    categoryId: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    name: '',
    weight: 0,
    sortNo: categories.value.length + 1,
    items: [],
  };
  categories.value.push(newCat);
}

// 添加指标项（包含 weight 默认值）
function addItem(catIdx) {
  const newItem = {
    itemId: `item_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    name: '',
    commentRuleId: '',
    weight: 0,
    sortNo: categories.value[catIdx].items.length + 1,
  };
  categories.value[catIdx].items.push(newItem);
}

// 删除分类
function removeCategory(index) {
  categories.value.splice(index, 1);
}

// 删除指标项
function removeItem(catIdx, itemIdx) {
  categories.value[catIdx].items.splice(itemIdx, 1);
}

// 计算所有分类权重总和
const totalCategoryWeight = computed(() => {
  return categories.value.reduce((sum, cat) => sum + (Number(cat.weight) || 0), 0);
});

// 分类总权重是否有效
const isTotalWeightValid = computed(() => {
  if (!categories.value.length) return true;
  return Math.abs(totalCategoryWeight.value - 100) < 0.01;
});

// 校验
function validate() {
  for (const cat of categories.value) {
    if (!cat.name?.trim()) {
      ElMessage.error('请填写所有分类名称');
      return false;
    }
    for (const item of cat.items) {
      if (!item.name?.trim()) {
        ElMessage.error('请填写所有指标项名称');
        return false;
      }
      if (!item.commentRuleId) {
        ElMessage.error('请为每个指标项选择评价规则');
        return false;
      }
    }
  }
  if (!isTotalWeightValid.value) {
    ElMessage.error('所有分类的权重总和必须为100%');
    return false;
  }
  return true;
}

defineExpose({ validate });
</script>

<style scoped lang="scss">
.category-manager {
  margin-top: 20px;
  padding: 0 10px;
}
.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}
.empty-tip {
  color: #909399;
  text-align: center;
  padding: 40px 0;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background: #fafafa;
}
.category-item {
  margin-bottom: 16px;
}
.category-card {
  :deep(.el-card__header) {
    padding: 10px 15px;
    background-color: #f5f7fa;
  }
}
.category-header-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
  .el-col {
    white-space: nowrap;
  }
}
.item-header {
  background-color: #fafafa;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 6px;
  .el-row {
    font-size: 12px;
    color: #606266;
    font-weight: 500;
  }
  .el-col {
    text-align: left;
  }
}
.item-row {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
}
.item-empty {
  text-align: center;
  color: #c0c4cc;
  padding: 20px 0;
}
.total-weight-summary {
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #67c23a;
  text-align: right;
  &.error {
    color: #f56c6c;
  }
}
</style>
