<!-- 文件路径：src/views/genchuan/dataHub/evaluation/system/components/CategoryManager.vue -->
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
            <!-- 分类标题行（默认左对齐） -->
            <el-row :gutter="10" class="category-header-title">
              <el-col :span="8">分类名称</el-col>
              <el-col :span="5">权重(%)</el-col>
              <el-col :span="5">排序</el-col>
              <el-col :span="6" style="text-align: right">操作</el-col>
            </el-row>
            <!-- 分类输入行 -->
            <el-row :gutter="10" align="middle">
              <el-col :span="8">
                <el-input
                  v-model="cat.name"
                  placeholder="分类名称"
                  size="small"
                  clearable
                />
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

        <!-- 指标项标题行（统一左对齐） -->
        <div v-if="cat.items.length" class="item-header">
          <el-row :gutter="10" align="middle">
            <el-col :span="5">指标项名称</el-col>
            <el-col :span="4">指标类型</el-col>
            <el-col :span="4">计算方式</el-col>
            <el-col :span="3">达标阈值</el-col>
            <el-col :span="3">权重(%)</el-col>
            <el-col :span="2">排序</el-col>
            <el-col :span="2">操作</el-col>
          </el-row>
        </div>

        <!-- 指标项列表 -->
        <div v-if="!cat.items.length" class="item-empty">暂无指标项，请添加</div>
        <div v-for="(item, itemIdx) in cat.items" :key="item.itemId" class="item-row">
          <el-row :gutter="10" align="middle">
            <el-col :span="5">
              <el-input
                v-model="item.name"
                placeholder="指标项名称"
                size="small"
                clearable
              />
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="item.indexType"
                placeholder="指标类型"
                size="small"
                clearable
                filterable
              >
                <el-option
                  v-for="type in indexTypeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="item.calcWay"
                placeholder="计算方式"
                size="small"
                clearable
                filterable
              >
                <el-option
                  v-for="way in calcWayOptions"
                  :key="way.value"
                  :label="way.label"
                  :value="way.value"
                />
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-input-number
                v-model="item.threshold"
                :min="0"
                placeholder="达标阈值"
                size="small"
                controls-position="right"
              />
            </el-col>
            <el-col :span="3">
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
            <el-col :span="2">
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

        <!-- 当前分类下指标项权重合计提示 -->
        <div class="item-weight-summary" :class="{ error: !isCategoryWeightValid(cat) }">
          分类“{{ cat.name || '未命名' }}”下指标项权重合计：{{ getCategoryItemWeightSum(cat) }}%
          <span v-if="!isCategoryWeightValid(cat)">（必须等于100%）</span>
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
import { computed, ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getIndexTypeList, getCalcWayList } from '#/api/genchuan/dataHub/evaluation/system/indicators';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue']);

// 内部数据，与 modelValue 同步
const categories = ref([]);

// 字典选项
const indexTypeOptions = ref([]);
const calcWayOptions = ref([]);

// 同步 modelValue 到内部
watch(
  () => props.modelValue,
  (val) => {
    categories.value = val.map(cat => ({
      ...cat,
      items: (cat.items || []).map(item => ({
        ...item,
        // 确保每个项都有临时ID（用于key）
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

// 加载字典数据
onMounted(async () => {
  try {
    const indexRes = await getIndexTypeList();
    // 假设返回格式为 { code:0, data: [{ value, label }] }
    indexTypeOptions.value = indexRes || [];
  } catch (error) {
    console.error('获取指标类型失败', error);
    // 降级为静态数据
    indexTypeOptions.value = [
      { value: 'quantitative', label: '定量指标' },
      { value: 'qualitative', label: '定性指标' },
    ];
  }
  try {
    const calcRes = await getCalcWayList();
    calcWayOptions.value = calcRes || [];
  } catch (error) {
    console.error('获取计算方式失败', error);
    calcWayOptions.value = [
      { value: 'percent', label: '百分比' },
      { value: 'score', label: '分值' },
    ];
  }
});

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

// 添加指标项
function addItem(catIdx) {
  const newItem = {
    itemId: `item_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    name: '',
    indexType: '',
    calcWay: '',
    threshold: 0,
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

// 计算指定分类下指标项权重总和
function getCategoryItemWeightSum(cat) {
  return cat.items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
}

// 检查分类下指标项权重是否有效（总和=100）
function isCategoryWeightValid(cat) {
  if (!cat.items.length) return true; // 没有指标项时视为有效（暂不校验）
  const sum = getCategoryItemWeightSum(cat);
  return Math.abs(sum - 100) < 0.01;
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

// 对外暴露校验方法
function validate() {
  // 1. 每个分类的名称不能为空
  for (const cat of categories.value) {
    if (!cat.name?.trim()) {
      ElMessage.error('请填写所有分类名称');
      return false;
    }
    // 2. 每个分类下的指标项权重总和必须为100%（如果有指标项）
    if (cat.items.length && !isCategoryWeightValid(cat)) {
      ElMessage.error(`分类“${cat.name}”下的指标项权重总和必须为100%`);
      return false;
    }
    // 3. 指标项名称不能为空
    for (const item of cat.items) {
      if (!item.name?.trim()) {
        ElMessage.error('请填写所有指标项名称');
        return false;
      }
      // 指标类型和计算方式必须选择
      if (!item.indexType) {
        ElMessage.error('请选择指标类型');
        return false;
      }
      if (!item.calcWay) {
        ElMessage.error('请选择计算方式');
        return false;
      }
    }
  }
  // 4. 分类总权重必须为100%
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
/* 分类标题行样式 */
.category-header-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
  .el-col {
    white-space: nowrap;
  }
}
/* 指标项标题行样式 */
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
  /* 统一左对齐 */
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
.item-weight-summary {
  margin-top: 8px;
  font-size: 13px;
  color: #67c23a;
  text-align: right;
  &.error {
    color: #f56c6c;
  }
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
