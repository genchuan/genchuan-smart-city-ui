<script setup>
import { computed, reactive, watch } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

const props = defineProps({
  /** 唯一 key，切换 tab 时强制重挂载 */
  paneKey: {
    type: String,
    required: true,
  },
  /** 返回钻取专用 Vxe 列配置（无 slot） */
  useColumns: {
    type: Function,
    required: true,
  },
  /**
   * 拉取分页：(params) => Promise，params 含 pageNo/pageSize 及父级合并的查询条件
   */
  fetchPage: {
    type: Function,
    required: true,
  },
});

const dataObj = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
});

const gridColumns = computed(() => {
  const cols = props.useColumns?.() || [];
  return Array.isArray(cols) ? cols.filter(Boolean) : [];
});

/** 列须为普通数组：传入 ComputedRef 会在 cloneDeep/合并后破坏结构，触发 Vxe 内读 column.slots 报错 */
function getPlainColumns() {
  return gridColumns.value;
}

async function getTableData({ page }) {
  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;
  const { list, total } = await props.fetchPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  });
  dataObj.list = Array.isArray(list) ? list : [];
  dataObj.total = Number(total) || 0;
  return dataObj;
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getPlainColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: undefined,
    showOverflow: true,
  },
  showSearchForm: false,
});

watch(
  [() => props.paneKey, gridColumns],
  () => {
    gridApi.setGridOptions?.({ columns: getPlainColumns() });
    gridApi.reload();
  },
);

defineExpose({
  reload: () => gridApi.reload(),
});
</script>

<template>
  <div class="cycle-report-drill-grid-pane" :key="paneKey">
    <Grid />
  </div>
</template>

<style scoped>
.cycle-report-drill-grid-pane {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
</style>
