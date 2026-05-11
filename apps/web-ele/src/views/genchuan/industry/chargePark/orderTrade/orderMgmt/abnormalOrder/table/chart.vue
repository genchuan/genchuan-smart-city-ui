<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import * as echarts from 'echarts';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage, ElTag } from 'element-plus';
import { getAbnormalOrderChart, getAbnormalOrderPage } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import { useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';

// 处置状态映射
const typeMap = {
  unhandled: { label: '未处理', type: 'danger' },
  handling: { label: '处理中', type: 'warning' },
  closed: { label: '已关闭', type: 'info' },
};

// 获取状态标签
const getTypeLabel = (typeValue) => {
  return typeMap[typeValue]?.label || typeValue || '未知';
};

// 获取状态类型
const getStatusType = (typeValue) => {
  return typeMap[typeValue]?.type || 'default';
};

// 订单类型映射
const orderTypeMap = {
  temp_park: { label: '临时停车' },
  offtime_park: { label: '错时停车' },
  car_charge: { label: '汽车充电' },
  bike_charge: { label: '两轮充电' },
  share_charge: { label: '共享充电' },
};

// 获取订单类型标签
const getOrderTypeLabel = (orderType) => {
  return orderTypeMap[orderType]?.label || orderType || '-';
};

// 异常类型映射
const abnormalTypeMap = {
  payment_error: { label: '支付异常' },
  billing_error: { label: '计费异常' },
  status_error: { label: '状态异常' },
};

// 获取异常类型标签
const getAbnormalTypeLabel = (abnormalType) => {
  return abnormalTypeMap[abnormalType]?.label || abnormalType || '-';
};

// 格式化时间
const formatTime = (time) => {
  if (!time) return '-';
  return time;
};

// 打开详情
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
};

// 抽屉详情ref
const parkDetailDrawerRef = ref(null);
// 抽屉详情数据
const dataObj = reactive({
  detailObj: {},
});

const state = reactive({
  cardList: [
    { title: '待处理数量', value: 0, color: '#13ce66' },
    { title: '处理完成率(%)', value: 0, color: '#4ECDC4' },
  ],
  trendData: [],
  typeData: [],
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
      return `${selectedDate.value} ${getTypeLabel(selectedStatus.value)}订单`;
    }
    else if (selectedDate.value) {
      return `${selectedDate.value}订单`;
    }
    else if (selectedStatus.value) {
      return `${getTypeLabel(selectedStatus.value)}订单`;
    }
    return '订单列表';
  }),
  class: 'genchuan-detail-drawer',
  onCancel() {
    drawerApi.close();
  },
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
    const res = await getAbnormalOrderPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
        processTime: formatTimestamp(v.processTime),
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
const handleCardClick = (index) => {
  if (index === 0) {
    // 待处理数量 → 显示 unhandled
    selectedStatus.value = 'unhandled';
  }
  else if (index === 1) {
    // 处理完成率 → 显示 closed
    selectedStatus.value = 'closed';
  }
  selectedDate.value = null;
  useDateFilter.value = false;
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
    const statusKey = Object.keys(typeMap).find(key => typeMap[key].label === params.name);
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

// 获取异常订单图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getAbnormalOrderChart();
    // 从 cardData 获取卡片数据
    if (res.cardData) {
      state.cardList[0].value = res.cardData.waitProcessCount || 0;
      state.cardList[1].value = res.cardData.processCompleteRate || 0;
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
    // 如果typeData为空，使用假数据
    state.typeData =
      res.typeData && Array.isArray(res.typeData) && res.typeData.length > 0
        ? res.typeData
        : [
            { count: 5, status: 'unhandled' },
            { count: 3, status: 'handling' },
            { count: 12, status: 'closed' },
          ];
    // 更新折线图
    updateLineChart();
  } catch (error) {
    console.error('获取异常订单图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 15;
    state.cardList[1].value = 85;
    state.trendData = [
      { date: '2025-04-01', count: 5 },
      { date: '2025-04-02', count: 8 },
      { date: '2025-04-03', count: 3 },
      { date: '2025-04-04', count: 10 },
      { date: '2025-04-05', count: 6 },
    ];
    state.typeData = [
      { count: 5, status: 'unhandled' },
      { count: 3, status: 'handling' },
      { count: 12, status: 'closed' },
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
    <div class="chart-box-left chart-box-left-two ">
      <Card
        class="left-card cursor-pointer "
        v-for="(item, index) in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick(index)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
    <Columnar
      class="simple-bar-chart"
      title="异常类型分布"
      :x-data="state.typeData.map((item) => getTypeLabel(item.status))"
      :series-data="[
        { name: '数量', data: state.typeData.map((item) => item.count || 0) },
      ]"
      @bar-click="handleBarChartClick"
    />
  </div>

  <Drawer>
    <DrawerGrid>
      <template #id="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #orderType="{ row }">
        <el-tag type="primary">{{ getOrderTypeLabel(row.orderType) }}</el-tag>
      </template>
      <template #abnormalType="{ row }">
        <el-tag type="danger">{{ getAbnormalTypeLabel(row.abnormalType) }}</el-tag>
      </template>
      <template #status="{ row }">
        <ElTag :type="getStatusType(row.status)">
          {{ getTypeLabel(row.status) }}
        </ElTag>
      </template>
      <template #identifyTime="{ row }">
        {{ formatTime(row.identifyTime) }}
      </template>
      <template #createTime="{ row }">
        {{ formatTime(row.createTime) }}
      </template>
      <template #updateTime="{ row }">
        {{ formatTime(row.updateTime) }}
      </template>
      <template #processTime="{ row }">
        {{ formatTime(row.processTime) }}
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

  <ParkDetailDrawer
    ref="parkDetailDrawerRef"
    :detail-obj="dataObj.detailObj"
  />
</template>

<style scoped> 
.chart-box-left-two{
  justify-content: center !important; 
}
</style>
