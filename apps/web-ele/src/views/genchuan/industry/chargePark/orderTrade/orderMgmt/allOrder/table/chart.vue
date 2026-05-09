<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { getOrderChart, getOrderPage } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';
import * as echarts from 'echarts';

// 订单状态映射
const statusMap = {
  charging: { label: '充电中', type: 'primary' },
  pending_pay: { label: '待支付', type: 'warning' },
  paid: { label: '已支付', type: 'success' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'info' },
  refunding: { label: '退款中', type: 'danger' },
};

// 抽屉配置
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: '今日订单列表',
  onCancel() {
    drawerApi.close();
  },
});

// 抽屉表格数据
const drawerTableData = ref([]);
const drawerLoading = ref(false);

const state = reactive({
  cardList: [
    { title: '今日订单量', value: 0, color: '#13ce66' },
    { title: '今日营收', value: 0, color: '#4ECDC4' },
    { title: '今日支付率（%）', value: 0, color: '#FF6B6B' },
  ],
  trendData: [],
  stationData: [],
});

// 获取今天的开始和结束时间
const getTodayTimeRange = () => {
  const today = new Date();
  const start = today.toISOString().split('T')[0] + ' 00:00:00';
  const end = today.toISOString().split('T')[0] + ' 23:59:59';
  return { start, end };
};

// 点击卡片事件
const handleCardClick = async (title) => {
  const { start, end } = getTodayTimeRange();
  const params = {
    pageNo: 1,
    pageSize: 10,
    createOrderTimeStart: start,
    createOrderTimeEnd: end,
  };

  try {
    drawerLoading.value = true;
    const res = await getOrderPage(params);
    drawerTableData.value = res.list || [];
    drawerApi.open();
  } catch (error) {
    console.error('获取订单列表失败:', error);
    ElMessage.error('获取订单列表失败');
  } finally {
    drawerLoading.value = false;
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取订单图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getOrderChart();
    if (res.cardData) {
      const { trendData, typeData, cardData } = res;
      state.cardList[0].value = cardData?.todayOrderCount || 0;
      state.cardList[1].value = cardData?.todayRevenue || 0;
      state.cardList[2].value = cardData?.payRate || 0;
      // 如果trendData为空，使用假数据
      state.trendData = trendData && trendData.length > 0 ? trendData : [
        { date: '2025-04-01', count: 8 },
        { date: '2025-04-02', count: 10 },
        { date: '2025-04-03', count: 12 },
        { date: '2025-04-04', count: 9 },
        { date: '2025-04-05', count: 15 },
      ];
      // 使用typeData作为订单状态数据展示，X轴显示中文状态名称
      state.stationData = typeData && typeData.length > 0 ? typeData.map(item => ({
        name: statusMap[item.status]?.label || item.status,
        value: item.count
      })) : [
        { name: '丰泽站', value: 20 },
        { name: '鲤城站', value: 15 },
        { name: '晋江站', value: 12 },
        { name: '石狮站', value: 8 },
      ];
    } else {
      // 接口返回失败，使用假数据
      state.trendData = [
        { date: '2025-04-01', count: 8 },
        { date: '2025-04-02', count: 10 },
        { date: '2025-04-03', count: 12 },
        { date: '2025-04-04', count: 9 },
        { date: '2025-04-05', count: 15 },
      ];
      state.stationData = [
        { name: '丰泽站', value: 20 },
        { name: '鲤城站', value: 15 },
        { name: '晋江站', value: 12 },
        { name: '石狮站', value: 8 },
      ];
    }
  } catch (error) {
    console.error('获取订单图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 12;
    state.cardList[1].value = 180.0;
    state.cardList[2].value = 99.0;
    state.trendData = [
      { date: '2025-04-01', count: 8 },
      { date: '2025-04-02', count: 10 },
      { date: '2025-04-03', count: 12 },
      { date: '2025-04-04', count: 9 },
      { date: '2025-04-05', count: 15 },
    ];
    state.stationData = [
      { name: '丰泽站', value: 20 },
      { name: '鲤城站', value: 15 },
      { name: '晋江站', value: 12 },
      { name: '石狮站', value: 8 },
    ];
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
      data: state.trendData.map(item => item.date),
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
        data: state.trendData.map(item => item.count),
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
};

// 更新折线图
const updateLineChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.trendData.map(item => item.date),
    },
    series: [
      {
        data: state.trendData.map(item => item.count),
      },
    ],
  });
};

onMounted(async () => {
  // 先获取数据，再初始化图表
  await fetchOrderChartData();
  initLineChart();

  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
  });
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <Card class="left-card cursor-pointer" v-for="item in state.cardList" :key="item.title" v-bind="item" @click="handleCardClick(item.title)" />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart" />
    <Columnar class="simple-bar-chart" title="各场站订单量" :x-data="state.stationData.map(item => item.name)"
      :series-data="[{ name: '订单数', data: state.stationData.map(item => item.value) }]" />
  </div>

  <Drawer>
    <div v-if="drawerLoading" class="flex justify-center items-center py-8">
      <div class="loading"></div>
    </div>
    <div v-else-if="drawerTableData.length === 0" class="text-center py-8 text-gray-500">
      暂无订单数据
    </div>
    <div v-else class="overflow-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-50">
            <th class="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">订单编号</th>
            <th class="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">场站名称</th>
            <th class="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">订单类型</th>
            <th class="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">订单金额</th>
            <th class="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">订单状态</th>
            <th class="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">创建时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in drawerTableData" :key="item.id" class="hover:bg-gray-50">
            <td class="border border-gray-200 px-4 py-2 text-sm text-gray-900">{{ item.orderNo || '-' }}</td>
            <td class="border border-gray-200 px-4 py-2 text-sm text-gray-900">{{ item.stationName || '-' }}</td>
            <td class="border border-gray-200 px-4 py-2 text-sm text-gray-900">
              <span v-if="item.orderType === 'offtime_park'">错时停车</span>
              <span v-else-if="item.orderType === 'car_charge'">汽车充电</span>
              <span v-else-if="item.orderType === 'bike_charge'">两轮充电</span>
              <span v-else-if="item.orderType === 'share_charge'">共享充电</span>
              <span v-else>{{ item.orderType }}</span>
            </td>
            <td class="border border-gray-200 px-4 py-2 text-sm text-gray-900">{{ item.amount || 0 }} 元</td>
            <td class="border border-gray-200 px-4 py-2 text-sm">
              <span :class="['px-2 py-1 rounded text-xs', {
                'bg-green-100 text-green-800': item.status === 'paid' || item.status === 'completed',
                'bg-yellow-100 text-yellow-800': item.status === 'pending_pay',
                'bg-blue-100 text-blue-800': item.status === 'charging',
                'bg-gray-100 text-gray-800': item.status === 'cancelled',
                'bg-red-100 text-red-800': item.status === 'refunding',
              }]">
                {{ statusMap[item.status]?.label || item.status }}
              </span>
            </td>
            <td class="border border-gray-200 px-4 py-2 text-sm text-gray-900">{{ item.createTime || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Drawer>
</template>
