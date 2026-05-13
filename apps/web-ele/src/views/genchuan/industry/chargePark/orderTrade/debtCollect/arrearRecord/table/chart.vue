<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';
import { ElMessage, ElTag } from 'element-plus';

import { getDebtRecordCollectChart, getDebtRecordCollectPage } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import { useGridColumns } from './data';

// 结清状态映射
const statusMap = {
  unpaid: { label: '未结清', type: 'warning' },
  cleared: { label: '已结清', type: 'success' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '欠费总额', value: 0, color: '#FF6B6B' },
    { title: '结清率', value: 0, color: '#4ECDC4', suffix: '%' },
  ],
  trendData: [],
});

// 当前选中的日期（用于折线图点击后筛选）
const selectedDate = ref(null);

// 抽屉配置
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: '欠费结清记录列表',
  class: 'genchuan-detail-drawer',
  onCancel() {
    drawerApi.close();
  },
});

// 抽屉表格数据对象
const drawerDataObj = reactive({
  total: 0,
  list: [],
  loading: false,
});

// 抽屉表格数据获取
const getDrawerTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  try {
    drawerDataObj.loading = true;
    const res = await getDebtRecordCollectPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
        remindTime: formatTimestamp(v.remindTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取欠费结清记录列表失败:', error);
    ElMessage.error('获取欠费结清记录列表失败');
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

// 点击卡片事件 - 显示全部数据
const handleCardClick = () => {
  drawerGridApi.query();
  drawerApi.open();
};

// 折线图点击事件处理
const handleLineChartClick = (params) => {
  console.log('折线图点击事件触发:', params);
  drawerGridApi.query();
  drawerApi.open();
};

// 抽屉表格配置 - 删除最后一个操作列
const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns().slice(0, -1),
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

// 获取欠费记录图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtRecordCollectChart();
    state.cardList[0].value = res.cardData?.totalArrearAmount || res.totalArrearAmount || 0;
    state.cardList[1].value = res.cardData?.clearRate || res.clearRate || 0;
    // 如果 trendData 为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2025-04-01', count: 5 },
            { date: '2025-04-02', count: 8 },
            { date: '2025-04-03', count: 3 },
            { date: '2025-04-04', count: 12 },
            { date: '2025-04-05', count: 6 },
          ];
    // 更新折线图
    updateLineChart();
  } catch (error) {
    console.error('获取欠费记录图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 375;
    state.cardList[1].value = 33.3;
    state.trendData = [
      { date: '2025-04-01', count: 5 },
      { date: '2025-04-02', count: 8 },
      { date: '2025-04-03', count: 3 },
      { date: '2025-04-04', count: 12 },
      { date: '2025-04-05', count: 6 },
    ];
    // 更新折线图
    updateLineChart();
  }
};

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '欠费记录趋势',
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

  // 添加点击事件监听
  lineChartInstance.on('click', (params) => {
    handleLineChartClick(params);
  });
};

// 更新折线图
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
      <template #status="{ row }">
        <ElTag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <template #recordNo="{ row }">
        {{ row.recordNo }}
      </template>
      <template #plateNo="{ row }">
        {{ row.plateNo }}
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
