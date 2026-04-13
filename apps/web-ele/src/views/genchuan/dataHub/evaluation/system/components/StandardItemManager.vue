<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue']);

const items = ref([]);

watch(
  () => props.modelValue,
  (val) => {
    items.value = val.map(item => ({ ...item }));
  },
  { immediate: true, deep: true }
);

function addItem() {
  items.value.push({
    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    grade: '',
    scoreRange: '',
    sortNo: null,
  });
}

function removeItem(index) {
  items.value.splice(index, 1);
}

function validate() {
  for (const [idx, item] of items.value.entries()) {
    if (!item.grade?.trim()) {
      ElMessage.error(`第 ${idx + 1} 个标准项等级不能为空`);
      return false;
    }
    if (!item.scoreRange?.trim()) {
      ElMessage.error(`第 ${idx + 1} 个标准项分数范围不能为空`);
      return false;
    }
    if (item.sortNo === null || item.sortNo === undefined) {
      ElMessage.error(`第 ${idx + 1} 个标准项排序不能为空`);
      return false;
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
  <div class="standard-item-manager">
    <div class="manager-header">
      <h4>标准项列表</h4>
      <el-button type="primary" size="small" @click="addItem">+ 新增标准项</el-button>
    </div>
    <div v-if="!items.length" class="empty-tip">暂无标准项，请点击“新增标准项”开始配置。</div>
    <el-table :data="items" border size="small" v-else>
      <el-table-column prop="grade" label="等级" min-width="150">
        <template #default="{ row }">
          <el-input v-model="row.grade" placeholder="等级名称" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="scoreRange" label="分数范围" min-width="120">
        <template #default="{ row }">
          <el-input v-model="row.scoreRange" placeholder="例如 90-100" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="sortNo" label="排序" width="100">
        <template #default="{ row }">
          <el-input-number
            v-model="row.sortNo"
            :min="1"
            placeholder="排序"
            size="small"
            controls-position="right"
            style="width: 100%"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ $index }">
          <el-button size="small" type="danger" @click="removeItem($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.standard-item-manager {
  margin-top: 20px;
}
.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.empty-tip {
  text-align: center;
  color: #909399;
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
}
</style>
