<!-- RuleItemManager.vue - 删除规则类型、关联指标项、权重 -->
<script setup>
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getObjectTypeSimpleList,
} from '#/api/genchuan/dataHub/evaluation/system/rules/index.js';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  categoryId: { type: [String, Number], default: null },
});

const emit = defineEmits(['update:modelValue', 'refresh']);

const items = ref([]);
const optionsLoading = ref(true);

// 只保留适用对象类型选项
const objectTypeOptions = ref([]);

const loadOptions = async () => {
  optionsLoading.value = true;
  try {
    const objectTypes = await getObjectTypeSimpleList().catch(() => []);
    objectTypeOptions.value = (Array.isArray(objectTypes) ? objectTypes : []).map(o => ({
      label: o.label,
      value: String(o.value)
    }));
    if (objectTypeOptions.value.length === 0) console.warn('对象类型选项为空');
  } catch (error) {
    console.error('加载下拉选项失败', error);
    ElMessage.error('加载选项失败，请刷新重试');
  } finally {
    optionsLoading.value = false;
  }
};

onMounted(() => {
  loadOptions();
});

// 同步 modelValue
watch(
  () => props.modelValue,
  (val) => {
    items.value = val.map(item => ({
      ...item,
      details: (item.details || []).map(d => ({ ...d })),
      id: item.id
    }));
  },
  { immediate: true, deep: true }
);

// 添加规则项（移除 ruleType, itemId, weight）
function addItem() {
  const newItem = {
    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    ruleName: '',
    applyObjectType: '',
    details: [],
    status: 1,          // 默认启用
  };
  items.value.push(newItem);
}

function removeItem(index) {
  items.value.splice(index, 1);
}

function addDetail(itemIndex) {
  const newDetail = {
    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    minValue: null,
    maxValue: null,
    operatorMin: '>=',
    operatorMax: '<=',
    score: 0,
    sortOrder: (items.value[itemIndex].details.length + 1),
    remark: '',
  };
  items.value[itemIndex].details.push(newDetail);
}

function removeDetail(itemIndex, detailIndex) {
  items.value[itemIndex].details.splice(detailIndex, 1);
}

// 运算符选项
const operatorMinOptions = [
  { label: '>=', value: '>=' },
  { label: '>', value: '>' }
];
const operatorMaxOptions = [
  { label: '<=', value: '<=' },
  { label: '<', value: '<' }
];

// 校验函数（移除对 ruleType, itemId, weight 的校验）
function validate() {
  for (const [idx, item] of items.value.entries()) {
    if (!item.ruleName?.trim()) {
      ElMessage.error(`第 ${idx + 1} 个规则项名称不能为空`);
      return false;
    }
    if (!item.applyObjectType) {
      ElMessage.error(`请为规则项“${item.ruleName || idx + 1}”选择适用对象类型`);
      return false;
    }
    for (const [dIdx, detail] of item.details.entries()) {
      if (detail.score === null || detail.score === undefined) {
        ElMessage.error(`规则项“${item.ruleName}”的第 ${dIdx + 1} 条细则分数不能为空`);
        return false;
      }
      if (!detail.sortOrder) {
        ElMessage.error(`规则项“${item.ruleName}”的第 ${dIdx + 1} 条细则排序不能为空`);
        return false;
      }
    }
  }
  return true;
}

function getItems() {
  return items.value;
}

defineExpose({ validate, getItems });
</script>

<template>
  <div v-loading="optionsLoading" class="rule-item-manager">
    <div class="manager-header">
      <h3>规则项配置</h3>
      <el-button type="primary" @click="addItem">+ 添加规则项</el-button>
    </div>

    <div v-if="!items.length" class="empty-tip">
      暂无规则项，请点击“添加规则项”开始配置。
    </div>

    <div v-for="(item, itemIdx) in items" :key="item.id" class="rule-item-card">
      <el-card shadow="hover">
        <template #header>
          <div class="rule-item-header">
            <!-- 标题行：只保留规则项名称、适用对象类型、操作 -->
            <el-row :gutter="12" class="category-header-title">
              <el-col :span="8">规则项名称</el-col>
              <el-col :span="12">适用对象类型</el-col>
              <el-col :span="4" style="text-align: right">操作</el-col>
            </el-row>
            <!-- 输入行 -->
            <el-row :gutter="12" align="middle">
              <el-col :span="8">
                <el-input v-model="item.ruleName" placeholder="规则项名称" size="small" clearable />
              </el-col>
              <el-col :span="12">
                <el-select
                  v-model="item.applyObjectType"
                  placeholder="适用对象类型"
                  size="small"
                  clearable
                  :teleported="false"
                  virtualized
                  style="width: 100%"
                >
                  <el-option
                    v-for="opt in objectTypeOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="4" style="text-align: right">
                <el-button type="danger" size="small" @click="removeItem(itemIdx)">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </template>

        <!-- 细则表格标题行 -->
        <div v-if="item.details.length" class="details-header">
          <el-row :gutter="12" align="middle">
            <el-col :span="2">最小值</el-col>
            <el-col :span="2">运算符(小)</el-col>
            <el-col :span="2">最大值</el-col>
            <el-col :span="2">运算符(大)</el-col>
            <el-col :span="2">分数</el-col>
            <el-col :span="2">排序</el-col>
            <el-col :span="5">描述</el-col>
            <el-col :span="3" style="text-align: right">操作</el-col>
          </el-row>
        </div>

        <!-- 细则列表 -->
        <div v-if="!item.details.length" class="details-empty">暂无细则，请添加</div>
        <div v-for="(detail, detailIdx) in item.details" :key="detail.id" class="detail-row">
          <el-row :gutter="12" align="middle">
            <el-col :span="2">
              <el-input-number
                v-model="detail.minValue"
                :min="0"
                :step="0.1"
                placeholder="无下限"
                size="small"
                controls-position="right"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2">
              <el-select v-model="detail.operatorMin" placeholder="≥" size="small" style="width: 100%" virtualized>
                <el-option
                  v-for="opt in operatorMinOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-input-number
                v-model="detail.maxValue"
                :min="0"
                :step="0.1"
                placeholder="无上限"
                size="small"
                controls-position="right"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2">
              <el-select v-model="detail.operatorMax" placeholder="≤" size="small" style="width: 100%" virtualized>
                <el-option
                  v-for="opt in operatorMaxOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-input-number
                v-model="detail.score"
                :min="0"
                :step="0.1"
                placeholder="分数"
                size="small"
                controls-position="right"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2">
              <el-input-number
                v-model="detail.sortOrder"
                :min="1"
                placeholder="排序"
                size="small"
                controls-position="right"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="5">
              <el-input v-model="detail.remark" placeholder="描述" size="small" clearable style="width: 100%" />
            </el-col>
            <el-col :span="3" style="text-align: right">
              <el-button type="danger" size="small" @click="removeDetail(itemIdx, detailIdx)">删除</el-button>
            </el-col>
          </el-row>
        </div>

        <!-- 添加细则按钮 -->
        <div class="add-detail-btn">
          <el-button type="primary" size="small" @click="addDetail(itemIdx)">+ 添加细则</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rule-item-manager {
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
.rule-item-card {
  margin-bottom: 16px;
}
.rule-item-header {
  padding: 4px 0;
  background-color: #f5f7fa;
}
.category-header-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
}
.details-header {
  background-color: #fafafa;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 6px;
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}
.detail-row {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
}
.details-empty {
  text-align: center;
  color: #c0c4cc;
  padding: 20px 0;
}
.add-detail-btn {
  margin-top: 12px;
  text-align: right;
}
</style>
