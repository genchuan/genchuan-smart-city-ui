<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';
import { ElMessage, ElTag } from 'element-plus';

import { getDebtRecordCollectTrackChart, getDebtRecordCollectTrackPage } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import { useGridColumns } from './data';

// 追缴方式映射
const methodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

// 状态映射
const statusMap = {
  pending: { label: '待推送', type: 'warning' },
  collecting: { label: '追缴中', type: 'primary' },
  completed: { label: '已完成', type: 'success' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 获取追缴方式标签
const getMethodLabel = (method) => {
  return methodMap[method]?.label || method;
};

// 获取追缴方式类型
const getMethodType = (method) => {
  return methodMap[method]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '待追缴数', value: 0, color: '#FF6B6B' },
    { title: '追缴完成率', value: 0, color: '#4ECDC4', suffix: '%' },
  ],
  trendData: [],
  methodData: [],
});

// 当前选中的日期（用于折线图点击后筛选）
const selectedDate = ref(null);

// 当前选中的追缴方式（用于柱状图点击后筛选）
const selectedMethod = ref(null);

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
    }
    if (selectedMethod.value) {
      title += `${methodMap[selectedMethod.value]?.label || selectedMethod.value} `;
    }
    title += '追缴记录列表';
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

// 抽屉表格数据获取
const getDrawerTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  // 如果选中了日期，添加日期参数
  if (selectedDate.value) {
    params.createTimeStart = selectedDate.value + ' 00:00:00';
    params.createTimeEnd = selectedDate.value + ' 23:59:59';
  }

  // 如果选中了追缴方式，添加追缴方式参数
  if (selectedMethod.value) {
    params.collectMethod = selectedMethod.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getDebtRecordCollectTrackPage(params);
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
    console.error('获取追缴记录列表失败:', error);
    ElMessage.error('获取追缴记录列表失败');
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

// 点击卡片事件
const handleCardClick = (index) => {
  if (index === 0) {
    // 待追缴数 → 查询全部
    selectedMethod.value = null;
  } else if (index === 1) {
    // 追缴完成率 → 查询全部
    selectedMethod.value = null;
  }
  drawerGridApi.query();
  drawerApi.open();
};

// 折线图点击事件处理
const handleLineChartClick = (params) => {
  console.log('折线图点击事件触发:', params);
  if (params && params.name) {
    selectedDate.value = params.name;
    // 重置追缴方式筛选
    selectedMethod.value = null;
    drawerGridApi.query();
    drawerApi.open();
  }
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  console.log('柱状图点击事件触发:', params);
  if (params && params.name) {
    // 根据中文追缴方式名称找到对应的英文值
    const methodKey = Object.keys(methodMap).find(key => methodMap[key].label === params.name);
    if (methodKey) {
      selectedMethod.value = methodKey;
      console.log('选中追缴方式:', selectedMethod.value);
    } else {
      selectedMethod.value = params.name;
      console.log('选中追缴方式 (未映射):', selectedMethod.value);
    }
    // 重置日期筛选
    selectedDate.value = null;
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

// 获取追缴跟踪图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtRecordCollectTrackChart();
    state.cardList[0].value = res.cardData?.waitCollectCount || res.waitCollectCount || 0;
    state.cardList[1].value = res.cardData?.collectCompleteRate || res.collectCompleteRate || 0;
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
    // 如果 methodData 为空，使用假数据
    state.methodData =
      res.methodData && Array.isArray(res.methodData) && res.methodData.length > 0
        ? res.methodData
        : [
            { method: 'sms', count: 7 },
            { method: 'notify', count: 4 },
            { method: 'phone', count: 4 },
          ];
    // 更新折线图
    updateLineChart();
    // 更新柱状图
    updateBarChart();
  } catch (error) {
    console.error('获取追缴跟踪图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 2;
    state.cardList[1].value = 20;
    state.trendData = [
      { date: '2025-04-01', count: 5 },
      { date: '2025-04-02', count: 8 },
      { date: '2025-04-03', count: 3 },
      { date: '2025-04-04', count: 12 },
      { date: '2025-04-05', count: 6 },
    ];
    state.methodData = [
      { method: 'sms', count: 7 },
      { method: 'notify', count: 4 },
      { method: 'phone', count: 4 },
    ];
    // 更新折线图
    updateLineChart();
    // 更新柱状图
    updateBarChart();
  }
};

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '追缴数量趋势',
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
    initBarChart();
  });

  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
    barChartInstance?.resize();
  });
});

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return;

  barChartInstance = echarts.init(barChartRef.value);

  const option = {
    title: {
      text: '追缴方式分布',
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
      data: state.methodData.map((item) => methodMap[item.method]?.label || item.method),
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
        name: '追缴数',
        type: 'bar',
        barWidth: '40%',
        data: state.methodData.map((item) => item.count),
        itemStyle: {
          color: (params) => {
            const method = state.methodData[params.dataIndex]?.method;
            return methodMap[method]?.color || '#4A90E2';
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  barChartInstance.setOption(option);

  // 添加点击事件监听
  barChartInstance.on('click', (params) => {
    handleBarChartClick(params);
  });
};

// 更新柱状图
const updateBarChart = () => {
  if (!barChartInstance) return;

  barChartInstance.setOption({
    xAxis: {
      data: state.methodData.map((item) => methodMap[item.method]?.label || item.method),
    },
    series: [
      {
        data: state.methodData.map((item) => item.count),
      },
    ],
  });
};

const lineChartRef = ref(null);
let lineChartInstance = null;

const barChartRef = ref(null);
let barChartInstance = null;

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
    <div ref="barChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #status="{ row }">
        <ElTag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <template #collectMethod="{ row }">
        <ElTag :type="getMethodType(row.collectMethod)">
          {{ getMethodLabel(row.collectMethod) }}
        </ElTag>
      </template>
      <template #trackNo="{ row }">
        {{ row.trackNo }}
      </template>
      <template #plateNo="{ row }">
        {{ row.plateNo }}
      </template>
    </DrawerGrid>
  </Drawer>
</template>
