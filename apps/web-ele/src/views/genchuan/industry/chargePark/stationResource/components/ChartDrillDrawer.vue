<script setup>
import { nextTick, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

const drillInfo = reactive({
  chartType: '',
  field: '',
  label: '',
  metricValue: '',
  pageTitle: '',
  rowCount: '',
  rows: [],
  title: '',
  value: '',
});

const statusTypeMap = {
  正常: 'success',
  启用: 'success',
  已生效: 'success',
  已完成: 'success',
  已支付: 'success',
  待处理: 'warning',
  待支付: 'warning',
  未生效: 'warning',
  异常: 'danger',
  停用: 'danger',
  已禁用: 'danger',
};

function getDrawerTitle() {
  const chartName =
    {
      bar: '柱状图',
      line: '折线图',
      pie: '饼图',
    }[drillInfo.chartType] || '图表';
  const title = drillInfo.title || drillInfo.label || chartName;
  const value = drillInfo.value ? ` - ${drillInfo.value}` : '';
  return `${drillInfo.pageTitle || '场站资源'}${title}钻取明细${value}`;
}

function getGridColumns() {
  return [
    { type: 'seq', title: '序号', width: 60 },
    { field: 'name', title: '名称', minWidth: 180 },
    { field: 'category', title: '分类', minWidth: 140 },
    { field: 'value', title: '指标值', minWidth: 120, sortable: true },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    { field: 'statTime', title: '统计时间', minWidth: 170 },
    { field: 'remark', title: '说明', minWidth: 220 },
  ];
}

function getRowCount() {
  if (Array.isArray(drillInfo.rows) && drillInfo.rows.length > 0) {
    return drillInfo.rows.length;
  }

  const directValue = Number(drillInfo.rowCount);
  if (Number.isFinite(directValue) && directValue > 0) {
    return Math.min(Math.floor(directValue), 500);
  }

  const metricValue = Number(
    String(drillInfo.metricValue || '').replace('%', ''),
  );
  if (
    Number.isFinite(metricValue) &&
    metricValue > 0 &&
    !String(drillInfo.metricValue).includes('%')
  ) {
    return Math.min(Math.floor(metricValue), 500);
  }

  return 1;
}

function createRows() {
  const baseName = drillInfo.value || drillInfo.label || '图表数据';
  if (Array.isArray(drillInfo.rows) && drillInfo.rows.length > 0) {
    return drillInfo.rows.map((row, index) => {
      const no = index + 1;
      return {
        ...row,
        category:
          drillInfo.title || drillInfo.label || row.category || '统计维度',
        id: row.id || `${drillInfo.chartType}-${drillInfo.field}-${no}`,
        name:
          row.name ||
          row.stationName ||
          row.areaName ||
          row.date ||
          `${baseName}明细${String(no).padStart(2, '0')}`,
        remark:
          row.remark || `${drillInfo.pageTitle || '场站资源'}图表钻取数据`,
        statTime:
          row.statTime || row.date || row.createTime || row.updateTime || '--',
        status: row.status || row.statusName || '正常',
        value:
          row.value ??
          row.count ??
          row.total ??
          row[drillInfo.field] ??
          drillInfo.metricValue ??
          no,
      };
    });
  }

  return Array.from({ length: getRowCount() }, (_, index) => {
    const no = index + 1;
    return {
      id: `${drillInfo.chartType}-${drillInfo.field}-${no}`,
      category: drillInfo.title || drillInfo.label || '统计维度',
      name: `${baseName}明细${String(no).padStart(2, '0')}`,
      remark: `${drillInfo.pageTitle || '场站资源'}图表钻取数据`,
      statTime: `2026-05-${String((no % 28) + 1).padStart(2, '0')} 09:00:00`,
      status: ['正常', '已生效', '待处理', '异常'][index % 4],
      value: Number((no * 7 + (drillInfo.value?.length || 0)).toFixed(2)),
    };
  });
}

async function getTableData({ page }) {
  const list = createRows();
  const start = (page.currentPage - 1) * page.pageSize;
  const end = page.currentPage * page.pageSize;
  return {
    list: list.slice(start, end),
    total: list.length,
  };
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumns(),
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: getTableData,
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    showOverflow: true,
  },
  showSearchForm: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  class: 'w-[75vw]',
  footer: false,
  mask: false,
  modal: false,
});

async function open(info = {}) {
  Object.assign(drillInfo, {
    chartType: info.chartType || '',
    field: info.field || '',
    label: info.label || '',
    metricValue: info.metricValue ?? '',
    pageTitle: info.pageTitle || '',
    rowCount: info.rowCount ?? info.count ?? '',
    rows: Array.isArray(info.rows) ? info.rows : [],
    title: info.title || '',
    value: info.value || '',
  });
  drawerApi.setState({
    title: getDrawerTitle(),
  });
  await nextTick();
  gridApi.setGridOptions({ columns: getGridColumns() });
  drawerApi.open();
  nextTick(() => gridApi.query());
}

function getTagType(value) {
  return statusTypeMap[value] || 'info';
}

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <div class="chart-drill-drawer">
      <div class="chart-drill-summary">
        <ElTag type="primary">{{ drillInfo.chartType || 'chart' }}</ElTag>
        <span>{{ drillInfo.title || drillInfo.label }}</span>
        <span v-if="drillInfo.value">取值：{{ drillInfo.value }}</span>
      </div>
      <Grid>
        <template #status="{ row }">
          <ElTag :type="getTagType(row.status)">
            {{ row.status || '-' }}
          </ElTag>
        </template>
      </Grid>
    </div>
  </Drawer>
</template>

<style scoped>
.chart-drill-drawer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
}

.chart-drill-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

:deep(.vxe-grid) {
  flex: 1;
  min-height: 520px;
}
</style>
