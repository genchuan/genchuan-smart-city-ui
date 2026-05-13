<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElTag } from 'element-plus';

import { getReconcileRecordChart, getReconcileRecordListPage } from '#/api/genchuan/industry/chargePark/orderTrade/merchantReconcile/index.js';
import { useVbenDrawer } from '@vben/common-ui';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';

const matchResultMap = {
  matched: { label: '已匹配', type: 'success' },
  unmatched: { label: '未匹配', type: 'danger' },
  partial: { label: '部分匹配', type: 'warning' },
};

const getMatchResultLabel = (matchResult) => {
  return matchResultMap[matchResult]?.label || matchResult;
};

const getMatchResultType = (matchResult) => {
  return matchResultMap[matchResult]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '未匹配数', value: 0, color: '#FF6B6B', matchResult: 'unmatched' },
    { title: '总记录数', value: 0, color: '#4ECDC4', matchResult: null },
  ],
  trendData: [],
});

const selectedMatchResult = ref(null);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '对账记录列表';
    if (selectedMatchResult.value) {
      title = `${getMatchResultLabel(selectedMatchResult.value)} ${title}`;
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

  if (selectedMatchResult.value) {
    params.matchResult = selectedMatchResult.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getReconcileRecordListPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        handleTime: formatTimestamp(v.handleTime),
        createTime: formatTimestamp(v.createTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取对账记录列表失败:', error);
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

const handleCardClick = (matchResult) => {
  selectedMatchResult.value = matchResult;
  drawerGridApi.query();
  drawerApi.open();
};

const handleLineChartClick = (params) => {
  console.log('折线图点击事件触发:', params);
  if (params && params.name) {
    selectedMatchResult.value = null;
    drawerGridApi.query();
    drawerApi.open();
  }
};

const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'billNo', title: '对账单号', width: 180 },
      { field: 'orderNo', title: '订单编号', width: 180 },
      { field: 'sysAmount', title: '系统金额', width: 120 },
      { field: 'merchantAmount', title: '商户上报金额', width: 140 },
      { field: 'diffAmount', title: '差异金额', width: 120 },
      { field: 'matchResult', title: '对账结果', width: 120,
        slots: { default: 'matchResult' }
      },
      { field: 'diffReason', title: '异常原因', width: 200 },
      { field: 'handleTime', title: '处理时间', width: 180 },
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

const fetchReconcileRecordChartData = async () => {
  try {
    const res = await getReconcileRecordChart();
    state.cardList[0].value = res.cardData?.unmatchedCount || res.unmatchedCount || 0;
    state.cardList[1].value = res.cardData?.totalCount || res.totalCount || 0;
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-27', count: 10 },
          ];
    updateChart();
  } catch (error) {
    console.error('获取对账记录图表数据失败:', error);
    state.cardList[0].value = 2;
    state.cardList[1].value = 10;
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
  fetchReconcileRecordChartData().then(() => {
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
        @click="handleCardClick(item.matchResult)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #matchResult="{ row }">
        <el-tag :type="getMatchResultType(row.matchResult)">
          {{ getMatchResultLabel(row.matchResult) }}
        </el-tag>
      </template>
    </DrawerGrid>
  </Drawer>
</template>

<style scoped lang="scss"> 
 
.left-card {
  flex:1;
  width: 330px; 

  :deep(.stat-card) {
    flex:1;
  }
}
</style>

