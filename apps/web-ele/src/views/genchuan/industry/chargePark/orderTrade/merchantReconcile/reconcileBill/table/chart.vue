<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElTag } from 'element-plus';

import { getReconcileBillChart, getReconcileBillListPage } from '#/api/genchuan/industry/chargePark/orderTrade/merchantReconcile/index.js';
import { useVbenDrawer } from '@vben/common-ui';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';

const statusMap = {
  pending: { label: '待对账', type: 'warning' },
  reconciled: { label: '已对账', type: 'success' },
  abnormal: { label: '异常', type: 'danger' },
};

const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '待对账数', value: 0, color: '#FF6B6B', status: 'pending' },
    { title: '异常数', value: 0, color: '#E74C3C', status: 'abnormal' },
    { title: '已确认数', value: 0, color: '#13ce66', status: 'reconciled' },
    { title: '确认率', value: 0, color: '#4A90E2', suffix: '%', status: null },
  ],
  trendData: [],
});

const selectedStatus = ref(null);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '对账单列表';
    if (selectedStatus.value) {
      title = `${statusMap[selectedStatus.value]?.label || selectedStatus.value} ${title}`;
    }
    return title;
  }),
  class: 'genchuan-detail-drawer',
  onCancel() {
    drawerApi.close();
  },
});

const drawerDataObj = reactive({
  total: 0,
  list: [],
  loading: false,
});

const getDrawerTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getReconcileBillListPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        confirmTime: formatTimestamp(v.confirmTime),
        createTime: formatTimestamp(v.createTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取对账单列表失败:', error);
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

const handleCardClick = (status) => {
  selectedStatus.value = status;
  drawerGridApi.query();
  drawerApi.open();
};

const handleLineChartClick = (params) => {
  console.log('折线图点击事件触发:', params);
  if (params && params.name) {
    selectedStatus.value = null;
    drawerGridApi.query();
    drawerApi.open();
  }
};

const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'billNo', title: '对账单号', width: 180 },
      { field: 'merchantName', title: '商户名称', width: 160 },
      { field: 'billDate', title: '对账日期', width: 120 },
      { field: 'sysAmount', title: '系统订单总金额', width: 140 },
      { field: 'merchantAmount', title: '商户上报总金额', width: 140 },
      { field: 'diffAmount', title: '差异金额', width: 120 },
      { field: 'status', title: '对账状态', width: 120,
        slots: { default: 'status' }
      },
      { field: 'remark', title: '备注', width: 200 },
      { field: 'confirmTime', title: '确认时间', width: 180 },
      { field: 'createTime', title: '创建时间', width: 180 },
    ],
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getDrawerTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: drawerDataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
    },
    showOverflow: true,
  },
  showSearchForm: false,
});

const lineChartRef = ref(null);
let lineChartInstance = null;

const fetchReconcileBillChartData = async () => {
  try {
    const res = await getReconcileBillChart();
    state.cardList[0].value = res.cardData?.pendingCount || res.pendingCount || 0;
    state.cardList[1].value = res.cardData?.disputedCount || res.disputedCount || 0;
    state.cardList[2].value = res.cardData?.confirmedCount || res.confirmedCount || 0;
    state.cardList[3].value = res.cardData?.confirmRate || res.confirmRate || 0;
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-27', count: 10 },
          ];
    updateChart();
  } catch (error) {
    console.error('获取对账单图表数据失败:', error);
    state.cardList[0].value = 1;
    state.cardList[1].value = 0;
    state.cardList[2].value = 0;
    state.cardList[3].value = 0;
    state.trendData = [
      { date: '2026-04-27', count: 10 },
    ];
    updateChart();
  }
};

const initChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '对账趋势',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: state.trendData.map((item) => item.date),
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series: [
      {
        name: '对账数',
        type: 'line',
        smooth: true,
        data: state.trendData.map((item) => item.count),
        lineStyle: { color: '#4A90E2', width: 2 },
        itemStyle: { color: '#4A90E2' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
            { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
          ]),
        },
      },
    ],
  };

  lineChartInstance.setOption(option);

  lineChartInstance.on('click', (params) => {
    handleLineChartClick(params);
  });
};

const updateChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.trendData.map((item) => item.date),
    },
    series: [
      {
        data: state.trendData.map((item) => item.count),
      },
    ],
  });
};

onMounted(() => {
  fetchReconcileBillChartData().then(() => {
    initChart();
  });

  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
  });
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <Card
        class="left-card cursor-pointer"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick(item.status)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DrawerGrid>
  </Drawer>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: hsl(var(--card));
  border-radius: 8px;
}

.chart-box-left {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  grid-template-rows: repeat(2, 1fr) !important;
  gap: 16px !important;
  flex-shrink: 0;
  width: 40%;
  max-width: 400px;
}

.chart-box-left :deep(.left-card) {
  width: 100% !important;
  flex-shrink: 0;
}

.chart-box-left :deep(.stat-card) {
  width: 100% !important;
  height: 150px !important;
  min-width: unset !important;
  max-width: unset !important;
}

.simple-bar-chart {
  width: 100%;
  height: 200px;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}
</style>
