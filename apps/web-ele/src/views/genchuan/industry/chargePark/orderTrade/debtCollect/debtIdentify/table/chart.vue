<script setup>
import { onMounted, reactive, ref, computed } from 'vue';

import * as echarts from 'echarts';

import { getDebtIdentifyChart, getDebtIdentifyPage } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ElMessage } from 'element-plus';
import { formatTimestamp } from '#/utils';
import { useGridColumns } from './data';

// 逃费识别状态映射
const statusMap = {
  pending: { label: '待识别', type: 'warning' },
  identified: { label: '已识别', type: 'success' },
  marked: { label: '已标记（非逃费）', type: 'info' },
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
    { title: '待识别数量', value: 0, color: '#13ce66' },
    { title: '识别成功率(%)', value: 0, color: '#4ECDC4' },
  ],
  trendData: [],
  typeData: [],
});

// 当前选中的日期（用于折线图点击后筛选）
const selectedDate = ref(null);

// 当前选中的状态（用于柱状图点击后筛选）
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
    title += '逃费识别列表';
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
    params.identifyTimeStart = start;
    params.identifyTimeEnd = end;
  }

  // 如果选中了状态，传递状态参数
  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }

  Object.assign(params, drawerSearchObj);

  try {
    drawerDataObj.loading = true;
    const res = await getDebtIdentifyPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        identifyTime: formatTimestamp(v.identifyTime),
        markTime: formatTimestamp(v.markTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取逃费识别列表失败:', error);
    ElMessage.error('获取逃费识别列表失败');
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

// 点击卡片事件
const handleCardClick = (index) => {
  if (index === 0) {
    // 待识别数量 → pending，不加时间参数
    selectedStatus.value = 'pending';
    selectedDate.value = null;
    useDateFilter.value = false;
  } else if (index === 1) {
    // 识别成功率 → 不筛选状态，显示全部
    selectedStatus.value = null;
    selectedDate.value = null;
    useDateFilter.value = false;
  }
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
      console.log('选中状态:', selectedStatus.value);
    } else {
      selectedStatus.value = params.name;
      console.log('选中状态(未映射):', selectedStatus.value);
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

// 获取逃费识别图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtIdentifyChart();
    // 从 cardData 获取卡片数据
    if (res.cardData) {
      state.cardList[0].value = res.cardData.waitIdentifyCount || 0;
      state.cardList[1].value = res.cardData.identifySuccessRate || 0;
    } else {
      state.cardList[0].value = res.waitIdentifyCount || 0;
      state.cardList[1].value = res.identifySuccessRate || 0;
    }
    // 如果trendData为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2025-04-01', count: 5 },
            { date: '2025-04-02', count: 8 },
            { date: '2025-04-03', count: 3 },
            { date: '2025-04-04', count: 10 },
            { date: '2025-04-05', count: 6 },
          ];
    // 如果stationData为空，使用假数据
    state.typeData =
      res.stationData && Array.isArray(res.stationData) && res.stationData.length > 0
        ? res.stationData
        : [
            { count: 5, status: 'pending' },
            { count: 12, status: 'identified' },
            { count: 3, status: 'marked' },
          ];
    // 更新折线图
    updateLineChart();
  } catch (error) {
    console.error('获取逃费识别图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 10;
    state.cardList[1].value = 90;
    state.trendData = [
      { date: '2025-04-01', count: 5 },
      { date: '2025-04-02', count: 8 },
      { date: '2025-04-03', count: 3 },
      { date: '2025-04-04', count: 10 },
      { date: '2025-04-05', count: 6 },
    ];
    state.typeData = [
      { count: 5, status: 'pending' },
      { count: 12, status: 'identified' },
      { count: 3, status: 'marked' },
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
      text: '识别数量趋势',
      left: 'center',
      textStyle: {
        color: '#6E7E81',
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
        v-for="(item, index) in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick(index)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
    <Columnar
      class="simple-bar-chart"
      title="识别状态分布"
      :x-data="state.typeData.map((item) => statusMap[item.status]?.label || item.status)"
      :series-data="[
        { name: '订单数', data: state.typeData.map((item) => item.count) },
      ]"
      @bar-click="handleBarChartClick"
    />
  </div>

  <Drawer>
    <DrawerGrid>
      <template #status="{ row }">
        <ElTag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <template #identifyNo="{ row }">
        {{ row.identifyNo }}
      </template>
      <template #plateNo="{ row }">
        {{ row.plateNo }}
      </template>
      <template #payMethod="{ row }">
        <span v-if="row.payMethod === 'wechat'">微信</span>
        <span v-else-if="row.payMethod === 'alipay'">支付宝</span>
        <span v-else-if="row.payMethod === 'bank'">银行卡</span>
        <span v-else-if="row.payMethod === 'cash'">现金</span>
        <span v-else>{{ row.payMethod || '-' }}</span>
      </template>
    </DrawerGrid>
  </Drawer>
</template>
