<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElTag } from 'element-plus';

import { getAmountCheckChart, getAmountCheckPage } from '#/api/genchuan/industry/chargePark/orderTrade/refundMgmt/index.js';
import { useVbenDrawer } from '@vben/common-ui';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';

const statusMap = {
  pending: { label: '待核算', type: 'warning' },
  checked: { label: '已核算', type: 'info' },
  confirmed: { label: '已确认', type: 'success' },
};

const checkResultMap = {
  pass: { label: '通过', type: 'success' },
  fail: { label: '不通过', type: 'danger' },
};

const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

const getCheckResultLabel = (checkResult) => {
  return checkResultMap[checkResult]?.label || checkResult;
};

const getCheckResultType = (checkResult) => {
  return checkResultMap[checkResult]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '核算总数', value: 0, color: '#FF6B6B', status: null },
    { title: '核算准确率', value: 0, color: '#4ECDC4', suffix: '%', status: null },
  ],
  trendData: [],
});

const selectedDate = ref(null);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '金额核算列表';
    if (selectedDate.value) {
      title = `${selectedDate.value} ${title}`;
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

  if (selectedDate.value) {
    params.checkTimeStart = selectedDate.value + ' 00:00:00';
    params.checkTimeEnd = selectedDate.value + ' 23:59:59';
  }

  try {
    drawerDataObj.loading = true;
    const res = await getAmountCheckPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取金额核算列表失败:', error);
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

const handleCardClick = () => {
  drawerGridApi.query();
  drawerApi.open();
};

const handleLineChartClick = (params) => {
  console.log('折线图点击事件触发:', params);
  if (params && params.name) {
    selectedDate.value = params.name;
    drawerGridApi.query();
    drawerApi.open();
  }
};

const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'checkNo', title: '核算编号', width: 180 },
      { field: 'orderId', title: '关联订单ID', width: 120 },
      { field: 'applyAmount', title: '申请金额', width: 120 },
      { field: 'checkResult', title: '核算结果', width: 120,
        slots: { default: 'checkResult' }
      },
      { field: 'checkDetail', title: '核算明细', width: 180 },
      { field: 'status', title: '状态', width: 100,
        slots: { default: 'status' }
      },
      { field: 'creator', title: '创建者', width: 100 },
      { field: 'createTime', title: '创建时间', width: 180 },
      { field: 'updateTime', title: '更新时间', width: 180 },
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

const fetchOrderChartData = async () => {
  try {
    const res = await getAmountCheckChart();
    state.cardList[0].value = res.cardData?.totalCheckCount || res.totalCheckCount || 0;
    state.cardList[1].value = res.cardData?.checkAccuracy || res.checkAccuracy || 0;
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-27', count: 15 },
          ];
    updateLineChart();
  } catch (error) {
    console.error('获取金额核算图表数据失败:', error);
    state.cardList[0].value = 15;
    state.cardList[1].value = 66.7;
    state.trendData = [
      { date: '2026-04-27', count: 15 },
    ];
    updateLineChart();
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '金额核算趋势',
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
        name: '订单量',
        type: 'line',
        data: state.trendData.map((item) => item.count),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
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

const updateLineChart = () => {
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
  fetchOrderChartData().then(() => {
    initLineChart();
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
        @click="handleCardClick"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #checkResult="{ row }">
        <el-tag :type="getCheckResultType(row.checkResult)">
          {{ getCheckResultLabel(row.checkResult) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DrawerGrid>
  </Drawer>
</template>
