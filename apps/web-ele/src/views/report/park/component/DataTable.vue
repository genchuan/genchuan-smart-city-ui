<!-- 文件: DataTable.vue -->
<template>
  <div class="data-table-container">
    <!-- 表格 -->
    <el-table
      :data="tableData"
      :border="true"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%"
      :size="size"
      @sort-change="handleSortChange"
      :default-sort="defaultSort"
    >
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="70"
        align="center"
        :index="indexMethod"
      />

      <!-- 动态列 -->
      <template v-for="column in processedColumns" :key="column.prop">
        <!-- 自定义渲染列 -->
        <el-table-column
          v-if="column.render"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :fixed="column.fixed"
        >
          <template #default="{ row, $index }">
            <!-- 渲染不同类型的内容 -->
            <template v-if="typeof column.render === 'function'">
              <!-- 函数渲染 -->
              <template v-if="column.render(row, $index)">
                <span
                  v-if="column.render(row, $index).text !== undefined"
                  @click="column.render(row, $index).events?.click?.(row, $index)"
                  :style="column.render(row, $index).props?.style"
                  :class="column.render(row, $index).props?.class"
                >
                  {{ column.render(row, $index).text }}
                </span>

                <!-- 复杂渲染（按钮组等） -->
                <div v-else-if="column.render(row, $index).children">
                  <component
                    v-for="(child, idx) in column.render(row, $index).children"
                    :key="idx"
                    :is="child.type || 'span'"
                    v-bind="child.props || {}"
                    @click="child.props?.onClick?.(row, $index)"
                  >
                    {{ child.text || '' }}
                  </component>
                </div>
              </template>
            </template>
          </template>
        </el-table-column>

        <!-- 类型列（货币、日期等） -->
        <el-table-column
          v-else-if="column.type"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :fixed="column.fixed"
        >
          <template #default="{ row }">
            <!-- 货币类型 -->
            <span v-if="column.type === 'currency'">
              {{ formatCurrency(row[column.prop]) }}
            </span>

            <!-- 日期时间类型 -->
            <span v-else-if="column.type === 'datetime'">
              {{ formatDateTime(row[column.prop]) }}
            </span>

            <!-- 标签类型 -->
            <el-tag
              v-else-if="column.type === 'tag'"
              :type="getTagType(row[column.prop])"
              size="small"
            >
              {{ row[column.prop] }}
            </el-tag>

            <!-- 状态类型 -->
            <span
              v-else-if="column.type === 'status'"
              :style="{ color: getStatusColor(row[column.prop]) }"
            >
              {{ row[column.prop] }}
            </span>
          </template>
        </el-table-column>

        <!-- 普通文本列 -->
        <el-table-column
          v-else
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :fixed="column.fixed"
        />
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { formatCurrency, formatDateTime } from './ReportUtils';

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },

  // 列定义
  columns: {
    type: Array,
    required: true
  },

  // 是否显示序号列
  showIndex: {
    type: Boolean,
    default: false
  },

  // 分页相关
  showPagination: {
    type: Boolean,
    default: true
  },
  total: {
    type: Number,
    default: 0
  },
  currentPageProp: {
    type: Number,
    default: 1
  },
  pageSizeProp: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  hideOnSinglePage: {
    type: Boolean,
    default: false
  },

  // 远程分页
  remote: {
    type: Boolean,
    default: false
  },

  // 表格大小
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'large', 'small'].includes(value)
  },

  // 默认排序
  defaultSort: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([
  'page-change',
  'sort-change',
  'row-click'
]);

// 响应式数据
const currentPage = ref(props.currentPageProp);
const pageSize = ref(props.pageSizeProp);

// 计算属性
const tableData = computed(() => {
  if (!props.remote && props.showPagination) {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return props.data.slice(start, end);
  }
  return props.data;
});

const processedColumns = computed(() => {
  return props.columns.filter(col => !col.hidden);
});

// 序号计算方法
const indexMethod = (index) => {
  if (props.showPagination) {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  }
  return index + 1;
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
  emitPageChange();
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  emitPageChange();
};

const emitPageChange = () => {
  emit('page-change', {
    page: currentPage.value,
    pageSize: pageSize.value,
    total: props.total
  });
};

// 排序处理
const handleSortChange = ({ column, prop, order }) => {
  emit('sort-change', { column, prop, order });
};

// 状态颜色映射
const getStatusColor = (status) => {
  const colorMap = {
    '待处理': '#f5222d',
    '处理中': '#fa8c16',
    '已处理': '#52c41a',
    '已关闭': '#8c8c8c',
    '待追缴': '#f5222d',
    '追缴中': '#fa8c16',
    '已追缴': '#52c41a',
    '已豁免': '#722ed1',
    '待处置': '#f5222d',
    '处置中': '#fa8c16',
    '已处理': '#52c41a',
    '处置失败': '#8c8c8c'
  };
  return colorMap[status] || '#8c8c8c';
};

// 标签类型映射
const getTagType = (value) => {
  const typeMap = {
    '紧急': 'danger',
    '高': 'warning',
    '中': 'primary',
    '低': 'success',
    '一级逃费': 'danger',
    '二级逃费': 'warning',
    '三级逃费': 'primary',
    '四级逃费': 'success'
  };
  return typeMap[value] || 'info';
};

// 监听props变化
watch(() => props.currentPageProp, (val) => {
  currentPage.value = val;
});

watch(() => props.pageSizeProp, (val) => {
  pageSize.value = val;
});
</script>

<style scoped>
.data-table-container {
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 12px 0;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #333;
  font-weight: 600;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>
