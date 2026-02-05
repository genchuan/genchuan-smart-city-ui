<!-- [file name]: DataTable.vue -->
<template>
  <div class="data-table-container">
    <!-- 表格 -->
    <el-table
      ref="tableRef"
      :data="tableData"
      :border="true"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%"
      :size="tableSize"
      @sort-change="handleSortChange"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :max-height="maxHeight"
      @row-click="handleRowClick"
      :key="tableKey"
    >
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        :width="getColumnWidth('index')"
        align="center"
        :index="indexMethod"
        :fixed="mobileLayout ? false : 'left'"
        :show-overflow-tooltip="false"
      />

      <!-- 动态列 -->
      <template v-for="column in visibleColumns" :key="column.prop">
        <!-- 自定义渲染列 -->
        <el-table-column
          v-if="column.render"
          :prop="column.prop"
          :label="column.label"
          :width="getColumnWidth(column)"
          :min-width="getColumnMinWidth(column)"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :fixed="getColumnFixed(column)"
          :show-overflow-tooltip="column.showTooltip !== false"
          :class-name="getColumnClassName(column)"
        >
          <template #default="{ row, $index }">
            <!-- 渲染不同类型的内容 -->
            <template v-if="typeof column.render === 'function'">
              <template v-if="column.render(row, $index)">
                <span
                  v-if="column.render(row, $index).text !== undefined"
                  @click="column.render(row, $index).events?.click?.(row, $index)"
                  :style="column.render(row, $index).props?.style"
                  :class="column.render(row, $index).props?.class"
                  class="cell-content"
                >
                  {{ column.render(row, $index).text }}
                </span>

                <!-- 复杂渲染（按钮组等） -->
                <div v-else-if="column.render(row, $index).children" class="action-buttons">
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
          :width="getColumnWidth(column)"
          :min-width="getColumnMinWidth(column)"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :fixed="getColumnFixed(column)"
          :show-overflow-tooltip="column.showTooltip !== false"
          :class-name="getColumnClassName(column)"
        >
          <template #default="{ row }">
            <!-- 货币类型 -->
            <span v-if="column.type === 'currency'" class="cell-content">
              {{ formatCurrency(row[column.prop]) }}
            </span>

            <!-- 日期时间类型 -->
            <span v-else-if="column.type === 'datetime'" class="cell-content">
              {{ formatDateTime(row[column.prop]) }}
            </span>

            <!-- 标签类型 -->
            <el-tag
              v-else-if="column.type === 'tag'"
              :type="getTagType(row[column.prop])"
              :size="mobileLayout ? 'small' : 'default'"
              class="tag-cell"
            >
              {{ row[column.prop] }}
            </el-tag>

            <!-- 状态类型 -->
            <span
              v-else-if="column.type === 'status'"
              class="cell-content status-cell"
              :style="{ color: getStatusColor(row[column.prop]) }"
            >
              {{ row[column.prop] }}
            </span>

            <!-- 百分比类型 -->
            <span v-else-if="column.type === 'percentage'" class="cell-content">
              {{ row[column.prop] }}%
            </span>

            <!-- 进度条类型 -->
            <div v-else-if="column.type === 'progress'" class="cell-content">
              <el-progress
                :percentage="row[column.prop]"
                :stroke-width="6"
                :show-text="false"
              />
              <span class="progress-text">{{ row[column.prop] }}%</span>
            </div>

            <!-- 增长率类型 -->
            <span v-else-if="column.type === 'growth'" class="cell-content">
              <span :class="getGrowthClass(row[column.prop])">
                {{ row[column.prop] > 0 ? '+' : '' }}{{ row[column.prop] }}%
              </span>
            </span>

            <!-- 默认文本 -->
            <span v-else class="cell-content">
              {{ row[column.prop] }}
            </span>
          </template>
        </el-table-column>

        <!-- 普通文本列 -->
        <el-table-column
          v-else
          :prop="column.prop"
          :label="column.label"
          :width="getColumnWidth(column)"
          :min-width="getColumnMinWidth(column)"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :fixed="getColumnFixed(column)"
          :show-overflow-tooltip="column.showTooltip !== false"
          :class-name="getColumnClassName(column)"
        >
          <template #default="{ row }">
            <span class="cell-content">{{ row[column.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination && total > 0" class="pagination-container">
      <div class="pagination-info">
        <span class="total-info">共 {{ total }} 条</span>
        <span class="page-info" v-if="!mobileLayout">
          第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
        </span>
      </div>
      <div class="pagination-controls">
        <el-select
          v-model="pageSize"
          @change="handleSizeChange"
          size="small"
          class="page-size-select"
          v-if="!mobileLayout"
        >
          <el-option
            v-for="size in pageSizes"
            :key="size"
            :label="`${size} 条/页`"
            :value="size"
          />
        </el-select>
        <el-pagination
          v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="getPaginationLayout()"
        :total="total"
        :small="mobileLayout"
        :pager-count="getPagerCount()"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="responsive-pagination"
        :background="true"
        :disabled="total === 0"
        />
      </div>
    </div>

    <!-- 无数据提示 -->
    <div v-if="tableData.length === 0" class="empty-data">
      <el-empty :description="emptyText" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
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
  currentPage: { // 修复：props 命名统一为 currentPage（原 currentPageProp 易混淆）
    type: Number,
    default: 1
  },
  pageSize: { // 修复：props 命名统一为 pageSize（原 pageSizeProp 易混淆）
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
  },

  // 是否启用响应式布局
  responsive: {
    type: Boolean,
    default: true
  },

  // 表格最大高度
  maxHeight: {
    type: [String, Number],
    default: null
  },

  // 空数据提示
  emptyText: {
    type: String,
    default: '暂无数据'
  },

  // 列宽模式
  columnMode: {
    type: String,
    default: 'auto', // 'auto' | 'fixed' | 'responsive'
    validator: (value) => ['auto', 'fixed', 'responsive'].includes(value)
  },

  // 移动端列隐藏规则
  mobileColumns: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits([
  'page-change',
  'sort-change',
  'row-click',
  'update:currentPage', // 修复：保持 v-model 规范的 update 事件
  'update:pageSize'
]);

// 响应式数据（修复：从 props 初始化，保持双向绑定一致性）
const tableRef = ref(null);
const currentPage = ref(props.currentPage);
const pageSize = ref(props.pageSize);
const mobileLayout = ref(false);
const screenWidth = ref(window.innerWidth);
const containerWidth = ref(0);
const tableKey = ref(Date.now());

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

// 根据响应式规则显示列
const visibleColumns = computed(() => {
  if (!props.responsive || !mobileLayout.value) {
    return processedColumns.value;
  }

  // 移动端隐藏列规则
  return processedColumns.value.filter(column => {
    // 如果指定了移动端列规则
    if (props.mobileColumns && props.mobileColumns.length > 0) {
      return props.mobileColumns.includes(column.prop) || column.alwaysShow;
    }

    // 默认规则：隐藏宽列和复杂列
    if (column.hideOnMobile || column.width > 180) {
      return false;
    }

    // 显示操作列和关键信息列
    if (column.prop === 'actions' || column.prop === 'carNumber' || column.prop === 'amount') {
      return true;
    }

    return column.showOnMobile !== false;
  });
});

const tableSize = computed(() => {
  if (mobileLayout.value) return 'small';
  return props.size;
});

// 序号计算方法
const indexMethod = (index) => {
  if (props.showPagination) {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  }
  return index + 1;
};

// 响应式分页布局（修复：确保桌面端显示 jumper，保证手动输入页码跳转）
const getPaginationLayout = () => {
  if (!props.responsive) return props.paginationLayout;

  if (mobileLayout.value) {
    return 'prev, pager, next'; // 移动端仅保留基础翻页
  } else if (screenWidth.value < 1024) {
    return 'total, sizes, prev, pager, next'; // 平板隐藏 jumper
  } else {
    return props.paginationLayout; // 桌面端显示完整布局（含 jumper）
  }
};

// 获取页码器数量
const getPagerCount = () => {
  if (mobileLayout.value) {
    // 移动端显示更少的页码
    return screenWidth.value < 480 ? 3 : 5;
  } else if (screenWidth.value < 1024) {
    return 5;
  } else {
    return 7;
  }
};

// 列宽计算
const getColumnWidth = (column) => {
  if (typeof column === 'string') {
    // 序号列特殊处理
    if (column === 'index') {
      return mobileLayout.value ? '60px' : '70px';
    }
    return null;
  }

  if (props.columnMode === 'responsive' && mobileLayout.value) {
    return column.mobileWidth || column.width || null;
  }

  return column.width || null;
};

const getColumnMinWidth = (column) => {
  if (typeof column === 'string') return null;

  if (props.columnMode === 'responsive' && mobileLayout.value) {
    return column.mobileMinWidth || '80px';
  }

  return column.minWidth || (props.columnMode === 'auto' ? null : '120px');
};

const getColumnFixed = (column) => {
  if (typeof column === 'string') return false;

  if (mobileLayout.value) {
    // 移动端只固定操作列
    return column.prop === 'actions' ? 'right' : false;
  }

  return column.fixed || false;
};

const getColumnClassName = (column) => {
  if (typeof column === 'string') return '';

  const classNames = [];
  if (mobileLayout.value && column.hideOnMobile) {
    classNames.push('mobile-hidden');
  }
  if (column.className) {
    classNames.push(column.className);
  }
  return classNames.join(' ');
};

// 分页处理（核心修复：页码切换逻辑）
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 切换页大小时重置为第一页
  emitPageChange();
};

const handleCurrentChange = (page) => {
  // 校验页码合法性，避免越界
  const maxPage = Math.ceil(props.total / pageSize.value) || 1;
  const validPage = Math.max(1, Math.min(page, maxPage));
  if (validPage !== currentPage.value) {
    currentPage.value = validPage;
  }
  emitPageChange();
};

// 统一触发分页变更事件
const emitPageChange = () => {
  // 触发 v-model 规范的 update 事件
  emit('update:currentPage', currentPage.value);
  emit('update:pageSize', pageSize.value);
  // 触发业务级 page-change 事件
  emit('page-change', {
    page: currentPage.value,
    pageSize: pageSize.value,
    total: props.total
  });
};

// 监听 props 变化（修复：深度监听，确保父组件传值更新时同步）
watch(() => props.currentPage, (val) => {
  if (val !== currentPage.value) {
    currentPage.value = val;
  }
}, { immediate: true });

watch(() => props.pageSize, (val) => {
  if (val !== pageSize.value) {
    pageSize.value = val;
  }
}, { immediate: true });

// 排序处理
const handleSortChange = ({ column, prop, order }) => {
  emit('sort-change', { column, prop, order });
};

// 行点击
const handleRowClick = (row, column, event) => {
  emit('row-click', row, column, event);
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

// 增长率颜色
const getGrowthClass = (growth) => {
  return growth > 0 ? 'growth-positive' : growth < 0 ? 'growth-negative' : '';
};

// 行样式
const tableRowClassName = ({ rowIndex }) => {
  if (rowIndex % 2 === 1) {
    return 'even-row';
  }
  return '';
};

const tableCellClassName = ({ columnIndex }) => {
  if (mobileLayout.value && columnIndex > 2) {
    return 'mobile-cell-compact';
  }
  return '';
};

// 监听屏幕宽度变化
const handleResize = () => {
  screenWidth.value = window.innerWidth;
  mobileLayout.value = screenWidth.value < 768;
  tableKey.value = Date.now(); // 强制表格重新渲染

  // 计算容器宽度
  if (tableRef.value && tableRef.value.$el) {
    containerWidth.value = tableRef.value.$el.offsetWidth;
  }
};

// 初始化
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);

  // 计算容器宽度
  nextTick(() => {
    if (tableRef.value && tableRef.value.$el) {
      containerWidth.value = tableRef.value.$el.offsetWidth;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 导出方法
defineExpose({
  refreshTable: () => {
    if (tableRef.value) {
      tableKey.value = Date.now();
    }
  },
  scrollToTop: () => {
    if (tableRef.value && tableRef.value.$el) {
      const scrollWrapper = tableRef.value.$el.querySelector('.el-table__body-wrapper');
      if (scrollWrapper) {
        scrollWrapper.scrollTop = 0;
      }
    }
  },
  // 跳转到指定页（增强：支持外部调用）
  goToPage: (page) => {
    const maxPage = Math.ceil(props.total / pageSize.value) || 1;
    if (page >= 1 && page <= maxPage) {
      currentPage.value = page;
      emitPageChange();
    }
  },
  // 重置分页（新增：方便列表刷新后重置页码）
  resetPagination: () => {
    currentPage.value = 1;
    pageSize.value = props.pageSizes[0] || 10;
    emitPageChange();
  }
});
</script>

<style scoped>
.data-table-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  gap: 12px;
}

@media (min-width: 768px) {
  .pagination-container {
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
  }
}

.pagination-info {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .pagination-controls {
    width: auto;
    justify-content: flex-end;
  }
}

.page-size-select {
  width: 120px;
}

.responsive-pagination {
  display: flex;
  justify-content: center;
  width: 100%;
}

@media (min-width: 768px) {
  .responsive-pagination {
    width: auto;
  }
}

.cell-content {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5;
  vertical-align: middle;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.tag-cell {
  margin: 2px;
  white-space: nowrap;
}

.status-cell {
  font-weight: 500;
}

.empty-data {
  padding: 40px 20px;
  text-align: center;
  background: #fff;
  border-radius: 4px;
}

.progress-text {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.growth-positive {
  color: #52c41a;
  font-weight: 500;
}

.growth-negative {
  color: #f5222d;
  font-weight: 500;
}

/* 移动端样式 */
@media (max-width: 767px) {
  :deep(.el-table) {
    font-size: 12px;
  }

  :deep(.el-table th) {
    padding: 8px 4px;
    font-size: 12px;
  }

  :deep(.el-table td) {
    padding: 8px 4px;
  }

  :deep(.el-table .cell) {
    padding: 0 4px;
    line-height: 1.4;
  }

  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    display: none !important;
  }

  :deep(.el-pagination__sizes) {
    display: none !important;
  }

  :deep(.el-pagination__prev),
  :deep(.el-pagination__next),
  :deep(.el-pagination .btn-prev),
  :deep(.el-pagination .btn-next) {
    min-width: 32px;
    height: 32px;
    margin: 0 4px;
    padding: 0 8px;
  }

  :deep(.el-pager li) {
    min-width: 32px;
    height: 32px;
    margin: 0 2px;
    line-height: 30px;
    font-size: 12px;
  }

  :deep(.el-pager li.active) {
    color: #409eff;
    font-weight: bold;
    background-color: #f5f7fa;
    border-radius: 4px;
  }

  :deep(.el-pager li:hover) {
    color: #409eff;
    cursor: pointer;
  }

  :deep(.el-pager li.active:hover) {
    background-color: #ecf5ff;
  }

  .pagination-info {
    font-size: 12px;
  }

  .mobile-cell-compact {
    padding: 6px 2px !important;
  }

  .action-buttons {
    gap: 4px;
  }

  :deep(.el-button) {
    padding: 4px 8px;
    font-size: 12px;
  }
}

/* 平板样式 */
@media (min-width: 768px) and (max-width: 1023px) {
  :deep(.el-table) {
    font-size: 13px;
  }

  :deep(.el-pagination__jump) {
    display: none !important;
  }

  :deep(.el-pagination .btn-prev),
  :deep(.el-pagination .btn-next) {
    min-width: 32px;
    height: 32px;
  }

  :deep(.el-pager li) {
    min-width: 32px;
    height: 32px;
    line-height: 30px;
    font-size: 13px;
  }

  :deep(.el-pager li:hover) {
    color: #409eff;
    cursor: pointer;
  }

  .pagination-info {
    font-size: 13px;
  }
}

/* 桌面样式 */
@media (min-width: 1024px) {
  :deep(.el-table) {
    font-size: 14px;
  }

  :deep(.el-pagination .btn-prev),
  :deep(.el-pagination .btn-next) {
    min-width: 32px;
    height: 32px;
  }

  :deep(.el-pager li) {
    min-width: 32px;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
  }

  :deep(.el-pager li:hover) {
    color: #409eff;
    cursor: pointer;
  }
}

:deep(.el-table) {
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #333;
  font-weight: 600;
  white-space: nowrap;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

:deep(.el-table--scrollable-x .el-table__body-wrapper) {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

:deep(.el-table__fixed) {
  z-index: 2;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

/* 表格行高度调整 */
:deep(.el-table .cell) {
  line-height: 1.5;
  padding: 12px 10px;
}

@media (max-width: 767px) {
  :deep(.el-table .cell) {
    padding: 8px 6px;
  }
}

/* 分页按钮样式优化 */
:deep(.el-pagination button),
:deep(.el-pagination span:not([class*=suffix])) {
  font-size: 14px;
}

:deep(.el-pagination.is-background .btn-next),
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .el-pager li) {
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.el-pagination.is-background .btn-next:hover),
:deep(.el-pagination.is-background .btn-prev:hover),
:deep(.el-pagination.is-background .el-pager li:hover) {
  background-color: #f0f2f5;
  transform: translateY(-1px);
}

:deep(.el-pagination.is-background .el-pager li.active) {
  background-color: #409eff !important;
  color: #fff;
  font-weight: bold;
}

:deep(.el-pagination.is-background .el-pager li.active:hover) {
  background-color: #66b1ff !important;
}

/* 小屏幕分页按钮优化 */
@media (max-width: 480px) {
  :deep(.el-pagination__prev),
  :deep(.el-pagination__next),
  :deep(.el-pagination .btn-prev),
  :deep(.el-pagination .btn-next) {
    min-width: 28px !important;
    height: 28px !important;
    margin: 0 2px !important;
    padding: 0 6px !important;
  }

  :deep(.el-pager li) {
    min-width: 28px !important;
    height: 28px !important;
    line-height: 26px !important;
    font-size: 11px !important;
    margin: 0 1px !important;
  }

  :deep(.el-pager li:hover) {
    color: #409eff;
    cursor: pointer;
  }
}

/* 滚动条样式优化 */
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 4px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

/* 偶数行背景色 */
.even-row {
  background-color: #fafafa;
}

/* 选中行样式 */
:deep(.el-table__row--current) {
  background-color: #f0f9ff !important;
}

/* 表格头固定时的阴影 */
:deep(.el-table--scrollable-y .el-table__fixed-right) {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-table--scrollable-y .el-table__fixed-left) {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

/* 分页按钮点击效果 */
:deep(.el-pagination button:active),
:deep(.el-pagination .btn-prev:active),
:deep(.el-pagination .btn-next:active) {
  transform: translateY(1px);
}

/* 禁用状态的分页按钮 */
:deep(.el-pagination button.is-disabled),
:deep(.el-pagination .btn-prev.is-disabled),
:deep(.el-pagination .btn-next.is-disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 页码选择器样式 */
:deep(.el-pagination .el-select) {
  margin: 0 8px;
}

:deep(.el-pagination .el-select .el-input__wrapper) {
  padding: 1px 15px;
}

/* 分页信息样式 */
.total-info {
  color: #303133;
  font-weight: 500;
}

.page-info {
  color: #606266;
}

/* 分页容器动画 */
.pagination-container {
  transition: all 0.3s ease;
}

.pagination-container:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 修复页码按钮无法点击的问题 */
:deep(.el-pager li) {
  cursor: pointer !important;
  user-select: none;
}

:deep(.el-pager li:not(.active):not(.disabled):hover) {
  color: #409eff !important;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  cursor: pointer !important;
}

:deep(.el-pagination .btn-prev:not(.disabled):hover),
:deep(.el-pagination .btn-next:not(.disabled):hover) {
  color: #409eff !important;
}

/* 确保页码按钮有足够的点击区域 */
:deep(.el-pagination .el-pager) {
  margin: 0;
  padding: 0;
}

:deep(.el-pagination .el-pager li) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 修复移动端页码按钮过小的问题 */
@media (max-width: 767px) {
  :deep(.el-pagination .el-pager li) {
    min-width: 30px !important;
    height: 30px !important;
    line-height: 28px !important;
  }
}
</style>
