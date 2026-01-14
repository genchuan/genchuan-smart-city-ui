<script setup>
import { computed, ref, watch } from 'vue';
import { Bottom, Top } from '@element-plus/icons-vue';
import {
  formatCurrency,
  getGrowthClass,
  getUtilizationColor,
} from '#/views/report/park/component/ReportUtils.js';

const props = defineProps({
  title: String,
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  border: {
    type: Boolean,
    default: true,
  },
  stripe: {
    type: Boolean,
    default: true,
  },
  height: [String, Number],
  maxHeight: [String, Number],
  loading: {
    type: Boolean,
    default: false,
  },
  showPagination: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  hideOnSinglePage: {
    type: Boolean,
    default: false,
  },
  currentPageProp: {
    type: Number,
    default: 1,
  },
  pageSizeProp: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(['page-change', 'sort-change']);

const currentPage = ref(props.currentPageProp || 1);
const pageSize = ref(props.pageSizeProp || 10);

// 监听父组件传入的分页参数变化
watch(
  () => props.currentPageProp,
  (val) => {
    if (val !== undefined && val !== currentPage.value) {
      currentPage.value = val;
    }
  },
);

watch(
  () => props.pageSizeProp,
  (val) => {
    if (val !== undefined && val !== pageSize.value) {
      pageSize.value = val;
    }
  },
);

const processedColumns = computed(() => {
  return props.columns.map((col) => {
    return {
      align: 'center',
      sortable: false,
      ...col,
    };
  });
});

// 修复：tableData 计算属性
const tableData = computed(() => {
  // 如果不显示分页，直接返回数据
  if (!props.showPagination) {
    return props.data;
  }

  // 如果是远程分页，直接返回数据（由后端分页）
  if (props.remote) {
    return props.data;
  }

  // 本地分页，进行切片
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return props.data.slice(start, end);
});

// 修复：totalCount 计算属性
const totalCount = computed(() => {
  if (props.showPagination && props.remote) {
    return props.total;
  }
  return props.data.length;
});

const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 切换每页条数时回到第一页
  emitPageChange();
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  emitPageChange();
};

const emitPageChange = () => {
  if (props.showPagination) {
    emit('page-change', {
      page: currentPage.value,
      pageSize: pageSize.value,
      total: totalCount.value,
    });
  }
};

const handleSortChange = ({ column, prop, order }) => {
  emit('sort-change', { column, prop, order });
};

const renderContent = (column, row) => {
  if (!column.render) return null;

  if (typeof column.render.text === 'function') {
    return column.render.text(row, column);
  } else if (column.render.text !== undefined) {
    return column.render.text;
  }

  return '';
};
</script>

<template>
  <div class="data-table">
    <h3 v-if="title" class="section-title">{{ title }}</h3>

    <el-table
      v-loading="loading"
      :data="tableData"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <slot>
        <template v-for="column in processedColumns" :key="column.prop">
          <el-table-column
            v-if="!column.hidden"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align || 'center'"
            :sortable="column.sortable"
          >
            <template #default="{ row, $index }">
              <template v-if="column.render">
                <component
                  :is="column.render.type || 'span'"
                  v-bind="column.render.props || {}"
                  v-on="column.render.events || {}"
                >
                  {{ renderContent(column, row) }}
                </component>
              </template>

              <template v-else>
                <template v-if="column.type === 'progress'">
                  <el-progress
                    :percentage="row[column.prop]"
                    :color="getUtilizationColor(row[column.prop])"
                    :show-text="false"
                  />
                  <span style="margin-left: 8px">{{ row[column.prop] }}%</span>
                </template>

                <template v-else-if="column.type === 'tag'">
                  <el-tag :type="column.tagType || 'primary'" size="small">
                    {{
                      column.formatter
                        ? column.formatter(row[column.prop], row, column)
                        : row[column.prop]
                    }}
                  </el-tag>
                </template>

                <template v-else-if="column.type === 'currency'">
                  {{ formatCurrency(row[column.prop]) }}
                </template>

                <template v-else-if="column.type === 'percentage'">
                  {{ row[column.prop] }}%
                </template>

                <template v-else-if="column.type === 'growth'">
                  <span :class="getGrowthClass(row[column.prop])">
                    <el-icon v-if="row[column.prop] > 0"><Top /></el-icon>
                    <el-icon v-if="row[column.prop] < 0"><Bottom /></el-icon>
                    {{ Math.abs(row[column.prop]) }}%
                  </span>
                </template>

                <template v-else>
                  {{
                    column.formatter
                      ? column.formatter(row[column.prop], row, column)
                      : row[column.prop]
                  }}
                </template>
              </template>
            </template>
          </el-table-column>
        </template>
      </slot>
    </el-table>

    <!-- 分页器容器，确保始终可见 -->
    <div v-if="showPagination" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="totalCount"
        :layout="paginationLayout"
        :hide-on-single-page="hideOnSinglePage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
.data-table {
  position: relative;
  min-height: 200px;
  margin-top: 12px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  padding: 12px 0;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
  position: relative;
  z-index: 10;
}

.growth-positive {
  color: #52c41a;
}

.growth-negative {
  color: #f5222d;
}

:deep(.el-pagination) {
  padding: 0;
}

:deep(.el-table) {
  overflow: visible;
}

:deep(.el-table) {
  margin-bottom: 0 !important;
}

:deep(.el-table__body-wrapper) {
  min-height: 150px;
}

:deep(.el-pagination__total) {
  margin-right: 20px;
}

:deep(.el-pagination__jump) {
  margin-left: 20px;
}
</style>
