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
  // 新增 props
  remote: {
    // 是否远程分页
    type: Boolean,
    default: false,
  },
  pageSizes: {
    // 可选的每页条数
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  paginationLayout: {
    // 分页器布局
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  hideOnSinglePage: {
    // 只有一页时隐藏
    type: Boolean,
    default: false,
  },
  // 当前页和每页条数（支持受控模式）
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

// 监听 props 变化（支持受控模式）
watch(
  () => props.currentPageProp,
  (val) => {
    if (val !== undefined) {
      currentPage.value = val;
    }
  },
);

watch(
  () => props.pageSizeProp,
  (val) => {
    if (val !== undefined) {
      pageSize.value = val;
    }
  },
);

// 处理列定义
const processedColumns = computed(() => {
  return props.columns.map((col) => {
    return {
      align: 'center',
      sortable: false,
      ...col,
    };
  });
});

// 表格显示的数据
const tableData = computed(() => {
  if (!props.showPagination || props.remote) {
    // 远程分页时，直接使用传入的数据
    return props.data;
  }

  // 本地分页：计算分页数据
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return props.data.slice(start, end);
});

// 每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
  emitPageChange();
};

// 当前页变化
const handleCurrentChange = (page) => {
  currentPage.value = page;
  emitPageChange();
};

// 触发分页变化事件
const emitPageChange = () => {
  emit('page-change', {
    page: currentPage.value,
    pageSize: pageSize.value,
    total: props.total,
  });
};

// 排序变化
const handleSortChange = ({ column, prop, order }) => {
  emit('sort-change', { column, prop, order });
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
        <!-- 默认列定义 -->
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
              <!-- 自定义渲染 -->
              <template v-if="column.render">
                <component
                  :is="column.render.type || 'span'"
                  v-bind="column.render.props || {}"
                  v-on="column.render.events || {}"
                >
                  {{
                    column.render.text ? column.render.text(row, column) : ''
                  }}
                </component>
              </template>

              <!-- 默认格式化 -->
              <template v-else>
                <!-- 进度条类型 -->
                <template v-if="column.type === 'progress'">
                  <el-progress
                    :percentage="row[column.prop]"
                    :color="getUtilizationColor(row[column.prop])"
                    :show-text="false"
                  />
                  <span style="margin-left: 8px">{{ row[column.prop] }}%</span>
                </template>

                <!-- 标签类型 -->
                <template v-else-if="column.type === 'tag'">
                  <el-tag :type="column.tagType || 'primary'" size="small">
                    {{
                      column.formatter
                        ? column.formatter(row[column.prop], row, column)
                        : row[column.prop]
                    }}
                  </el-tag>
                </template>

                <!-- 货币类型 -->
                <template v-else-if="column.type === 'currency'">
                  {{ formatCurrency(row[column.prop]) }}
                </template>

                <!-- 百分比类型 -->
                <template v-else-if="column.type === 'percentage'">
                  {{ row[column.prop] }}%
                </template>

                <!-- 增长率类型 -->
                <template v-else-if="column.type === 'growth'">
                  <span :class="getGrowthClass(row[column.prop])">
                    <el-icon v-if="row[column.prop] > 0"><Top /></el-icon>
                    <el-icon v-if="row[column.prop] < 0"><Bottom /></el-icon>
                    {{ Math.abs(row[column.prop]) }}%
                  </span>
                </template>

                <!-- 默认类型 -->
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

    <!-- 分页器 -->
    <!-- 修改点：只依赖 showPagination 控制显示 -->
    <div v-if="showPagination" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
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
}

.growth-positive {
  color: #52c41a;
}

.growth-negative {
  color: #f5222d;
}
</style>
