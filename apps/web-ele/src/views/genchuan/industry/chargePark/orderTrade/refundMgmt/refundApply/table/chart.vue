<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';
import { ElMessage, ElTag } from 'element-plus';

import { getRefundApplyChart, getRefundApplyPage } from '#/api/genchuan/industry/chargePark/orderTrade/refundMgmt/index.js';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import { useGridColumns } from './data';

// 退款申请状态映射
const statusMap = {
  pending_audit: { label: '待审核', type: 'warning' },
  pending_exec: { label: '待执行', type: 'primary' },
  rejected: { label: '已拒绝', type: 'danger' },
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

const state = reactive({
  cardList: [
    { title: '待审核数', value: 0, color: '#FF6B6B', status: 'pending_audit' },
    { title: '审核通过率', value: 0, color: '#4ECDC4', suffix: '%', status: null },
  ],
  trendData: [],
  typeData: [],
});

// 当前选中的日期（用于折线图点击后筛选）
const selectedDate = ref(null);

// 当前选中的状态（用于柱状图点击后筛选）
const selectedStatus = ref(null);

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
    if (selectedStatus.value) {
      title += `${statusMap[selectedStatus.value]?.label || selectedStatus.value} `;
    }
    title += '退款申请列表';
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

// 抽屉表格数据获取
const getDrawerTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  // 如果选中了日期，添加日期参数
  if (selectedDate.value) {
    params.applyTimeStart = selectedDate.value + ' 00:00:00';
    params.applyTimeEnd = selectedDate.value + ' 23:59:59';
  }

  // 如果选中了状态，添加状态参数
  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getRefundApplyPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        auditTime: formatTimestamp(v.auditTime),
        applyTime: formatTimestamp(v.applyTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取退款申请列表失败:', error);
    ElMessage.error('获取退款申请列表失败');
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

// 点击卡片事件
const handleCardClick = (status) => {
  // 设置选中的状态
  selectedStatus.value = status;
  // 重置日期筛选
  selectedDate.value = null;
  // 查询数据并打开抽屉
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
    drawerGridApi.query();
    drawerApi.open();
  }
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  console.log('柱状图点击事件触发:', params);
  if (params && params.name) {
    // 根据中文状态名称找到对应的英文值
    const statusKey = Object.keys(statusMap).find(key => statusMap[key].label === params.name);
    if (statusKey) {
      selectedStatus.value = statusKey;
      console.log('选中状态:', selectedStatus.value);
    } else {
      selectedStatus.value = params.name;
      console.log('选中状态 (未映射):', selectedStatus.value);
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

const lineChartRef = ref(null);
let lineChartInstance = null;

const barChartRef = ref(null);
let barChartInstance = null;

// 获取退款申请图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getRefundApplyChart();
    state.cardList[0].value = res.cardData?.waitAuditCount || res.waitAuditCount || 0;
    state.cardList[1].value = res.cardData?.auditPassRate || res.auditPassRate || 0;
    // 如果 trendData 为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-27', count: 15 },
            { date: '2026-04-28', count: 1 },
            { date: '2026-05-08', count: 2 },
          ];
    // 如果 typeData 为空，使用假数据
    state.typeData =
      res.typeData && Array.isArray(res.typeData) && res.typeData.length > 0
        ? res.typeData
        : [
            { count: 8, status: 'pending_audit' },
            { count: 3, status: 'pending_exec' },
            { count: 2, status: 'rejected' },
            { count: 5, status: 'completed' },
          ];
    // 更新图表
    updateLineChart();
    updateBarChart();
  } catch (error) {
    console.error('获取退款申请图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 8;
    state.cardList[1].value = 27.8;
    state.trendData = [
      { date: '2026-04-27', count: 15 },
      { date: '2026-04-28', count: 1 },
      { date: '2026-05-08', count: 2 },
    ];
    state.typeData = [
      { count: 8, status: 'pending_audit' },
      { count: 3, status: 'pending_exec' },
      { count: 2, status: 'rejected' },
      { count: 5, status: 'completed' },
    ];
    // 更新图表
    updateLineChart();
    updateBarChart();
  }
};

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '退款申请趋势',
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

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return;

  barChartInstance = echarts.init(barChartRef.value);

  const option = {
    title: {
      text: '申请状态分布',
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
      data: state.typeData.map((item) => statusMap[item.status]?.label || item.status),
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
        name: '数量',
        type: 'bar',
        barWidth: '40%',
        data: state.typeData.map((item) => item.count),
        itemStyle: {
          color: (params) => {
            const status = state.typeData[params.dataIndex]?.status;
            return statusMap[status]?.color || '#4A90E2';
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
      data: state.typeData.map((item) => statusMap[item.status]?.label || item.status),
    },
    series: [
      {
        data: state.typeData.map((item) => item.count),
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
    <div ref="barChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #status="{ row }">
        <ElTag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <template #applyNo="{ row }">
        {{ row.applyNo }}
      </template>
    </DrawerGrid>
  </Drawer>
</template>
