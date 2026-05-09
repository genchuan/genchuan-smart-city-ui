<script setup>
import { onMounted, reactive, ref, computed } from 'vue';

import * as echarts from 'echarts';

import { getTempParkOrderChart, getTempParkOrderPage } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ElMessage, ElTag } from 'element-plus';
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
    { title: '今日订单量', value: 0, color: '#13ce66' },
    { title: '今日营收', value: 0, color: '#4ECDC4' },
    { title: '今日支付率（%）', value: 0, color: '#FF6B6B' },
  ],
  trendData: [],
  stationData: [],
});

// 当前选中的日期（用于折线图点击后筛选）
const selectedDate = ref(null);

// 当前选中的订单状态（用于柱状图点击后筛选）
const selectedStatus = ref(null);

// 是否使用日期筛选（点击卡片或折线图时为true，点击柱状图时为false）
const useDateFilter = ref(true);

// 抽屉配置
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '';
    if (selectedDate.value) {
      title = `${selectedDate.value} `;
    } else {
      title = '今日 ';
    }
    if (selectedStatus.value) {
      title += `${statusMap[selectedStatus.value]?.label || selectedStatus.value} `;
    }
    title += '订单列表';
    return title;
  }),
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

// 获取今天的开始和结束时间
const getTodayTimeRange = () => {
  const today = new Date();
  const start = today.toISOString().split('T')[0] + ' 00:00:00';
  const end = today.toISOString().split('T')[0] + ' 23:59:59';
  return { start, end };
};

// 抽屉搜索条件
const drawerSearchObj = reactive({});

// 抽屉表格数据获取
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
    } else {
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
    const res = await getTempParkOrderPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        archiveTime: formatTimestamp(v.archiveTime),
        createOrderTime: formatTimestamp(v.createOrderTime),
        updateTime: formatTimestamp(v.updateTime),
        createTime: formatTimestamp(v.createTime),
        payTime: formatTimestamp(v.payTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取订单列表失败:', error);
    ElMessage.error('获取订单列表失败');
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

// 点击卡片事件
const handleCardClick = () => {
  // 设置为null表示使用当日日期
  selectedDate.value = null;
  // 重置状态筛选
  selectedStatus.value = null;
  // 使用日期筛选
  useDateFilter.value = true;
  // 刷新表格数据
  drawerGridApi.query();
  drawerApi.open();
};

// 折线图点击事件处理
const handleLineChartClick = (params) => {
  console.log('折线图点击事件触发:', params);
  if (params && params.name) {
    selectedDate.value = params.name;
    // 重置状态筛选
    selectedStatus.value = null;
    // 使用日期筛选
    useDateFilter.value = true;
    drawerGridApi.query();
    drawerApi.open();
  }
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  console.log('柱状图点击事件触发:', params);
  if (params && params.name) {
    // 根据中文状态名称找到对应的英文状态值
    const statusKey = Object.keys(statusMap).find(key => statusMap[key].label === params.name);
    if (statusKey) {
      selectedStatus.value = statusKey;
    } else {
      // 如果找不到映射，直接使用名称作为状态值
      selectedStatus.value = params.name;
    }
    // 重置日期筛选
    selectedDate.value = null;
    // 不使用日期筛选（只传状态参数）
    useDateFilter.value = false;
    drawerGridApi.query();
    drawerApi.open();
  }
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

// 获取订单图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getTempParkOrderChart();
    // 从 cardData 中获取卡片数据
    if (res.cardData) {
      state.cardList[0].value = res.cardData.todayOrderCount || 0;
      state.cardList[1].value = res.cardData.todayRevenue || 0;
      state.cardList[2].value = res.cardData.payRate || 0;
    } else {
      state.cardList[0].value = res.todayOrderCount || 0;
      state.cardList[1].value = res.todayRevenue || 0;
      state.cardList[2].value = res.payRate || 0;
    }
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
    // 使用 stationData 作为订单状态数据（兼容旧的 typeData）
    state.stationData = res.stationData || res.typeData || [];
    // 更新折线图
    updateLineChart();
  } catch (error) {
    console.error('获取订单图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 50;
    state.cardList[1].value = 1500;
    state.cardList[2].value = 85;
    state.trendData = [
      { date: '2025-04-01', count: 12 },
      { date: '2025-04-02', count: 15 },
      { date: '2025-04-03', count: 8 },
      { date: '2025-04-05', count: 20 },
      { date: '2025-04-05', count: 14 },
    ];
    state.stationData = [
      { count: 2, status: 'completed' },
      { count: 4, status: 'paid' },
      { count: 1, status: 'charging' },
      { count: 1, status: 'cancelled' },
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
      <Card
        class="left-card cursor-pointer"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
    <Columnar
       class="simple-bar-chart"
      title="订单类型分布"
      :x-data="
        state.stationData.map(
          (item) => statusMap[item.status]?.label || item.status,
        )
      "
      :series-data="[
        { name: '订单数', data: state.stationData.map((item) => item.count) },
      ]"
      @bar-click="handleBarChartClick"
    />
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
        <ElTag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
    </DrawerGrid>
  </Drawer>
</template>
