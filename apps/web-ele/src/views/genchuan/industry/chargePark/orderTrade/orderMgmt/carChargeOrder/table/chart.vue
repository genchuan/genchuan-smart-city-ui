<script setup>import { onMounted, reactive, ref, computed } from 'vue';
import * as echarts from 'echarts';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage, ElTag } from 'element-plus';
import { getCarChargeOrderChart, getCarChargeOrderPage } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import { useGridColumns } from './data';
// 订单状态映射
const statusMap = {
  charging: { label: '充电中', type: 'primary' },
  pending_pay: { label: '待支付', type: 'warning' },
  paid: { label: '已支付', type: 'success' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'info' },
  refunding: { label: '退款中', type: 'danger' },
};
const state = reactive({
  cardList: [
    { title: '今日订单量', value: 0, color: '#13ce66' },
    { title: '今日营收', value: 0, color: '#4ECDC4' },
    { title: '今日充电量', value: 0, color: '#FF6B6B' },
  ],
  trendData: [],
  stationData: [],
});
const lineChartRef = ref(null);
let lineChartInstance = null;
// 选中的日期和状态
const selectedDate = ref(null);
const selectedStatus = ref(null);
const useDateFilter = ref(true);
// 获取今日时间范围
const getTodayTimeRange = () => {
  const today = new Date();
  const start = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 00:00:00`;
  const end = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 23:59:59`;
  return { start, end };
};
// 抽屉配置
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    if (selectedDate.value && selectedStatus.value) {
      return `${selectedDate.value} ${statusMap[selectedStatus.value]?.label || selectedStatus.value}订单`;
    }
    else if (selectedDate.value) {
      return `${selectedDate.value}订单`;
    }
    else if (selectedStatus.value) {
      return `${statusMap[selectedStatus.value]?.label || selectedStatus.value}订单`;
    }
    return '订单列表';
  }),
  onCancel() {
    drawerApi.close();
  },
  class: 'genchuan-detail-drawer',
  onConfirm() { },
});
// 抽屉表格数据
const drawerDataObj = reactive({
  total: 0,
  list: [],
  loading: false,
});
const drawerSearchObj = reactive({});
// 获取抽屉表格数据
const getDrawerTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };
  // 如果使用日期筛选，添加日期参数
  if (useDateFilter.value) {
    let start, end;
    if (selectedDate.value) {
      start = selectedDate.value + ' 00:00:00';
      end = selectedDate.value + ' 23:59:59';
    }
    else {
      ({ start, end } = getTodayTimeRange());
    }
    params.createOrderTimeStart = start;
    params.createOrderTimeEnd = end;
  }
  // 如果选中了状态，传递状态参数
  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }
  Object.assign(params, drawerSearchObj);
  try {
    drawerDataObj.loading = true;
    const res = await getCarChargeOrderPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        createOrderTime: formatTimestamp(v.createOrderTime),
        payTime: formatTimestamp(v.payTime),
        startTime: formatTimestamp(v.startTime),
        endTime: formatTimestamp(v.endTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return drawerDataObj;
  }
  catch (error) {
    console.error('获取订单列表失败:', error);
    ElMessage.error('获取订单列表失败');
    return drawerDataObj;
  }
  finally {
    drawerDataObj.loading = false;
  }
};
// 抽屉表格
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
// 点击卡片事件
const handleCardClick = () => {
  selectedDate.value = null;
  selectedStatus.value = null;
  useDateFilter.value = true;
  drawerGridApi.query();
  drawerApi.open();
};
// 折线图点击事件处理
const handleLineChartClick = (params) => {
  if (params && params.name) {
    selectedDate.value = params.name;
    selectedStatus.value = null;
    useDateFilter.value = true;
    drawerGridApi.query();
    drawerApi.open();
  }
};
// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  if (params && params.name) {
    const statusKey = Object.keys(statusMap).find(key => statusMap[key].label === params.name);
    if (statusKey) {
      selectedStatus.value = statusKey;
    }
    else {
      selectedStatus.value = params.name;
    }
    selectedDate.value = null;
    useDateFilter.value = false;
    drawerGridApi.query();
    drawerApi.open();
  }
};

// 获取订单图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getCarChargeOrderChart();
    state.cardList[0].value = res.todayOrderCount;
    state.cardList[1].value = res.todayRevenue;
    state.cardList[2].value = res.todayChargeQuantity;
    // 如果trendData为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
          { date: '2025-04-01', count: 12 },
          { date: '2025-04-02', count: 15 },
          { date: '2025-04-03', count: 8 },
          { date: '2025-04-04', count: 20 },
          { date: '2025-04-05', count: 14 },
        ];
    state.stationData =
      res.stationData && res.stationData.length > 0
        ? res.stationData
        : [
          { name: '丰泽站', count: 25 },
          { name: '鲤城站', count: 18 },
        ];
    // 更新折线图
    updateLineChart();
  } catch (error) {
    console.error('获取订单图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 50;
    state.cardList[1].value = 1500;
    state.cardList[2].value = 120;
    state.trendData = [
      { date: '2025-04-01', count: 12 },
      { date: '2025-04-02', count: 15 },
      { date: '2025-04-03', count: 8 },
      { date: '2025-04-04', count: 20 },
      { date: '2025-04-05', count: 14 },
    ];
    state.stationData = [
      { name: '丰泽站', value: 25 },
      { name: '鲤城站', value: 18 },
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
      text: '订单量趋势',
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

  // 添加折线图点击事件监听（通过Zr层捕获点击）
  lineChartInstance.getZr().on('click', (e) => {
    const pointInPixel = [e.offsetX, e.offsetY];
    const pointInGrid = lineChartInstance.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
    const xIndex = pointInGrid[0];
    if (xIndex >= 0 && xIndex < state.trendData.length) {
      const clickedData = state.trendData[xIndex];
      handleLineChartClick({ name: clickedData.date, value: clickedData.count });
    }
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
      <Card class="left-card cursor-pointer" v-for="item in state.cardList" :key="item.title" v-bind="item"
        @click="handleCardClick" />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
    <Columnar class="simple-bar-chart" title="订单状态分布" :x-data="state.stationData.map(
      (item) => statusMap[item.status]?.label || item.status,
    )
      " :series-data="[
        { name: '订单数', data: state.stationData.map((item) => item.count) },
      ]" @bar-click="handleBarChartClick" />
  </div>

  <Drawer>
    <DrawerGrid>
      <template #orderNo="{ row }">
        {{ row.orderNo }}
      </template>
      <template #plateNo="{ row }">
        {{ row.plateNo }}
      </template>
      <template #status="{ row }">
        <el-tag :type="statusMap[row.status]?.type || 'default'">
          {{ statusMap[row.status]?.label || row.status }}
        </el-tag>
      </template>
      <template #payMethod="{ row }">
        <span v-if="row.payMethod === 'wechat'">微信</span>
        <span v-else-if="row.payMethod === 'alipay'">支付宝</span>
        <span v-else-if="row.payMethod === 'bank'">银行卡</span>
        <span v-else-if="row.payMethod === 'cash'">现金</span>
        <span v-else>{{ row.payMethod }}</span>
      </template>
    </DrawerGrid>
  </Drawer>
</template>
