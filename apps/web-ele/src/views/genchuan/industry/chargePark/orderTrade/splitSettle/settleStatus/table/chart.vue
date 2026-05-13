<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElTag } from 'element-plus';

import { getSplitRateStatusChart, getSplitRateStatusPage } from '#/api/genchuan/industry/chargePark/orderTrade/splitSettle/index.js';
import { useVbenDrawer } from '@vben/common-ui';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';

const statusMap = {
  normal: { label: '正常', type: 'success' },
  abnormal: { label: '异常', type: 'danger' },
};

const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '完成率', value: 0, color: '#4ECDC4', suffix: '%', status: null },
    { title: '异常率', value: 0, color: '#FF6B6B', suffix: '%', status: 'abnormal' },
    { title: '正常数量', value: 0, color: '#13ce66', status: 'normal' },
  ],
  statusData: [],
});

const selectedStatus = ref(null);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '分账结算核查记录列表';
    if (selectedStatus.value) {
      title = `${statusMap[selectedStatus.value]?.label || selectedStatus.value} ${title}`;
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

  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getSplitRateStatusPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        checkTime: formatTimestamp(v.checkTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取分账结算核查记录列表失败:', error);
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

const handleCardClick = (status) => {
  selectedStatus.value = status;
  drawerGridApi.query();
  drawerApi.open();
};

const handleBarChartClick = (params) => {
  console.log('柱状图点击事件触发:', params);
  if (params && params.name) {
    const statusKey = params.name === '正常' ? 'normal' : 'abnormal';
    selectedStatus.value = statusKey;
    drawerGridApi.query();
    drawerApi.open();
  }
};

const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'id', title: '主键ID', width: 120 },
      { field: 'billId', title: '关联结算单据ID', width: 160 },
      { field: 'status', title: '状态', width: 120,
        slots: { default: 'status' }
      },
      { field: 'errorReason', title: '异常原因', width: 200 },
      { field: 'checkerId', title: '核查人ID', width: 120 },
      { field: 'checkTime', title: '核查时间', width: 180 },
      { field: 'creator', title: '创建者', width: 100 },
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

const fetchSettleStatusChartData = async () => {
  try {
    const res = await getSplitRateStatusChart();
    state.cardList[0].value = res.cardData?.completeRate || res.completeRate || 0;
    state.cardList[1].value = res.cardData?.abnormalRate || res.abnormalRate || 0;
    const normalData = res.statusData?.find(item => item.status === 'normal');
    state.cardList[2].value = normalData?.count || 0;
    state.statusData =
      res.statusData && res.statusData.length > 0
        ? res.statusData
        : [
            { status: 'normal', count: 9 },
            { status: 'abnormal', count: 1 },
          ];
    updateLineChart();
  } catch (error) {
    console.error('获取结算状态图表数据失败:', error);
    state.cardList[0].value = 90;
    state.cardList[1].value = 10;
    state.cardList[2].value = 9;
    state.statusData = [
      { status: 'normal', count: 9 },
      { status: 'abnormal', count: 1 },
    ];
    updateLineChart();
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '结算状态分布',
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
      formatter: (params) => {
        const data = params[0];
        return `<div style="padding: 8px;">
          <div style="font-weight: 500;">${data.name}</div>
          <div>数量：${data.value} 个</div>
        </div>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: state.statusData.map((item) => item.status === 'normal' ? '正常' : '异常'),
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'value',
      name: '数量',
      nameTextStyle: { color: '#6E7E91', fontSize: 12 },
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: state.statusData.map((item) => ({
          value: item.count,
          itemStyle: {
            color: item.status === 'normal' 
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4ECDC4' },
                  { offset: 1, color: '#44A08D' },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FF6B6B' },
                  { offset: 1, color: '#EE5A24' },
                ]),
          },
        })),
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
    ],
  };

  lineChartInstance.setOption(option);

  lineChartInstance.on('click', (params) => {
    handleBarChartClick(params);
  });
};

const updateLineChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.statusData.map((item) => item.status === 'normal' ? '正常' : '异常'),
    },
    series: [
      {
        data: state.statusData.map((item) => ({
          value: item.count,
          itemStyle: {
            color: item.status === 'normal' 
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4ECDC4' },
                  { offset: 1, color: '#44A08D' },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FF6B6B' },
                  { offset: 1, color: '#EE5A24' },
                ]),
          },
        })),
      },
    ],
  });
};

onMounted(() => {
  fetchSettleStatusChartData().then(() => {
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
        @click="handleCardClick(item.status)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DrawerGrid>
  </Drawer>
</template>
