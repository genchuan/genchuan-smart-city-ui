<template>
  <div class="rule-item-manager">
    <div class="manager-header">
      <h3>规则项配置</h3>
      <el-button type="primary" @click="addItem">+ 添加规则项</el-button>
    </div>

    <div v-if="!items.length" class="empty-tip">
      暂无规则项，请点击“添加规则项”开始配置。
    </div>

    <div v-for="(item, itemIdx) in items" :key="item.id" class="rule-item-card">
      <el-card shadow="hover" class="rule-item-card-inner">
        <template #header>
          <div>
            <!-- 规则项标题行（列提示） -->
            <el-row :gutter="10" class="rule-item-header-title">
              <el-col :span="4">规则项名称</el-col>
              <el-col :span="4">规则类型</el-col>
              <el-col :span="5">关联指标项</el-col>
              <el-col :span="4">适用对象类型</el-col>
              <el-col :span="3">权重</el-col>
              <el-col :span="4" style="text-align: right">操作</el-col>
            </el-row>
            <!-- 规则项输入行 -->
            <el-row :gutter="10" align="middle">
              <el-col :span="4">
                <el-input v-model="item.ruleName" placeholder="规则项名称" size="small" clearable />
              </el-col>
              <el-col :span="4">
                <el-select v-model="item.ruleType" placeholder="规则类型" size="small" clearable filterable>
                  <el-option
                    v-for="opt in ruleTypeOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select v-model="item.itemId" placeholder="关联指标项" size="small" clearable filterable>
                  <el-option
                    v-for="opt in itemOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select v-model="item.applyObjectType" placeholder="适用对象类型" size="small" clearable filterable>
                  <el-option
                    v-for="opt in objectTypeOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-input-number
                  v-model="item.weight"
                  :min="0"
                  :max="100"
                  :precision="2"
                  placeholder="权重"
                  size="small"
                  controls-position="right"
                />
              </el-col>
              <el-col :span="4" style="text-align: right">
                <el-button type="success" size="small" @click="addDetail(itemIdx)">+ 细则</el-button>
                <el-button type="danger" size="small" @click="removeItem(itemIdx)">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </template>

        <!-- 细则标题行 -->
        <div v-if="item.details.length" class="details-header">
          <el-row :gutter="10" align="middle">
            <el-col :span="3">最小值</el-col>
            <el-col :span="3">运算符(小)</el-col>
            <el-col :span="3">最大值</el-col>
            <el-col :span="3">运算符(大)</el-col>
            <el-col :span="2">分数</el-col>
            <el-col :span="2">排序</el-col>
            <el-col :span="5">描述</el-col>
            <el-col :span="3" style="text-align: right">操作</el-col>
          </el-row>
        </div>

        <!-- 细则列表 -->
        <div v-if="!item.details.length" class="details-empty">暂无细则，请添加</div>
        <div v-for="(detail, detailIdx) in item.details" :key="detail.id" class="detail-row">
          <el-row :gutter="10" align="middle">
            <el-col :span="3">
              <el-input-number
                v-model="detail.minValue"
                :min="0"
                :step="0.1"
                placeholder="无下限"
                size="small"
                controls-position="right"
              />
            </el-col>
            <el-col :span="3">
              <el-select v-model="detail.operatorMin" placeholder="≥" size="small">
                <el-option
                  v-for="opt in operatorMinOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-input-number
                v-model="detail.maxValue"
                :min="0"
                :step="0.1"
                placeholder="无上限"
                size="small"
                controls-position="right"
              />
            </el-col>
            <el-col :span="3">
              <el-select v-model="detail.operatorMax" placeholder="≤" size="small">
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
              />
            </el-col>
            <el-col :span="2">
              <el-input-number
                v-model="detail.sortOrder"
                :min="1"
                placeholder="排序"
                size="small"
                controls-position="right"
              />
            </el-col>
            <el-col :span="5">
              <el-input v-model="detail.remark" placeholder="描述" size="small" clearable />
            </el-col>
            <el-col :span="3" style="text-align: right">
              <el-button type="danger" size="small" @click="removeDetail(itemIdx, detailIdx)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getRuleTypeList,
  getObjectTypeSimpleList,
  getIndexItemSimpleList,
} from '#/api/genchuan/dataHub/evaluation/system/rules/index.js';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  systemId: { type: [String, Number], default: null },
});

const emit = defineEmits(['update:modelValue']);

const items = ref([]);
const ruleTypeOptions = ref([]);
const objectTypeOptions = ref([]);
const itemOptions = ref([]);

const operatorMinOptions = [
  { label: '>=', value: '>=' },
  { label: '>', value: '>' },
];
const operatorMaxOptions = [
  { label: '<=', value: '<=' },
  { label: '<', value: '<' },
];

// 加载规则类型（确保 value 为数字）
const loadRuleTypeOptions = async () => {
  try {
    const list = await getRuleTypeList();
    ruleTypeOptions.value = Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('加载规则类型失败', error);
    ruleTypeOptions.value = [];
  }
};

// 加载适用对象类型（若后端要求数字，需转换）
const loadObjectTypeOptions = async () => {
  try {
    const list = await getObjectTypeSimpleList();
    objectTypeOptions.value = Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('加载适用对象类型失败', error);
    objectTypeOptions.value = [];
  }
};

// 加载指标项列表（依赖 systemId，返回数字 value）
const loadItemOptions = async () => {
  try {
    const params = props.systemId ? { systemId: props.systemId } : {};
    const list = await getIndexItemSimpleList(params);
    itemOptions.value = Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('加载指标项列表失败', error);
    itemOptions.value = [];
  }
};

watch(() => props.systemId, loadItemOptions);

onMounted(() => {
  loadRuleTypeOptions();
  loadObjectTypeOptions();
  loadItemOptions();
});

// 同步外部 modelValue，保留数字 ID，为新增项生成临时字符串 ID
watch(
  () => props.modelValue,
  (val) => {
    const newItems = val.map(item => ({
      ...item,
      id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      details: (item.details || []).map(d => ({
        ...d,
        id: d.id || `detail_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      })),
    }));
    // 仅在数组内容发生变化时才更新，避免递归
    if (JSON.stringify(newItems) !== JSON.stringify(items.value)) {
      items.value = newItems;
    }
  },
  { immediate: true, deep: true }
);

// 监听内部变化并向外 emit
watch(items, (val) => {
  emit('update:modelValue', val);
}, { deep: true });

// 添加规则项（生成临时字符串 ID）
function addItem() {
  const newItem = {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    ruleName: '',
    ruleType: '',        // 待选择，保持字符串
    itemId: '',          // 待选择，保持字符串（但保存时会转为数字）
    applyObjectType: '', // 待选择，保持字符串
    weight: 0,
    status: 1,           // 数字
    effectiveStartTime: null,
    effectiveEndTime: null,
    details: [],
  };
  items.value.push(newItem);
}

function removeItem(index) {
  items.value.splice(index, 1);
}

function addDetail(itemIndex) {
  const newDetail = {
    id: `detail_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    minValue: null,
    maxValue: null,
    operatorMin: '>=',
    operatorMax: '<=',
    score: 0,
    sortOrder: items.value[itemIndex].details.length + 1,
    remark: '',
  };
  items.value[itemIndex].details.push(newDetail);
}

function removeDetail(itemIndex, detailIndex) {
  items.value[itemIndex].details.splice(detailIndex, 1);
}

// 校验（确保必填项不为空）
function validate() {
  for (const [idx, item] of items.value.entries()) {
    if (!item.ruleName?.trim()) {
      ElMessage.error(`第 ${idx + 1} 个规则项名称不能为空`);
      return false;
    }
    if (!item.ruleType) {
      ElMessage.error(`请为规则项“${item.ruleName || idx + 1}”选择规则类型`);
      return false;
    }
    if (!item.itemId) {
      ElMessage.error(`请为规则项“${item.ruleName || idx + 1}”选择关联指标项`);
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

defineExpose({ validate });
</script>

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
.rule-item-card-inner {
  :deep(.el-card__header) {
    padding: 10px 15px;
    background-color: #f5f7fa;
  }
}
.rule-item-header-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
  .el-col {
    white-space: nowrap;
  }
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
</style>
